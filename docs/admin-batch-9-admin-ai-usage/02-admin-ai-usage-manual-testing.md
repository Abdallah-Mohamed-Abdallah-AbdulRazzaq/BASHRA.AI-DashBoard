# Batch 9 Manual Testing Guide
## Admin AI Usage

## 0. Variables

```text
base_url=http://localhost:3006

admin_token=<ADMIN_TOKEN>
super_admin_token=<SUPER_ADMIN_TOKEN>
normal_admin_token=<NORMAL_ADMIN_TOKEN_IF_AVAILABLE>
user_token=<USER_TOKEN>

user_id=<TEST_USER_ID>
package_id=<TEST_PACKAGE_ID_IF_AVAILABLE>
policy_id=<CREATED_POLICY_ID>
period_key=2026-06
```

Use a real patient/user who already has AI usage data if possible.

---

# 1. Syntax Check and Server Run

Run:

```powershell
node --check controllers/AdminAIUsageController.js
node --check routes/adminAIUsageRoutes.js
node --check services/ai/AIUsageService.js
node --check routes/aiDermatologyRoutes.js
nodemon app.js
```

Expected:

```text
No syntax errors
Server is running on port 3006
```

---

# 2. Admin Overview

```http
GET {{base_url}}/api/admin/ai-usage/overview?period_key={{period_key}}
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data.period_key = period_key
data.counters exists
data.provider_summary array exists
data.policies_summary array exists
```

SQL verification:

```sql
SELECT
  COUNT(DISTINCT user_id) AS active_users,
  COALESCE(SUM(total_requests), 0) AS total_requests,
  COALESCE(SUM(chat_messages_count), 0) AS chat_messages_count,
  COALESCE(SUM(image_analyses_count), 0) AS image_analyses_count,
  COALESCE(SUM(document_analyses_count), 0) AS document_analyses_count,
  COALESCE(SUM(tokens_used), 0) AS tokens_used
FROM ai_usage_counters
WHERE period_type = 'monthly'
  AND period_key = '<period_key>';
```

Important:

```text
provider_summary currently does not filter by period_key.
Do not compare provider_summary against only one month unless the DB contains one month only.
```

---

# 3. Negative Overview Validation

```http
GET {{base_url}}/api/admin/ai-usage/overview?period_key=2026/06
Authorization: Bearer {{admin_token}}
```

Expected:

```text
400 validation error
```

---

# 4. Get User AI Usage

```http
GET {{base_url}}/api/admin/ai-usage/users/{{user_id}}
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
data.user.id = user_id
data.active_policies array exists
data.counters array exists
data.recent_events array exists
```

SQL verification:

```sql
SELECT *
FROM ai_usage_counters
WHERE user_id = <user_id>
ORDER BY period_key DESC, period_type ASC
LIMIT 24;

SELECT *
FROM ai_usage_events
WHERE user_id = <user_id>
ORDER BY created_at DESC, id DESC
LIMIT 50;
```

---

# 5. Negative User Not Found

```http
GET {{base_url}}/api/admin/ai-usage/users/999999999
Authorization: Bearer {{admin_token}}
```

Expected:

```text
404
message_ar = المستخدم غير موجود
```

---

# 6. List Policies

```http
GET {{base_url}}/api/admin/ai-usage/policies?page=1&limit=20
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
data.policies array
data.pagination exists
```

SQL verification:

```sql
SELECT *
FROM ai_usage_policies
ORDER BY is_active DESC, priority ASC, created_at DESC;
```

---

# 7. List Active User Policies Only

```http
GET {{base_url}}/api/admin/ai-usage/policies?scope_type=user&is_active=true&page=1&limit=20
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
all returned policies have scope_type = user and is_active = true
```

---

# 8. Get Policy by ID

Use an existing policy ID from list.

```http
GET {{base_url}}/api/admin/ai-usage/policies/{{policy_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
data.policy.id = policy_id
```

Negative:

```http
GET {{base_url}}/api/admin/ai-usage/policies/999999999
Authorization: Bearer {{admin_token}}
```

Expected:

```text
404
```

---

# 9. Create User Policy as Super Admin

```http
POST {{base_url}}/api/admin/ai-usage/policies
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
Accept-Language: ar
```

Body:

```json
{
  "policy_name": "Batch 9 User AI Usage",
  "scope_type": "user",
  "user_id": {{user_id}},
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

Expected:

```text
201 Created
data.policy.scope_type = user
data.policy.user_id = user_id
data.policy.is_active = true
data.policy.priority = 5
```

Save:

```text
policy_id = data.policy.id
```

SQL:

```sql
SELECT *
FROM ai_usage_policies
WHERE id = <policy_id>;

SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  description,
  severity,
  created_at
