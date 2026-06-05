# 02 — Manual Testing Guide

## 0. Environment Variables

في Postman أو أي API Client جهز المتغيرات التالية:

```text
base_url = http://localhost:3006/api
super_admin_email = <super admin email>
super_admin_password = <password>
system_admin_email = <system admin email>
system_admin_password = <password>
clinic_admin_email = <clinic admin email>
clinic_admin_password = <password>

super_admin_access_token = سيتم ملؤه بعد login
super_admin_refresh_token = سيتم ملؤه بعد login
system_admin_access_token = سيتم ملؤه بعد login
clinic_admin_access_token = سيتم ملؤه بعد login

target_user_id = 1
target_doctor_id = 1
target_assistant_id = 1
target_session_id = ضع id من login_sessions
new_admin_id = سيتم ملؤه بعد register
```

## 1. Pre-check من قاعدة البيانات

نفذ أولًا:

```sql
SELECT id, email, admin_type, status, is_active
FROM admins
ORDER BY id;
```

تأكد أن لديك على الأقل:

- super_admin نشط.
- system_admin نشط إن كنت ستختبر صلاحيات system.
- clinic_admin نشط لاختبار الرفض على operations الأعلى.

## 2. Auth Tests

### T01 — Super Admin Login

#### Request

```http
POST {{base_url}}/auth-admin/login
Content-Type: application/json
```

```json
{
  "email": "{{super_admin_email}}",
  "password": "{{super_admin_password}}"
}
```

#### Expected

- Status: `200`
- `success = true`
- وجود `user.admin_type = super_admin`
- وجود `tokens.accessToken`
- وجود `tokens.refreshToken`

#### بعد الاختبار

انسخ:

```text
super_admin_access_token = response.tokens.accessToken
super_admin_refresh_token = response.tokens.refreshToken
```

ثم نفذ SQL:

```sql
SELECT id, admin_id, token_type, is_revoked, expires_at, created_at
FROM auth_tokens
WHERE admin_id = <SUPER_ADMIN_ID>
ORDER BY id DESC
LIMIT 5;

SELECT id, admin_id, is_active, ip_address, browser, operating_system, created_at, expires_at
FROM login_sessions
WHERE admin_id = <SUPER_ADMIN_ID>
ORDER BY id DESC
LIMIT 5;
```

---

### T02 — Login with wrong password

#### Request

```http
POST {{base_url}}/auth-admin/login
```

```json
{
  "email": "{{super_admin_email}}",
  "password": "wrong-password"
}
```

#### Expected

- Status: `401`
- `success = false`

#### SQL

```sql
SELECT id, email, entity_type, failure_reason, ip_address, attempted_at
FROM failed_logins
WHERE email = '{{super_admin_email}}'
ORDER BY id DESC
LIMIT 10;
```

---

### T03 — Refresh Token

#### Request

```http
POST {{base_url}}/auth-admin/refresh-token
Content-Type: application/json
```

```json
{
  "refreshToken": "{{super_admin_refresh_token}}"
}
```

#### Expected

- Status: `200`
- وجود access token جديد.

#### SQL

```sql
SELECT id, admin_id, token_type, is_revoked, created_at, expires_at
FROM auth_tokens
WHERE admin_id = <SUPER_ADMIN_ID>
ORDER BY id DESC
LIMIT 10;
```

---

### T04 — Access protected endpoint without token

#### Request

```http
GET {{base_url}}/auth-admin/sessions
```

بدون Authorization header.

#### Expected

- Status: `401`
- رسالة مثل `Authorization header missing`.

---

### T05 — Access protected endpoint with user token بدل admin token

استخدم token لمريض أو طبيب بدل admin.

#### Request

```http
GET {{base_url}}/auth-admin/sessions
Authorization: Bearer {{user_access_token}}
```

#### Expected

- Status: `403`
- Insufficient permissions.

---

## 3. Read-only Security Tests — Any Admin

### T06 — Get active sessions

```http
GET {{base_url}}/auth-admin/sessions
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- Response يحتوي sessions أو array/list مشابه.

---

### T07 — Get security stats

```http
GET {{base_url}}/auth-admin/security/stats
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- `success = true`
- وجود `stats`.

SQL للمقارنة:

```sql
SELECT COUNT(*) AS total_admin_logs FROM admin_logs;
SELECT COUNT(*) AS failed_logins_24h FROM failed_logins WHERE attempted_at > DATE_SUB(NOW(), INTERVAL 24 HOUR);
SELECT COUNT(*) AS active_sessions FROM login_sessions WHERE is_active = 1 AND expires_at > NOW();
SELECT COUNT(*) AS active_blocks FROM blocked_entities WHERE is_active = 1;
```

