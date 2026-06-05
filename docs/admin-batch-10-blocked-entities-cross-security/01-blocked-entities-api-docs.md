# Batch 10 API Documentation
## Blocked Entities + Cross-Security

## 1. Route Mount

The route is mounted under:

```http
/api/admin/blocked-entities
```

Related authentication endpoints:

```http
/api/auth-user/login
/api/auth-doctor/login
/api/auth-assistant/login
/api/auth-admin/login
```

---

# 2. Supported Entity Types

```text
user
doctor
assistant
admin
```

Table mapping used by controller:

| entity_type | table |
|---|---|
| `user` | `users` |
| `doctor` | `doctors` |
| `assistant` | `assistants` |
| `admin` | `admins` |

Blocked column mapping:

| entity_type | blocked_entities column |
|---|---|
| `user` | `blocked_user_id` |
| `doctor` | `blocked_doctor_id` |
| `assistant` | `blocked_assistant_id` |
| `admin` | `blocked_admin_id` |

---

# 3. Supported Block Types

```text
temporary
permanent
warning
```

Important:

`warning` currently behaves like a real active block because `blockEntity` creates an active `blocked_entities` record and updates the account status to `suspended`.

---

# 4. Permission Model

All routes use:

```text
authenticateJWT
authorizeAnyAdmin
```

Read routes are available to any admin.

Mutation routes add:

```text
authorizeSystemAdmin
```

That means only:

```text
super_admin
system_admin
```

can block/unblock/update/bulk/auto-unblock.

Extra rule:

```text
Only super_admin can block or unblock admin accounts.
```

Self-protection rule:

```text
An admin cannot block themselves.
```

---

# 5. Database Model

## 5.1 `blocked_entities`

Main fields:

| Field | Description |
|---|---|
| `blocked_user_id` | blocked user ID |
| `blocked_admin_id` | blocked admin ID |
| `blocked_doctor_id` | blocked doctor ID |
| `blocked_assistant_id` | blocked assistant ID |
| `blocked_by_admin_id` | admin who created block |
| `block_type` | `temporary`, `permanent`, `warning` |
| `blocked_until` | expiry date for temporary block |
| `reason` | required reason |
| `is_active` | active block flag |
| `removed_at` | unblock time |
| `removed_by_admin_id` | admin who removed block |

Important DB check:

Only one of `blocked_user_id`, `blocked_admin_id`, `blocked_doctor_id`, `blocked_assistant_id` can be non-null.

## 5.2 Related tables

| Table | Impact |
|---|---|
| `auth_tokens` | active tokens are revoked when an entity is blocked |
| `login_sessions` | active login sessions are ended when an entity is blocked |
| `admin_logs` | block/unblock/update/bulk actions are logged |
| `users`, `doctors`, `assistants`, `admins` | `status` changes to `suspended` on block and `active` on unblock |

---

# 6. Cross-Security Behavior

## 6.1 During Login

`SecurityService.authenticate` checks:

1. email exists
2. account lockout
3. `status === suspended`
4. active blocked entity record
5. password

If account is suspended:

```json
{
  "success": false,
  "message_en": "Account is suspended",
  "message_ar": "الحساب موقوف"
}
```

If account is blocked:

```json
{
  "success": false,
  "message_en": "Account is blocked",
  "message_ar": "الحساب مغلق"
}
```

In current normal block flow, status becomes `suspended`, so login is usually stopped at the suspended check before the blocked check.

## 6.2 During Protected API Calls

`authenticateJWT` checks:

1. token exists in `auth_tokens`
2. token is not revoked
3. token has not expired
4. entity exists
5. `status !== suspended`
6. entity is not actively blocked

After blocking, previously issued tokens should fail because the block flow revokes active tokens.

Expected response may be:

```json
{
  "error": "Token revoked or expired"
}
```

or:

```json
{
  "error": "Account is suspended"
}
```

depending on which check fails first.

---

# 7. Endpoints

## 7.1 List Blocked Entities

```http
GET /api/admin/blocked-entities
Authorization: Bearer <ADMIN_TOKEN>
```

### Query params

| Param | Type | Default | Allowed |
|---|---:|---:|---|
| `page` | number | 1 | any positive integer |
| `limit` | number | 20 | any positive integer |
| `entity_type` | enum | optional | user, doctor, assistant, admin |
| `block_type` | enum | optional | temporary, permanent, warning |
| `is_active` | string | true | true, false |
| `search` | string | optional | searches email, phone, reason |
| `sort_by` | enum | created_at | created_at, blocked_until, block_type, removed_at |
| `sort_order` | enum | DESC | ASC, DESC |

Example:

```http
GET /api/admin/blocked-entities?entity_type=user&is_active=true&page=1&limit=20
```

