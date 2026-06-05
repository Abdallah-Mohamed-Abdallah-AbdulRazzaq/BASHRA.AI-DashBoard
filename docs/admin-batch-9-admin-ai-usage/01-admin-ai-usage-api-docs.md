# Batch 9 API Documentation
## Admin AI Usage

## 1. Route Mount

The route is mounted from `routes/index.js`:

```http
/api/admin/ai-usage
```

The related user-facing usage endpoint is:

```http
/api/ai-dermatology/usage
```

---

# 2. Permission Model

All Admin AI Usage routes require authentication first.

| Route group | Permission |
|---|---|
| `GET /overview` | Admin |
| `GET /users/:userId` | Admin |
| `GET /policies` | Admin |
| `GET /policies/:id` | Admin |
| `POST /policies` | Super Admin |
| `PATCH /policies/:id` | Super Admin |
| `PATCH /policies/:id/status` | Super Admin |

Important:

```text
Admin can view.
Super Admin can mutate.
```

---

# 3. Data Model

## 3.1 `ai_usage_policies`

Controls monthly AI limits.

Main fields:

| Field | Description |
|---|---|
| `policy_name` | Human-readable policy name |
| `scope_type` | `global`, `user`, or `package` |
| `user_id` | Required when `scope_type = user` |
| `package_id` | Required when `scope_type = package` |
| `max_total_requests_per_month` | Monthly total request limit |
| `max_chat_messages_per_month` | Monthly chat limit |
| `max_image_analyses_per_month` | Monthly image analysis limit |
| `max_document_analyses_per_month` | Monthly document analysis limit |
| `max_files_per_session` | Max files per AI session |
| `max_tokens_per_request` | Stored request token limit |
| `is_active` | Whether policy is active |
| `priority` | Lower number = higher priority |
| `created_by_admin_id` | Admin who created |
| `updated_by_admin_id` | Admin who last updated |

## 3.2 `ai_usage_counters`

Stores monthly counters per user.

Important unique key:

```sql
UNIQUE KEY uq_ai_usage_counter_user_period (user_id, period_type, period_key)
```

Counts:

| Field | Description |
|---|---|
| `total_requests` | Total counted successful AI requests |
| `chat_messages_count` | Successful chat requests |
| `image_analyses_count` | Successful image analyses |
| `document_analyses_count` | Successful document analyses |
| `tokens_used` | Total tokens from successful events |
| `last_request_at` | Latest counted request timestamp |

## 3.3 `ai_usage_events`

Detailed usage event audit.

Event types:

```text
chat_message
image_analysis
document_analysis
final_summary
```

Statuses:

```text
success
failed
blocked_limit
blocked_safety
```

## 3.4 `ai_provider_logs`

Provider/model usage logs, latency and token tracking.

Request types:

```text
chat
image
document
summary
safety_check
```

---

# 4. Policy Selection and Enforcement

## 4.1 Active policy selection

Current service lookup order:

1. Active user policy where `scope_type = user` and `user_id = current user`.
2. Active global policy.
3. Lower `priority` first.
4. Higher `id` wins if priority ties.

Current active lookup does not use `package` scope.

## 4.2 Enforced monthly limits

`assertCanUse(userId, eventType)` currently checks:

| Event type | Limit checked |
|---|---|
| all events | `max_total_requests_per_month` |
| `chat_message` | `max_chat_messages_per_month` |
| `image_analysis` | `max_image_analyses_per_month` |
| `document_analysis` | `max_document_analyses_per_month` |

`final_summary` increments `total_requests` but has no separate monthly event-specific limit.

## 4.3 Token limit note

`max_tokens_per_request` is stored and returned by policy APIs and user usage API. Current `AIUsageService.assertCanUse` does not block a request based on this field.

---

# 5. Endpoints

## 5.1 Get AI Usage Overview

```http
GET /api/admin/ai-usage/overview
Authorization: Bearer <ADMIN_TOKEN>
Accept-Language: ar
```

### Query params

| Param | Type | Required | Validation |
|---|---:|---:|---|
| `period_key` | string | No | `YYYY-MM` |

Example:

```http
GET /api/admin/ai-usage/overview?period_key=2026-06
```

### Response shape

```json
{
  "success": true,
  "message": "تم جلب نظرة عامة على استخدام الذكاء الاصطناعي بنجاح",
  "data": {
    "period_key": "2026-06",
    "counters": {
      "active_users": 1,
      "total_requests": "13",
      "chat_messages_count": "9",
      "image_analyses_count": "2",
      "document_analyses_count": "1",
      "tokens_used": "33715"
    },
    "provider_summary": [
      {
        "provider": "openai",
        "model": "gpt-4.1-mini",
        "request_type": "chat",
        "status": "success",
        "requests_count": 5,
        "total_tokens": "7272",
        "avg_latency_ms": "5929.40"
      }
    ],
    "policies_summary": [
      {
        "scope_type": "global",
        "is_active": 1,
        "count": 1
      }
    ]
  }
}
```

