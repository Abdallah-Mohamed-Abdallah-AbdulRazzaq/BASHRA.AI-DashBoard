# Batch 10 Manual Testing Guide
## Blocked Entities + Cross-Security Testing

## 0. Variables

```text
base_url=http://localhost:3006

admin_token=<ANY_ADMIN_TOKEN>
system_admin_token=<SYSTEM_ADMIN_TOKEN>
super_admin_token=<SUPER_ADMIN_TOKEN>

user_token_before_block=<USER_TOKEN_BEFORE_BLOCK>
doctor_token_before_block=<DOCTOR_TOKEN_BEFORE_BLOCK>

target_user_id=<SAFE_TEST_USER_ID>
target_doctor_id=<SAFE_TEST_DOCTOR_ID>
target_assistant_id=<SAFE_TEST_ASSISTANT_ID>
target_admin_id=<SAFE_TEST_ADMIN_ID_NOT_YOUR_CURRENT_ADMIN>

block_id=<CREATED_BLOCK_ID>
future_date=2026-12-31T23:59:59.000Z
```

Important safety:

Do not block your only Super Admin account. Use a test user/doctor/assistant/admin.

---

# 1. Syntax Check and Server Run

Run:

```powershell
node --check routes/blockedEntitiesRoutes.js
node --check controllers/BlockedEntitiesController.js
node --check middleware/authMiddleware.js
node --check utils/SecurityService.js
node --check controllers/AuthController.js
nodemon app.js
```

Expected:

```text
No syntax errors
Server is running on port 3006
```

---

# 2. Pre-test Data Discovery

Run SQL:

```sql
SELECT id, uuid, email, status, is_active, last_login_at
FROM users
ORDER BY id DESC
LIMIT 20;

SELECT id, uuid, email, status, is_active, last_login_at
FROM doctors
ORDER BY id DESC
LIMIT 20;

SELECT id, uuid, email, status, is_active, last_login_at
FROM admins
ORDER BY id DESC
LIMIT 20;
```

Pick a safe test entity.

---

# 3. Login Before Block

Login as the target user before blocking:

```http
POST {{base_url}}/api/auth-user/login
Content-Type: application/json
```

Body:

```json
{
  "email": "{{target_user_email}}",
  "password": "{{target_user_password}}"
}
```

Save:

```text
user_token_before_block = response.tokens.accessToken
```

Validate token works:

```http
GET {{base_url}}/api/ai-dermatology/usage
Authorization: Bearer {{user_token_before_block}}
```

Expected:

```text
200 OK, assuming account is verified and has access.
```

---

# 4. List Blocked Entities

```http
GET {{base_url}}/api/admin/blocked-entities?page=1&limit=20&is_active=true
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
data array exists
pagination exists
```

---

# 5. Get Statistics

```http
GET {{base_url}}/api/admin/blocked-entities/statistics
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
data.summary exists
data.top_blocking_admins exists
```

---

# 6. Check Target Before Block

```http
GET {{base_url}}/api/admin/blocked-entities/check?entity_id={{target_user_id}}&entity_type=user
Authorization: Bearer {{admin_token}}
```

Expected:

```json
{
  "success": true,
  "is_blocked": false,
  "block_info": null
}
```

---

# 7. Block User Temporarily

```http
POST {{base_url}}/api/admin/blocked-entities/block
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "block_type": "temporary",
  "blocked_until": "{{future_date}}",
  "reason": "Security test temporary user block reason"
}
```

Expected:

```text
201 Created
success = true
data.block_id exists
data.entity_type = user
data.block_type = temporary
```

Save:

```text
block_id = data.block_id
```

SQL verification:

```sql
SELECT *
FROM blocked_entities
WHERE id = <block_id>;

SELECT id, email, status, updated_at
FROM users
WHERE id = <target_user_id>;

SELECT id, user_id, token_type, is_revoked, revoked_at, revoked_by_admin_id
FROM auth_tokens
WHERE user_id = <target_user_id>
ORDER BY id DESC;

SELECT id, user_id, is_active, ended_at
FROM login_sessions
WHERE user_id = <target_user_id>
ORDER BY id DESC;

SELECT id, admin_id, action, target_type, target_id, old_values, new_values, created_at
FROM admin_logs
WHERE target_id = <target_user_id>
  AND target_type = 'user'
ORDER BY id DESC
LIMIT 10;
```

Expected DB:

```text
blocked_entities.is_active = 1
users.status = suspended
auth_tokens.is_revoked = 1 for active tokens
login_sessions.is_active = 0 for active sessions
admin_logs contains BLOCK_ENTITY, possibly more than one row
```

---

# 8. Cross-Security: Old Token Must Fail

Use the token saved before block:

```http
GET {{base_url}}/api/ai-dermatology/usage
Authorization: Bearer {{user_token_before_block}}
```

Expected:

```text
403
```

Possible response:

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

---

# 9. Cross-Security: Login Must Fail While Blocked

```http
POST {{base_url}}/api/auth-user/login
Content-Type: application/json
```

Body:

```json
{
  "email": "{{target_user_email}}",
  "password": "{{target_user_password}}"
}
```