Expected response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0,
    "hasMore": false
  }
}
```

---

## 7.2 Get Statistics

```http
GET /api/admin/blocked-entities/statistics
Authorization: Bearer <ADMIN_TOKEN>
```

Returns:

```text
summary
top_blocking_admins
```

Summary includes:

```text
total_blocks
active_blocks
removed_blocks
blocked_users
blocked_doctors
blocked_assistants
blocked_admins
temporary_blocks
permanent_blocks
warning_blocks
blocks_last_week
blocks_last_month
unblocks_last_week
expiring_soon
```

---

## 7.3 Check Entity Block Status

```http
GET /api/admin/blocked-entities/check?entity_id=1&entity_type=user
Authorization: Bearer <ADMIN_TOKEN>
```

Expected active block response:

```json
{
  "success": true,
  "is_blocked": true,
  "block_info": {
    "id": 1,
    "block_type": "temporary",
    "blocked_until": "2026-06-10T00:00:00.000Z",
    "reason": "Reason text",
    "blocked_at": "2026-06-05T00:00:00.000Z",
    "blocked_by": "admin@example.com"
  }
}
```

Expected unblocked response:

```json
{
  "success": true,
  "is_blocked": false,
  "block_info": null
}
```

Important:

If a temporary block is expired, this endpoint sets `blocked_entities.is_active = 0` and returns unblocked. Current code does not restore the entity `status` to `active` inside this endpoint.

---

## 7.4 Get Block Details

```http
GET /api/admin/blocked-entities/:blockId
Authorization: Bearer <ADMIN_TOKEN>
```

Returns:

```text
block
entity
```

Not found:

```json
{
  "success": false,
  "message_ar": "سجل الحظر غير موجود",
  "message_en": "Block record not found"
}
```

---

## 7.5 Get Entity Block History

```http
GET /api/admin/blocked-entities/history/:entity_type/:entity_id?page=1&limit=20
Authorization: Bearer <ADMIN_TOKEN>
```

Example:

```http
GET /api/admin/blocked-entities/history/user/1?page=1&limit=20
```

Returns:

```text
entity
history
pagination
```

---

## 7.6 Block Entity

```http
POST /api/admin/blocked-entities/block
Authorization: Bearer <SYSTEM_ADMIN_OR_SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

### Temporary block body

```json
{
  "entity_id": 1,
  "entity_type": "user",
  "block_type": "temporary",
  "blocked_until": "2026-12-31T23:59:59.000Z",
  "reason": "Security test temporary block reason"
}
```

### Permanent block body

```json
{
  "entity_id": 1,
  "entity_type": "doctor",
  "block_type": "permanent",
  "reason": "Security test permanent block reason"
}
```

### Warning body

```json
{
  "entity_id": 1,
  "entity_type": "assistant",
  "block_type": "warning",
  "reason": "Security test warning reason"
}
```

Warning note:

Current implementation still sets account status to `suspended`, so do not treat `warning` as a non-blocking warning.

### Success response

```json
{
  "success": true,
  "message_ar": "تم حظر الكيان بنجاح",
  "message_en": "Entity blocked successfully",
  "data": {
    "block_id": 1,
    "entity_id": 1,
    "entity_type": "user",
    "block_type": "temporary",
    "blocked_until": "2026-12-31T23:59:59.000Z",
    "blocked_by": 2
  }
}
```

### Side effects

1. Inserts row in `blocked_entities`.
2. Updates entity status to `suspended`.
3. Revokes active tokens in `auth_tokens`.
4. Ends active sessions in `login_sessions`.
5. Logs admin action.

---

## 7.7 Unblock Entity

```http
POST /api/admin/blocked-entities/unblock
Authorization: Bearer <SYSTEM_ADMIN_OR_SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

Body:

```json
{
  "entity_id": 1,
  "entity_type": "user",
  "reason": "Security test unblock reason"
}
```

Success response:

```json
{
  "success": true,
  "message_ar": "تم إلغاء حظر الكيان بنجاح",
  "message_en": "Entity unblocked successfully",
  "data": {
    "entity_id": 1,
    "entity_type": "user",
    "previous_block": {
      "block_type": "temporary",
      "blocked_at": "2026-06-05T00:00:00.000Z",
      "blocked_by": 2
    }
  }
}
```

### Side effects

1. Updates active block row to `is_active = 0`.
2. Sets `removed_at`.
3. Sets `removed_by_admin_id`.
4. Updates entity status to `active`.
5. Logs admin action.

---

## 7.8 Update Block

```http
PATCH /api/admin/blocked-entities/:blockId
Authorization: Bearer <SYSTEM_ADMIN_OR_SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

Body examples:

```json
{
  "block_type": "permanent",
  "blocked_until": null,
  "reason": "Updated block reason for security testing"
}
```

or:

```json
{
  "blocked_until": "2026-12-31T23:59:59.000Z"
}
```

Success response:

```json
{
  "success": true,
  "message_ar": "تم تحديث سجل الحظر بنجاح",
  "message_en": "Block record updated successfully",
  "data": {
    "block_id": "1",
    "old_values": {},
    "new_values": {}
  }
}
```

---

## 7.9 Bulk Block