### Current source-review warning

`counters` are filtered by `period_key`, but `provider_summary` is currently grouped from `ai_provider_logs` without a date filter. This means provider summary may represent all-time logs, not only the selected month.

---

## 5.2 Get User AI Usage

```http
GET /api/admin/ai-usage/users/:userId
Authorization: Bearer <ADMIN_TOKEN>
Accept-Language: ar
```

### Params

| Param | Type | Required |
|---|---:|---:|
| `userId` | integer | Yes |

### Response includes

```text
user
active_policies
counters
recent_events
```

Example shape:

```json
{
  "success": true,
  "message": "تم جلب استخدام المستخدم للذكاء الاصطناعي بنجاح",
  "data": {
    "user": {
      "id": 1,
      "uuid": "uuid",
      "email": "user@example.com",
      "phone": "+20...",
      "status": "pending_verification",
      "is_active": true,
      "full_name": "Patient Name",
      "profile_picture_url": null
    },
    "active_policies": [],
    "counters": [],
    "recent_events": []
  }
}
```

### Notes

- Recent events are limited to latest 50.
- Counters are limited to latest 24 rows.
- Active policies returned here currently include active `global` and `user` policies for that user.

---

## 5.3 List Policies

```http
GET /api/admin/ai-usage/policies
Authorization: Bearer <ADMIN_TOKEN>
Accept-Language: ar
```

### Query params

| Param | Type | Required | Allowed |
|---|---:|---:|---|
| `page` | integer | No | min 1 |
| `limit` | integer | No | 1-100 |
| `scope_type` | enum | No | global, user, package |
| `is_active` | boolean | No | true, false |

Example:

```http
GET /api/admin/ai-usage/policies?page=1&limit=20&scope_type=user&is_active=true
```

### Response shape

```json
{
  "success": true,
  "message": "تم جلب سياسات استخدام الذكاء الاصطناعي بنجاح",
  "data": {
    "policies": [
      {
        "id": 2,
        "policy_name": "VIP User AI Usage",
        "scope_type": "user",
        "user_id": 1,
        "package_id": null,
        "limits": {
          "max_total_requests_per_month": 120,
          "max_chat_messages_per_month": 80,
          "max_image_analyses_per_month": 40,
          "max_document_analyses_per_month": 15,
          "max_files_per_session": 10,
          "max_tokens_per_request": 8000
        },
        "is_active": true,
        "priority": 5,
        "created_by_admin_id": 2,
        "updated_by_admin_id": 2
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 20,
      "has_next": false,
      "has_previous": false
    }
  }
}
```

---

## 5.4 Get Policy by ID

```http
GET /api/admin/ai-usage/policies/:id
Authorization: Bearer <ADMIN_TOKEN>
```

### Not found

```json
{
  "success": false,
  "message": "AI usage policy not found",
  "message_ar": "سياسة استخدام الذكاء الاصطناعي غير موجودة"
}
```

---

## 5.5 Create Policy

```http
POST /api/admin/ai-usage/policies
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json
Accept-Language: ar
```

### Body: Global policy

```json
{
  "policy_name": "Default Global AI Usage",
  "scope_type": "global",
  "max_total_requests_per_month": 30,
  "max_chat_messages_per_month": 30,
  "max_image_analyses_per_month": 10,
  "max_document_analyses_per_month": 5,
  "max_files_per_session": 5,
  "max_tokens_per_request": 4000,
  "is_active": true,
  "priority": 100
}
```

### Body: User policy

```json
{
  "policy_name": "VIP User AI Usage",
  "scope_type": "user",
  "user_id": 1,
  "max_total_requests_per_month": 120,
  "max_chat_messages_per_month": 80,
  "max_image_analyses_per_month": 40,
  "max_document_analyses_per_month": 15,
  "max_files_per_session": 10,
  "max_tokens_per_request": 8000,
  "is_active": true,
  "priority": 5
}
```

### Body: Package policy

```json
{
  "policy_name": "Premium Package AI Usage",
  "scope_type": "package",
  "package_id": 1,
  "max_total_requests_per_month": 200,
  "max_chat_messages_per_month": 150,
  "max_image_analyses_per_month": 60,
  "max_document_analyses_per_month": 30,
  "max_files_per_session": 15,
  "max_tokens_per_request": 12000,
  "is_active": true,
  "priority": 20
}
```

### Validation rules

| Field | Rule |
|---|---|
| `policy_name` | required, 3-150 chars |
| `scope_type` | required: global, user, package |
| `user_id` | required when scope_type=user |
| `package_id` | required when scope_type=package |
| monthly limits | optional non-negative integers |
| `max_files_per_session` | optional integer >= 1 |
| `max_tokens_per_request` | optional integer >= 1 |
| `is_active` | optional boolean |
| `priority` | optional non-negative integer |