Expected:

```text
401 Unauthorized
```

Common response because block flow sets status to suspended:

```json
{
  "success": false,
  "message_en": "Account is suspended",
  "message_ar": "الحساب موقوف"
}
```

If status was not suspended but an active block exists, expected:

```json
{
  "success": false,
  "message_en": "Account is blocked",
  "message_ar": "الحساب مغلق"
}
```

---

# 10. Check Target After Block

```http
GET {{base_url}}/api/admin/blocked-entities/check?entity_id={{target_user_id}}&entity_type=user
Authorization: Bearer {{admin_token}}
```

Expected:

```text
success = true
is_blocked = true
block_info.id = block_id
```

---

# 11. Get Block Details

```http
GET {{base_url}}/api/admin/blocked-entities/{{block_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
success = true
data.block.id = block_id
data.entity.id = target_user_id
```

---

# 12. Get Entity Block History

```http
GET {{base_url}}/api/admin/blocked-entities/history/user/{{target_user_id}}?page=1&limit=20
Authorization: Bearer {{admin_token}}
```

Expected:

```text
success = true
entity.id = target_user_id
history includes block_id
pagination exists
```

---

# 13. Duplicate Block Must Fail

Repeat the same block request.

Expected:

```text
409 Conflict
message_en = This entity is already blocked
existing_block exists
```

---

# 14. Update Block

```http
PATCH {{base_url}}/api/admin/blocked-entities/{{block_id}}
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "block_type": "permanent",
  "blocked_until": null,
  "reason": "Updated block reason for security testing"
}
```

Expected:

```text
200 OK
success = true
data.old_values exists
data.new_values exists
```

SQL:

```sql
SELECT id, block_type, blocked_until, reason, is_active
FROM blocked_entities
WHERE id = <block_id>;

SELECT id, action, target_type, target_id, old_values, new_values, created_at
FROM admin_logs
WHERE action = 'UPDATE_BLOCK'
ORDER BY id DESC
LIMIT 10;
```

---

# 15. Unblock User

```http
POST {{base_url}}/api/admin/blocked-entities/unblock
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "reason": "Security test unblock reason"
}
```

Expected:

```text
200 OK
success = true
```

SQL expected:

```sql
SELECT id, is_active, removed_at, removed_by_admin_id
FROM blocked_entities
WHERE id = <block_id>;

SELECT id, email, status
FROM users
WHERE id = <target_user_id>;
```

Expected:

```text
blocked_entities.is_active = 0
removed_at is not null
users.status = active
```

---

# 16. Login After Unblock

```http
POST {{base_url}}/api/auth-user/login
Content-Type: application/json
```

Body:

```json
{
  "email": "{{target_user_email}}",
  "password": "{{target_user_password}}"
}
```

Expected:

```text
200 OK if account is verified and password is correct
```

Save new token and verify protected API works.

---

# 17. Not Blocked Unblock Must Fail

Call unblock again:

```http
POST {{base_url}}/api/admin/blocked-entities/unblock
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "reason": "Second unblock should fail"
}
```

Expected:

```text
404
message_en = This entity is not blocked
```

---

# 18. Warning Block Behavior Test

```http
POST {{base_url}}/api/admin/blocked-entities/block
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "block_type": "warning",
  "reason": "Testing warning behavior as active block"
}
```

Expected current behavior:

```text
201 Created
users.status = suspended
old token revoked
login fails
```

Then unblock again.

This confirms current implementation treats warning as blocking.

---

# 19. Permanent Block Test

Block with:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "block_type": "permanent",
  "reason": "Testing permanent block reason"
}
```

Expected:

```text
blocked_until = null
is_active = 1
user cannot login
old token fails
```

Then unblock.

---

# 20. Temporary Past Date Negative Test

```http
POST {{base_url}}/api/admin/blocked-entities/block
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "block_type": "temporary",
  "blocked_until": "2020-01-01T00:00:00.000Z",
  "reason": "Past date validation reason"
}
```

Expected:

```text
400
message_en = Block end date must be in the future
```

---

# 21. Temporary Missing Date Negative Test

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "block_type": "temporary",
  "reason": "Missing temporary date reason"
}
```

Expected:

```text
400
message_en = Block end date is required for temporary blocks
```

---

# 22. Short Reason Negative Test

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "user",
  "block_type": "permanent",
  "reason": "short"
}
```

Expected:

```text
400
message_en = Block reason is required and must be at least 10 characters
```

---

# 23. Invalid Entity Type Negative Test

Body:

```json
{
  "entity_id": {{target_user_id}},
  "entity_type": "patient",
  "block_type": "permanent",
  "reason": "Invalid entity type validation reason"
}
```

Expected:

```text
400
Invalid entity type
```

---

# 24. Permissions: Normal Admin Cannot Block

```http
POST {{base_url}}/api/admin/blocked-entities/block
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Use a normal clinic admin token if available.

Expected:

```text
403
Insufficient admin permissions
```

Any Admin can list/check/statistics, but only System Admin and Super Admin can mutate.

---

# 25. Permissions: System Admin Cannot Block Admin