```http
POST /api/admin/blocked-entities/bulk/block
Authorization: Bearer <SYSTEM_ADMIN_OR_SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

Body:

```json
{
  "entities": [
    { "entity_id": 1, "entity_type": "user" },
    { "entity_id": 1, "entity_type": "doctor" }
  ],
  "block_type": "temporary",
  "blocked_until": "2026-12-31T23:59:59.000Z",
  "reason": "Bulk security test block reason"
}
```

Expected response:

```json
{
  "success": true,
  "message_ar": "تم حظر 2 كيان بنجاح",
  "message_en": "2 entities blocked successfully",
  "data": {
    "success": [],
    "failed": []
  }
}
```

Important:

Bulk block validates entity shape and active block duplication, but current code does not query each entity table to confirm the entity actually exists before inserting. Because of DB foreign keys, invalid IDs may fail the transaction.

---

## 7.10 Bulk Unblock

```http
POST /api/admin/blocked-entities/bulk/unblock
Authorization: Bearer <SYSTEM_ADMIN_OR_SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

Body:

```json
{
  "entities": [
    { "entity_id": 1, "entity_type": "user" },
    { "entity_id": 1, "entity_type": "doctor" }
  ],
  "reason": "Bulk security test unblock reason"
}
```

---

## 7.11 Auto-Unblock Expired Temporary Blocks

```http
POST /api/admin/blocked-entities/auto-unblock
Authorization: Bearer <SYSTEM_ADMIN_OR_SUPER_ADMIN_TOKEN>
```

Response:

```json
{
  "success": true,
  "message_ar": "تم إلغاء حظر 1 كيان منتهي الصلاحية",
  "message_en": "1 expired blocks removed",
  "unblocked_count": 1
}
```

Side effect:

Expired temporary blocks are deactivated and entity statuses are restored to `active`.

---

# 8. Error Cases

## Missing entity_id/entity_type

```json
{
  "success": false,
  "message_ar": "معرف الكيان ونوعه مطلوبان",
  "message_en": "Entity ID and type are required"
}
```

## Invalid entity type

```json
{
  "success": false,
  "message_ar": "نوع الكيان غير صحيح",
  "message_en": "Invalid entity type"
}
```

## Invalid block type

```json
{
  "success": false,
  "message_ar": "نوع الحظر غير صحيح. الأنواع المسموحة: temporary, permanent, warning",
  "message_en": "Invalid block type. Allowed types: temporary, permanent, warning"
}
```

## Short reason

```json
{
  "success": false,
  "message_ar": "سبب الحظر مطلوب ويجب أن يكون 10 أحرف على الأقل",
  "message_en": "Block reason is required and must be at least 10 characters"
}
```

## Temporary without blocked_until

```json
{
  "success": false,
  "message_ar": "تاريخ انتهاء الحظر مطلوب للحظر المؤقت",
  "message_en": "Block end date is required for temporary blocks"
}
```

## Temporary date in the past

```json
{
  "success": false,
  "message_ar": "تاريخ انتهاء الحظر يجب أن يكون في المستقبل",
  "message_en": "Block end date must be in the future"
}
```

## Already blocked

```json
{
  "success": false,
  "message_ar": "هذا الكيان محظور بالفعل",
  "message_en": "This entity is already blocked",
  "existing_block": {
    "id": 1,
    "block_type": "temporary",
    "blocked_until": "2026-12-31T23:59:59.000Z",
    "created_at": "2026-06-05T00:00:00.000Z"
  }
}
```

## Not blocked

```json
{
  "success": false,
  "message_ar": "هذا الكيان غير محظور",
  "message_en": "This entity is not blocked"
}
```

## Blocking self

```json
{
  "success": false,
  "message_ar": "لا يمكنك حظر نفسك",
  "message_en": "You cannot block yourself"
}
```

## Non-super admin blocks admin

```json
{
  "success": false,
  "message_ar": "فقط المدير الأعلى يمكنه حظر المديرين الآخرين",
  "message_en": "Only super admin can block other admins"
}
```

---

# 9. Frontend Integration Notes

Admin frontend should include:

1. Blocked entities list with:
   - entity type
   - entity id
   - email / phone
   - block type
   - active status
   - blocked until
   - reason
   - blocked by
   - removed by

2. Filters:
   - entity type
   - block type
   - is active
   - search
   - sort by / sort order

3. Block form:
   - entity type
   - entity id
   - block type
   - blocked until only for temporary
   - reason min 10 chars

4. Unblock form:
   - entity type
   - entity id
   - reason

5. Security validation:
   - after block, user/doctor/admin should not be able to use previous tokens
   - after unblock, login should work again if the entity was otherwise valid

6. Warnings:
   - Do not expose block/unblock admin options to non-super-admin.
   - Do not block the currently logged-in super admin during testing.
   - `warning` currently blocks the account like temporary/permanent.

---

# 10. Current Implementation Notes

## 10.1 Possible duplicate admin logs

Mutation routes use `adminActionLogger`, and the controller also calls `logAdminAction`. Because both log on success, you may see more than one `admin_logs` row for the same operation.

## 10.2 Check endpoint vs Auto-unblock

`GET /check` can deactivate an expired temporary block, but does not restore the account status to `active`.

`POST /auto-unblock` deactivates expired temporary blocks and restores account status.

## 10.3 Warning behaves as block

Even when `block_type = warning`, the controller updates account status to `suspended`, and auth checks treat any active block with null `blocked_until` as blocking.