---

### T08 — Get admin logs

```http
GET {{base_url}}/auth-admin/security/admin-logs?limit=20&offset=0
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- `success = true`
- `logs` array.
- `pagination` object.

---

### T09 — Filter admin logs by action

```http
GET {{base_url}}/auth-admin/security/admin-logs?action=BLOCK_ENTITY&limit=20&offset=0
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- logs إن وجدت تكون مرتبطة بـ BLOCK_ENTITY.

---

### T10 — Get failed logins

```http
GET {{base_url}}/auth-admin/security/failed-logins?hours=24&limit=20&offset=0&entityType=admin
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- `attempts` array.
- `stats` array.

---

### T11 — Get blocked entities

```http
GET {{base_url}}/auth-admin/security/blocked-entities?isActive=true&limit=20&offset=0
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- `blockedEntities` array.

---

## 4. System Admin Security Action Tests

> مهم: لا تستخدم حساب production. استخدم target user/doctor/assistant تجريبي.

### T12 — clinic_admin must NOT block entity

```http
POST {{base_url}}/auth-admin/security/block-entity
Authorization: Bearer {{clinic_admin_access_token}}
Content-Type: application/json
```

```json
{
  "targetId": "{{target_user_id}}",
  "entityType": "user",
  "blockType": "temporary",
  "blockedUntil": "2026-12-31T23:59:59.000Z",
  "reason": "Permission negative test"
}
```

Expected:

- Status `403`
- لا يتم إنشاء block جديد.

SQL:

```sql
SELECT *
FROM blocked_entities
WHERE blocked_user_id = {{target_user_id}}
ORDER BY id DESC
LIMIT 5;
```

---

### T13 — system_admin / super_admin block user

```http
POST {{base_url}}/auth-admin/security/block-entity
Authorization: Bearer {{system_admin_access_token}}
Content-Type: application/json
```

```json
{
  "targetId": "{{target_user_id}}",
  "entityType": "user",
  "blockType": "temporary",
  "blockedUntil": "2026-12-31T23:59:59.000Z",
  "reason": "Manual test temporary user block"
}
```

Expected:

- Status `200`
- `success = true`

SQL:

```sql
SELECT id, blocked_user_id, blocked_by_admin_id, block_type, blocked_until, reason, is_active, created_at
FROM blocked_entities
WHERE blocked_user_id = {{target_user_id}}
ORDER BY id DESC
LIMIT 5;

SELECT id, admin_id, action, target_type, target_id, description, severity, created_at
FROM admin_logs
WHERE action = 'BLOCK_ENTITY'
ORDER BY id DESC
LIMIT 10;
```

---

### T14 — blocked user token should fail

بعد T13، جرّب أي protected endpoint باستخدام token المستخدم المحظور.

Expected:

- Status `403`
- رسالة مثل `Account is blocked`.

---

### T15 — unblock user

```http
POST {{base_url}}/auth-admin/security/unblock-entity
Authorization: Bearer {{system_admin_access_token}}
Content-Type: application/json
```

```json
{
  "targetId": "{{target_user_id}}",
  "entityType": "user",
  "reason": "Manual test unblock user"
}
```

Expected:

- Status `200`
- `success = true`

SQL:

```sql
SELECT id, blocked_user_id, is_active, removed_at, removed_by_admin_id
FROM blocked_entities
WHERE blocked_user_id = {{target_user_id}}
ORDER BY id DESC
LIMIT 5;

SELECT id, admin_id, action, target_type, target_id, description, severity, created_at
FROM admin_logs
WHERE action = 'UNBLOCK_ENTITY'
ORDER BY id DESC
LIMIT 10;
```

---

### T16 — update entity status to suspended and back to active

#### Suspend

```http
POST {{base_url}}/auth-admin/security/update-entity-status
Authorization: Bearer {{system_admin_access_token}}
Content-Type: application/json
```

```json
{
  "targetId": "{{target_user_id}}",
  "entityType": "user",
  "status": "suspended",
  "reason": "Manual test suspend user"
}
```

Expected:

- Status `200`
- status في جدول users = suspended.

#### Restore

```json
{
  "targetId": "{{target_user_id}}",
  "entityType": "user",
  "status": "active",
  "reason": "Manual test restore user"
}
```

SQL:

```sql
SELECT id, email, status, is_active, updated_at
FROM users
WHERE id = {{target_user_id}};

SELECT id, action, target_type, target_id, created_at
FROM admin_logs
WHERE action = 'UPDATE_ENTITY_STATUS'
ORDER BY id DESC
LIMIT 10;
```