### Defaults used by controller

If limit fields are omitted:

```json
{
  "max_total_requests_per_month": 30,
  "max_chat_messages_per_month": 30,
  "max_image_analyses_per_month": 10,
  "max_document_analyses_per_month": 5,
  "max_files_per_session": 5,
  "max_tokens_per_request": 4000,
  "is_active": true,
  "priority": 100
}
```

### Side effects

Creates an `admin_logs` row:

```text
target_type = AIUsagePolicy
action = AI_USAGE_POLICY_CREATE
severity = medium
```

---

## 5.6 Update Policy

```http
PATCH /api/admin/ai-usage/policies/:id
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

All fields are optional, but the resulting scope must stay valid.

Example:

```json
{
  "max_total_requests_per_month": 150,
  "max_chat_messages_per_month": 100,
  "priority": 3
}
```

### Scope update examples

Convert to user-scoped:

```json
{
  "scope_type": "user",
  "user_id": 1
}
```

Convert to global:

```json
{
  "scope_type": "global",
  "user_id": null,
  "package_id": null
}
```

### Side effects

Creates an `admin_logs` row:

```text
target_type = AIUsagePolicy
action = AI_USAGE_POLICY_UPDATE
severity = medium
```

---

## 5.7 Update Policy Status

```http
PATCH /api/admin/ai-usage/policies/:id/status
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "is_active": false
}
```

### Side effects

Creates an `admin_logs` row:

If activated:

```text
action = AI_USAGE_POLICY_ACTIVATE
severity = medium
```

If deactivated:

```text
action = AI_USAGE_POLICY_DEACTIVATE
severity = high
```

---

# 6. Related User Endpoint for Integration Validation

After changing policies, validate from the patient/user side:

```http
GET /api/ai-dermatology/usage
Authorization: Bearer <USER_TOKEN>
```

Expected response shape:

```json
{
  "success": true,
  "message_ar": "تم جلب استخدام الذكاء الاصطناعي بنجاح",
  "message_en": "AI usage retrieved successfully",
  "data": {
    "period": {
      "type": "monthly",
      "key": "2026-06"
    },
    "policy": {
      "id": 2,
      "policy_name": "VIP User AI Usage",
      "scope_type": "user",
      "max_total_requests_per_month": 120,
      "max_chat_messages_per_month": 80,
      "max_image_analyses_per_month": 40,
      "max_document_analyses_per_month": 15,
      "max_files_per_session": 10,
      "max_tokens_per_request": 8000
    },
    "used": {
      "total_requests": 13,
      "chat_messages_count": 9,
      "image_analyses_count": 2,
      "document_analyses_count": 1,
      "tokens_used": 33715
    },
    "remaining": {
      "total_requests": 107,
      "chat_messages": 71,
      "image_analyses": 38,
      "document_analyses": 14
    }
  }
}
```

---

# 7. Error Cases to Test

## 7.1 Invalid period_key

```http
GET /api/admin/ai-usage/overview?period_key=2026/06
```

Expected:

```text
400 validation error
```

## 7.2 Normal Admin creates policy

```http
POST /api/admin/ai-usage/policies
Authorization: Bearer <NORMAL_ADMIN_TOKEN>
```

Expected:

```text
403 authorization failure
```

## 7.3 User policy without user_id

```json
{
  "policy_name": "Invalid User Policy",
  "scope_type": "user"
}
```

Expected:

```json
{
  "success": false,
  "message": "user_id is required when scope_type is user",
  "message_ar": "يجب إرسال user_id عندما يكون scope_type = user"
}
```

## 7.4 Package policy without package_id

```json
{
  "policy_name": "Invalid Package Policy",
  "scope_type": "package"
}
```

Expected:

```json
{
  "success": false,
  "message": "package_id is required when scope_type is package",
  "message_ar": "يجب إرسال package_id عندما يكون scope_type = package"
}
```

## 7.5 Invalid status body

```json
{
  "is_active": "maybe"
}
```

Expected:

```text
400 validation error
```

---

# 8. Frontend Integration Notes

Admin AI Usage screens should support:

1. Overview dashboard:
   - active users
   - total requests
   - chat/image/document counts
   - tokens used
   - provider summary
   - policies summary

2. User usage detail page:
   - user basic profile
   - active policies
   - counters by period
   - latest usage events

3. Policies list:
   - filters by `scope_type`, `is_active`
   - pagination

4. Policy editor:
   - scope type switcher
   - conditional `user_id` / `package_id`
   - numeric monthly limits
   - priority
   - active status

5. Audit log check:
   - policy create/update/status should appear in `admin_logs`.

## Current behavior reminders

- `package` policy can be created, but current AI usage lookup does not apply it to users.
- `max_tokens_per_request` is returned to frontend, but not directly enforced in `AIUsageService.assertCanUse`.
- `provider_summary` may be all-time rather than period-specific in current code.