```http
POST {{base_url}}/api/admin/blocked-entities/block
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entity_id": {{target_admin_id}},
  "entity_type": "admin",
  "block_type": "permanent",
  "reason": "Testing admin block permission"
}
```

Expected:

```text
403
message_en = Only super admin can block other admins
```

---

# 26. Super Admin Cannot Block Self

Use current logged-in super admin ID as `entity_id`.

```json
{
  "entity_id": {{current_super_admin_id}},
  "entity_type": "admin",
  "block_type": "permanent",
  "reason": "Testing self block prevention"
}
```

Expected:

```text
400
message_en = You cannot block yourself
```

---

# 27. Super Admin Blocks Test Admin

Only if you have a safe secondary admin.

```http
POST {{base_url}}/api/admin/blocked-entities/block
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entity_id": {{target_admin_id}},
  "entity_type": "admin",
  "block_type": "temporary",
  "blocked_until": "{{future_date}}",
  "reason": "Testing super admin blocking another admin"
}
```

Expected:

```text
201 Created
target admin status = suspended
target admin tokens revoked
```

Then unblock:

```json
{
  "entity_id": {{target_admin_id}},
  "entity_type": "admin",
  "reason": "Unblocking test admin"
}
```

---

# 28. Bulk Block Users/Doctors

Use safe entities.

```http
POST {{base_url}}/api/admin/blocked-entities/bulk/block
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entities": [
    { "entity_id": {{target_user_id}}, "entity_type": "user" },
    { "entity_id": {{target_doctor_id}}, "entity_type": "doctor" }
  ],
  "block_type": "temporary",
  "blocked_until": "{{future_date}}",
  "reason": "Bulk security test block reason"
}
```

Expected:

```text
200 OK
data.success includes valid entities
data.failed includes duplicates or invalid entries
```

SQL:

```sql
SELECT *
FROM blocked_entities
WHERE is_active = 1
  AND (
    blocked_user_id = <target_user_id>
    OR blocked_doctor_id = <target_doctor_id>
  );
```

Then bulk unblock.

---

# 29. Bulk Unblock Users/Doctors

```http
POST {{base_url}}/api/admin/blocked-entities/bulk/unblock
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "entities": [
    { "entity_id": {{target_user_id}}, "entity_type": "user" },
    { "entity_id": {{target_doctor_id}}, "entity_type": "doctor" }
  ],
  "reason": "Bulk security test unblock reason"
}
```

Expected:

```text
200 OK
data.success includes entities that were blocked
```

---

# 30. Auto-Unblock Expired Temporary Blocks

For safe DB-only test, manually create or update a temporary block to expired in local development only:

```sql
UPDATE blocked_entities
SET block_type = 'temporary',
    blocked_until = DATE_SUB(NOW(), INTERVAL 1 HOUR),
    is_active = 1
WHERE id = <block_id>;
```

Then call:

```http
POST {{base_url}}/api/admin/blocked-entities/auto-unblock
Authorization: Bearer {{system_admin_token}}
```

Expected:

```text
200 OK
unblocked_count >= 1
```

SQL:

```sql
SELECT id, is_active, removed_at
FROM blocked_entities
WHERE id = <block_id>;
```

Expected:

```text
is_active = 0
removed_at is not null
entity status restored to active
```

---

# 31. Check Endpoint Expired Behavior Test

This is to document a current difference.

1. Create temporary block.
2. Set `blocked_until` in the past manually.
3. Call:

```http
GET {{base_url}}/api/admin/blocked-entities/check?entity_id={{target_user_id}}&entity_type=user
Authorization: Bearer {{admin_token}}
```

Expected:

```text
success = true
is_blocked = false
message_en = Temporary block has expired
```

Then SQL:

```sql
SELECT id, is_active, removed_at
FROM blocked_entities
WHERE id = <block_id>;

SELECT id, status
FROM users
WHERE id = <target_user_id>;
```

Current expected:

```text
blocked_entities.is_active = 0
user.status may still be suspended
```

Use `/auto-unblock` or manual unblock flow to restore status if needed.

---

# 32. Final Regression

Run:

```http
GET {{base_url}}/api/admin/blocked-entities/statistics
Authorization: Bearer {{admin_token}}
```

Run:

```http
GET {{base_url}}/api/admin/blocked-entities?page=1&limit=20&is_active=true
Authorization: Bearer {{admin_token}}
```

Run SQL:

```sql
SELECT
  id,
  blocked_user_id,
  blocked_admin_id,
  blocked_doctor_id,
  blocked_assistant_id,
  block_type,
  blocked_until,
  is_active,
  removed_at
FROM blocked_entities
ORDER BY id DESC
LIMIT 20;

SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  old_values,
  new_values,
  created_at
FROM admin_logs
WHERE action IN (
  'BLOCK_ENTITY',
  'UNBLOCK_ENTITY',
  'UPDATE_BLOCK',
  'BULK_BLOCK_ENTITIES',
  'BULK_UNBLOCK_ENTITIES',
  'AUTO_UNBLOCK_EXPIRED'
)
ORDER BY id DESC
LIMIT 50;
```