---

### T17 — revoke sessions for target user

```http
POST {{base_url}}/auth-admin/security/revoke-sessions
Authorization: Bearer {{system_admin_access_token}}
Content-Type: application/json
```

```json
{
  "targetId": "{{target_user_id}}",
  "entityType": "user",
  "reason": "Manual test revoke user sessions"
}
```

Expected:

- Status `200`
- user tokens/sessions تصبح revoked/inactive.

SQL:

```sql
SELECT id, user_id, token_type, is_revoked, revoked_at, expires_at
FROM auth_tokens
WHERE user_id = {{target_user_id}}
ORDER BY id DESC
LIMIT 20;

SELECT id, user_id, is_active, ended_at, expires_at
FROM login_sessions
WHERE user_id = {{target_user_id}}
ORDER BY id DESC
LIMIT 20;
```

---

### T18 — end session by session id

اختر session id من:

```sql
SELECT id, admin_id, user_id, doctor_id, assistant_id, is_active, created_at
FROM login_sessions
WHERE is_active = 1
ORDER BY id DESC
LIMIT 10;
```

Request:

```http
POST {{base_url}}/auth-admin/security/end-session
Authorization: Bearer {{system_admin_access_token}}
Content-Type: application/json
```

```json
{
  "sessionId": "{{target_session_id}}",
  "reason": "Manual test end session"
}
```

Expected:

- Status `200` إذا كان body مطابقًا للـ controller.
- إذا ظهر validation error، اختبر `sessionToken` بدل `sessionId`.

SQL:

```sql
SELECT id, is_active, ended_at, last_activity_at
FROM login_sessions
WHERE id = {{target_session_id}};

SELECT id, action, target_type, target_id, created_at
FROM admin_logs
WHERE action = 'END_SESSION'
ORDER BY id DESC
LIMIT 10;
```

---

## 5. Super Admin Only Tests

### T19 — clinic_admin cannot register admin

```http
POST {{base_url}}/auth-admin/register
Authorization: Bearer {{clinic_admin_access_token}}
Content-Type: application/json
```

```json
{
  "email": "batch1.clinic.admin@example.com",
  "password": "AdminPass123!",
  "adminType": "clinic_admin",
  "full_name": "Batch One Clinic Admin",
  "language_code": "ar"
}
```

Expected:

- Status `403`
- لا يتم إنشاء admin.

---

### T20 — super_admin registers a new clinic_admin

```http
POST {{base_url}}/auth-admin/register
Authorization: Bearer {{super_admin_access_token}}
Content-Type: application/json
```

```json
{
  "email": "batch1.clinic.admin@example.com",
  "phone": "+201000000001",
  "password": "AdminPass123!",
  "adminType": "clinic_admin",
  "full_name": "Batch One Clinic Admin",
  "language_code": "ar"
}
```

Expected:

- Status `201`
- `success = true`
- response يحتوي `userId` و `uuid`.

SQL:

```sql
SELECT id, uuid, email, phone, admin_type, status, is_active, email_otp, email_otp_expiry, created_at
FROM admins
WHERE email = 'batch1.clinic.admin@example.com';

SELECT id, admin_id, action, target_type, target_id, description, severity, created_at
FROM admin_logs
WHERE action = 'CREATE_ADMIN'
ORDER BY id DESC
LIMIT 10;
```

---

### T21 — manual cleanup super admin

```http
POST {{base_url}}/auth-admin/security/manual-cleanup
Authorization: Bearer {{super_admin_access_token}}
Content-Type: application/json
```

```json
{}
```

Expected:

- Status `200`
- `success = true`
- response يحتوي `stats`.

SQL:

```sql
SELECT id, admin_id, action, target_type, target_id, description, severity, created_at
FROM admin_logs
WHERE action IN ('MANUAL_CLEANUP', 'MANUAL_SECURITY_CLEANUP')
ORDER BY id DESC
LIMIT 10;
```

---

## 6. Admin Profile Tests

### T22 — get current admin profile

```http
GET {{base_url}}/profile-admin
Authorization: Bearer {{super_admin_access_token}}
Accept-Language: ar
```

Expected:

- Status `200`
- `success = true`
- `data` يحتوي بيانات البروفايل مترجمة للغة المطلوبة.

SQL:

```sql
SELECT ap.*, apt.language_code, apt.full_name, apt.job_title, apt.department
FROM admin_profiles ap
LEFT JOIN admin_profile_translations apt ON apt.profile_id = ap.id
WHERE ap.admin_id = <SUPER_ADMIN_ID>;
```