FROM admin_logs
WHERE target_type = 'AIUsagePolicy'
ORDER BY id DESC
LIMIT 10;
```

---

# 10. Verify User Receives User Policy

```http
GET {{base_url}}/api/ai-dermatology/usage
Authorization: Bearer {{user_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
data.policy.id = policy_id
data.policy.scope_type = user
remaining values calculated from this policy
```

SQL:

```sql
SELECT *
FROM ai_usage_counters
WHERE user_id = <user_id>
  AND period_type = 'monthly'
  AND period_key = DATE_FORMAT(CURDATE(), '%Y-%m');
```

---

# 11. Update Policy

```http
PATCH {{base_url}}/api/admin/ai-usage/policies/{{policy_id}}
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
Accept-Language: ar
```

Body:

```json
{
  "max_total_requests_per_month": 150,
  "max_chat_messages_per_month": 100,
  "max_image_analyses_per_month": 50,
  "priority": 3
}
```

Expected:

```text
200 OK
limits updated
priority = 3
updated_by_admin_id = super admin id
```

SQL:

```sql
SELECT
  id,
  policy_name,
  max_total_requests_per_month,
  max_chat_messages_per_month,
  max_image_analyses_per_month,
  priority,
  updated_by_admin_id,
  updated_at
FROM ai_usage_policies
WHERE id = <policy_id>;
```

Admin log expected:

```text
AI_USAGE_POLICY_UPDATE
```

---

# 12. Deactivate Policy

```http
PATCH {{base_url}}/api/admin/ai-usage/policies/{{policy_id}}/status
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "is_active": false
}
```

Expected:

```text
200 OK
data.policy.is_active = false
admin_logs action = AI_USAGE_POLICY_DEACTIVATE
admin_logs severity = high
```

Now check user side:

```http
GET {{base_url}}/api/ai-dermatology/usage
Authorization: Bearer {{user_token}}
```

Expected:

```text
The user should fall back to active global policy if one exists.
```

---

# 13. Reactivate Policy

```http
PATCH {{base_url}}/api/admin/ai-usage/policies/{{policy_id}}/status
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "is_active": true
}
```

Expected:

```text
200 OK
data.policy.is_active = true
admin_logs action = AI_USAGE_POLICY_ACTIVATE
admin_logs severity = medium
```

---

# 14. Create Global Policy

```http
POST {{base_url}}/api/admin/ai-usage/policies
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "policy_name": "Batch 9 Global AI Usage",
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

Expected:

```text
201 Created
user_id = null
package_id = null
```

Note:

```text
Multiple active global policies can exist. Effective policy is selected by priority ASC then id DESC.
```

---

# 15. Create Package Policy

Only do this if you have a valid `package_id`.

```http
POST {{base_url}}/api/admin/ai-usage/policies
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "policy_name": "Batch 9 Package AI Usage",
  "scope_type": "package",
  "package_id": {{package_id}},
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

Expected:

```text
201 Created
scope_type = package
package_id = provided package_id
```

Important:

```text
This policy can be created and listed, but current AIUsageService does not apply package policies to users.
```

---

# 16. Negative Policy Scope Validation

## 16.1 User policy without user_id

```http
POST {{base_url}}/api/admin/ai-usage/policies
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "policy_name": "Invalid User Policy",
  "scope_type": "user"
}
```

Expected:

```text
400
message_ar = يجب إرسال user_id عندما يكون scope_type = user
```

## 16.2 Package policy without package_id

```json
{
  "policy_name": "Invalid Package Policy",
  "scope_type": "package"
}
```

Expected:

```text
400
message_ar = يجب إرسال package_id عندما يكون scope_type = package
```

## 16.3 Invalid policy_name

```json
{
  "policy_name": "AI",
  "scope_type": "global"
}
```

Expected:

```text
400 validation error
```

---

# 17. Permission Negative Tests

## 17.1 Normal admin attempts create

```http
POST {{base_url}}/api/admin/ai-usage/policies
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "policy_name": "Should Fail Normal Admin",
  "scope_type": "global"
}
```

Expected:

```text
403 authorization failure
```

## 17.2 User token attempts overview

```http
GET {{base_url}}/api/admin/ai-usage/overview
Authorization: Bearer {{user_token}}
```

Expected:

```text
403 authorization failure
```

## 17.3 No token

```http
GET {{base_url}}/api/admin/ai-usage/policies
```

Expected:

```text
401 authentication failure
```

---

# 18. Verify Limit Enforcement with Real AI Request

Set a very low user policy:

```http
PATCH {{base_url}}/api/admin/ai-usage/policies/{{policy_id}}
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "max_total_requests_per_month": 1,
  "max_chat_messages_per_month": 1,
  "max_image_analyses_per_month": 0,
  "max_document_analyses_per_month": 0,
  "is_active": true,
  "priority": 1
}
```

Then from user side call:

```http
GET {{base_url}}/api/ai-dermatology/usage
Authorization: Bearer {{user_token}}
```

Expected:

```text
remaining values reflect low policy
```

Then attempt an AI chat/image/document based on current counters.

Expected if limit exceeded:

```json
{
  "success": false,
  "reason": "monthly_total_limit_exceeded"
}
```

or event-specific reason:

```text
monthly_chat_limit_exceeded
monthly_image_limit_exceeded
monthly_document_limit_exceeded
```

After test, restore policy limits to avoid blocking normal testing.

---

# 19. Final SQL Health Check

Run:

```sql
SELECT
  id,
  policy_name,
  scope_type,
  user_id,
  package_id,
  max_total_requests_per_month,
  max_chat_messages_per_month,
  max_image_analyses_per_month,
  max_document_analyses_per_month,
  max_files_per_session,
  max_tokens_per_request,
  is_active,
  priority,
  created_by_admin_id,
  updated_by_admin_id,
  created_at,
  updated_at
FROM ai_usage_policies
ORDER BY id DESC;

SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  description,
  severity,
  created_at
FROM admin_logs
WHERE target_type = 'AIUsagePolicy'
ORDER BY id DESC
LIMIT 20;

SELECT
  user_id,
  period_type,
  period_key,
  total_requests,
  chat_messages_count,
  image_analyses_count,
  document_analyses_count,
  tokens_used,
  last_request_at,
  updated_at
FROM ai_usage_counters
ORDER BY updated_at DESC
LIMIT 50;
```
