# Admin Batch 2 Manual Testing Guide
## User Management + Patient Profiles

## 0. Required variables

Set these values in Postman or your test environment:

```text
base_url=http://localhost:3006
admin_token=<ADMIN_OR_SUPER_ADMIN_ACCESS_TOKEN>
super_admin_token=<SUPER_ADMIN_ACCESS_TOKEN>
doctor_token=<DOCTOR_ACCESS_TOKEN_OPTIONAL>
assistant_token=<ASSISTANT_ACCESS_TOKEN_OPTIONAL>
user_token=<NORMAL_USER_ACCESS_TOKEN>
test_user_id=1
test_user_uuid=<USER_UUID>
```

## 1. Login as Admin

Use the existing admin login endpoint:

```http
POST {{base_url}}/api/auth-admin/login
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Save:

```text
tokens.accessToken -> admin_token
```

If the logged-in admin is a `super_admin`, also save it as:

```text
super_admin_token
```

---

## 2. Get user statistics

```http
GET {{base_url}}/api/admin/users/stats
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT COUNT(*) AS total_users FROM users;
```

---

## 3. Get all users

```http
GET {{base_url}}/api/admin/users?page=1&limit=20
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data.users is array
data.pagination exists
```

---

## 4. Get all users with status filter

```http
GET {{base_url}}/api/admin/users?status=active&page=1&limit=10
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
All returned users should have status = active
```

SQL check:

```sql
SELECT id, email, status FROM users WHERE status = 'active' ORDER BY id DESC LIMIT 10;
```

---

## 5. Search users by query

```http
GET {{base_url}}/api/admin/users/search?query=abdallah&page=1&limit=10
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

Test also:

```http
GET {{base_url}}/api/admin/users/search?email=test@example.com
GET {{base_url}}/api/admin/users/search?uuid={{test_user_uuid}}
GET {{base_url}}/api/admin/users/search?verified=true
```

---

## 6. Get users by status

```http
GET {{base_url}}/api/admin/users/status/pending_verification?page=1&limit=10
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

Negative test:

```http
GET {{base_url}}/api/admin/users/status/wrong_status
Authorization: Bearer {{admin_token}}
```

Expected:

```text
400 Bad Request or validation error
```

---

## 7. Get user by ID

```http
GET {{base_url}}/api/admin/users/{{test_user_id}}
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data.user.id = test_user_id
```

SQL check:

```sql
SELECT id, uuid, email, phone, status, is_active FROM users WHERE id = 1;
```

---

## 8. Get user medical profile

```http
GET {{base_url}}/api/admin/users/{{test_user_id}}/medical
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected if patient profile exists:

```text
200 OK
success = true
patient profile data exists
```

If patient profile does not exist, record the actual response and status code.

SQL check:

```sql
SELECT * FROM patient_profiles WHERE user_id = 1;
SELECT * FROM patient_profile_translations WHERE patient_profile_id IN (
  SELECT id FROM patient_profiles WHERE user_id = 1
);
```

---

## 9. Get user admin logs

```http
GET {{base_url}}/api/admin/users/{{test_user_id}}/logs?page=1&limit=20
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

If no logs exist yet, response should still be valid with empty data or pagination.

---

## 10. Update user status - Super Admin

Warning: do not use your main admin account as the target.

Recommended safe status test:

1. Pick a normal test user.
2. Change status to `inactive`.
3. Change it back to the previous status.

Request:

```http
PUT {{base_url}}/api/admin/users/{{test_user_id}}/status
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "inactive",
  "reason": "Testing status update from admin API"
}
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT id, email, status, updated_at FROM users WHERE id = 1;
```

Rollback:

```http
PUT {{base_url}}/api/admin/users/{{test_user_id}}/status
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "active",
  "reason": "Rollback status after admin API test"
}
```

---

## 11. Update user status - Non Super Admin negative test

Use an admin token that is not `super_admin`.

```http
PUT {{base_url}}/api/admin/users/{{test_user_id}}/status
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "suspended",
  "reason": "Testing forbidden access for non super admin"
}
```

Expected:

```text
403 Forbidden
```

Expected body may contain:

```json
{
  "error": "Insufficient admin permissions"
}
```

---

# Patient Profile Admin Tests

## 12. Get all patient profiles

```http
GET {{base_url}}/api/patient-profiles/all?page=1&limit=20
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT COUNT(*) AS patient_profiles_count FROM patient_profiles;
```

---

## 13. Search all patient profiles

```http
GET {{base_url}}/api/patient-profiles/all?page=1&limit=20&search=abdallah
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

---

## 14. Get patient profile by user ID as Admin

```http
GET {{base_url}}/api/patient-profiles/patient/{{test_user_id}}
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK if profile exists
404 if profile does not exist
```

---

## 15. Get patient profile by user ID as Doctor or Assistant

Doctor token:

```http
GET {{base_url}}/api/patient-profiles/patient/{{test_user_id}}
Authorization: Bearer {{doctor_token}}
```

Assistant token:

```http
GET {{base_url}}/api/patient-profiles/patient/{{test_user_id}}
Authorization: Bearer {{assistant_token}}
```

Expected:

```text
200 OK if profile exists
```

---

## 16. Negative test - Normal user cannot access admin patient profile route

```http
GET {{base_url}}/api/patient-profiles/all
Authorization: Bearer {{user_token}}
```

Expected:

```text
403 Forbidden
```

---

## 17. Negative test - Normal user cannot access admin user management

```http
GET {{base_url}}/api/admin/users
Authorization: Bearer {{user_token}}
```

Expected:

```text
403 Forbidden
```

---

# Final SQL summary

Run this after all tests:

```sql
SELECT id, uuid, email, phone, status, is_active, updated_at
FROM users
ORDER BY id DESC
LIMIT 10;

SELECT pp.id, pp.user_id, u.email, pp.blood_type, pp.height, pp.weight, pp.updated_at
FROM patient_profiles pp
JOIN users u ON u.id = pp.user_id
ORDER BY pp.id DESC
LIMIT 10;

SELECT id, admin_id, action, target_type, target_id, description, severity, created_at
FROM admin_logs
WHERE target_id = 1
ORDER BY id DESC
LIMIT 20;
```