---

### T23 — get complete current admin data

```http
GET {{base_url}}/profile-admin/complete
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- `data.account`
- `data.profile`
- `data.translations`

---

### T24 — update admin profile flat fields

```http
PUT {{base_url}}/profile-admin
Authorization: Bearer {{super_admin_access_token}}
Content-Type: application/json
Accept-Language: ar
```

```json
{
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "nationality": "Egyptian",
  "emergency_contact_phone": "+201000000002",
  "timezone": "Africa/Cairo",
  "language_preference": "ar",
  "full_name": "مدير النظام التجريبي",
  "job_title": "مدير نظام",
  "department": "الإدارة التقنية",
  "emergency_contact_name": "جهة اتصال طارئة",
  "emergency_contact_relationship": "Brother"
}
```

Expected:

- Status `200`
- `success = true`
- البيانات الجديدة تظهر في response.

SQL:

```sql
SELECT id, admin_id, date_of_birth, gender, nationality, emergency_contact_phone, timezone, language_preference, updated_at
FROM admin_profiles
WHERE admin_id = <SUPER_ADMIN_ID>;

SELECT apt.*
FROM admin_profile_translations apt
JOIN admin_profiles ap ON ap.id = apt.profile_id
WHERE ap.admin_id = <SUPER_ADMIN_ID>
ORDER BY apt.language_code;
```

---

### T25 — update admin profile multi-language translations

```http
PUT {{base_url}}/profile-admin
Authorization: Bearer {{super_admin_access_token}}
Content-Type: application/json
```

```json
{
  "timezone": "Africa/Cairo",
  "language_preference": "ar",
  "translations": {
    "ar": {
      "full_name": "مدير النظام",
      "job_title": "مشرف عام",
      "department": "الإدارة"
    },
    "en": {
      "full_name": "System Admin",
      "job_title": "Super Administrator",
      "department": "Management"
    }
  }
}
```

Expected:

- Status `200`
- translations تتحدث أو تنشأ حسب service.

---

### T26 — invalid gender validation

```http
PUT {{base_url}}/profile-admin
Authorization: Bearer {{super_admin_access_token}}
Content-Type: application/json
```

```json
{
  "gender": "invalid_value"
}
```

Expected:

- Status `400`
- message عن invalid gender.

---

### T27 — upload profile picture

```http
POST {{base_url}}/profile-admin/picture
Authorization: Bearer {{super_admin_access_token}}
Content-Type: multipart/form-data
```

Form Data:

```text
profile_picture = <image file>
```

Expected:

- Status `200`
- `data.profile_picture_url`
- `data.file_uuid`
- `data.file_id`

SQL:

```sql
SELECT id, admin_id, profile_picture_url, updated_at
FROM admin_profiles
WHERE admin_id = <SUPER_ADMIN_ID>;

SELECT id, uuid, uploaded_by_admin_id, file_category, original_filename, file_url, created_at
FROM files
WHERE uploaded_by_admin_id = <SUPER_ADMIN_ID>
ORDER BY id DESC
LIMIT 10;
```

---

### T28 — delete profile picture

```http
DELETE {{base_url}}/profile-admin/picture
Authorization: Bearer {{super_admin_access_token}}
```

Expected:

- Status `200`
- profile_picture_url يصبح null.

SQL:

```sql
SELECT id, admin_id, profile_picture_url, updated_at
FROM admin_profiles
WHERE admin_id = <SUPER_ADMIN_ID>;
```

---

### T29 — deactivate/reactivate admin profile safely

لا تختبر هذا على super admin الأساسي. استخدم admin تجريبي.

#### Deactivate

```http
DELETE {{base_url}}/profile-admin
Authorization: Bearer {{test_admin_access_token}}
```

Expected:

- Status `200`
- الحساب يصبح inactive أو is_active = 0.

#### Reactivate

```http
PATCH {{base_url}}/profile-admin/reactivate
Authorization: Bearer {{test_admin_access_token}}
```

Expected:

- Status `200`
- الحساب يعود active أو is_active = 1.

SQL:

```sql
SELECT id, email, status, is_active, updated_at
FROM admins
WHERE id = <TEST_ADMIN_ID>;
```

## 7. Final Smoke Test

بعد كل الاختبارات، نفذ:

```http
GET {{base_url}}/auth-admin/security/stats
Authorization: Bearer {{super_admin_access_token}}
```

ثم:

```http
GET {{base_url}}/profile-admin/complete
Authorization: Bearer {{super_admin_access_token}}
```

إذا كلاهما returned 200، فالدُفعة الأولى مستقرة مبدئيًا.
