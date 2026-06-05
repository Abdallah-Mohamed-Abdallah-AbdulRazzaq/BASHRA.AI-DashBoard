# 01 — Admin Authentication + Security + Admin Profile API Documentation

## 1. Scope

هذه الوثيقة تغطي الدفعة الأولى فقط من منطق الأدمن:

```text
/api/auth-admin/*
/api/profile-admin/*
```

المسارات مبنية على `routes/index.js` حيث يتم تركيب:

```js
router.use("/auth-admin", authAdminRoutes);
router.use("/profile-admin", profileAdminRoutes);
```

## 2. Roles / Permissions

حسب `authMiddleware.js`:

| Middleware | المعنى |
|---|---|
| `authenticateJWT` | يتأكد من وجود Bearer Token صالح وغير revoked داخل جدول `auth_tokens`. |
| `authorizeAdmin` | أي حساب `entityType = admin`. |
| `authorizeAnyAdmin` | alias لنفس معنى `authorizeAdmin`. |
| `authorizeSystemAdmin` | يسمح فقط لـ `super_admin` و `system_admin`. |
| `authorizeSuperAdmin` | يسمح فقط لـ `super_admin`. |
| `checkAccountActive` | يتأكد أن الحساب active، مع استثناء مسار reactivate في بعض الملفات. |

أنواع الأدمن داخل جدول `admins.admin_type`:

```text
super_admin
system_admin
clinic_admin
```

## 3. Admin Auth Routes

Base path:

```text
/api/auth-admin
```

### 3.1 Public Auth Endpoints

هذه المسارات لا تحتاج Bearer Token.

---

### POST `/api/auth-admin/login`

تسجيل دخول الأدمن.

#### Body

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

`authAdminRoutes.js` يضيف داخليًا:

```js
req.body.entityType = 'admin';
```

#### Success — 200

```json
{
  "success": true,
  "message_ar": "تم تسجيل الدخول بنجاح",
  "message_en": "Login successful",
  "user": {
    "id": 2,
    "uuid": "...",
    "email": "...",
    "admin_type": "super_admin"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Validation / Error Cases

| Status | الحالة |
|---|---|
| 400 | email أو password غير مرسلين. |
| 401 | بيانات دخول غير صحيحة. |
| 500 | خطأ داخلي. |

#### DB أثر متوقع

- إنشاء access token وrefresh token في `auth_tokens`.
- إنشاء session في `login_sessions`.
- تحديث `admins.last_login_at` و/أو `last_activity_at` حسب منطق SecurityService.
- في حال فشل الدخول: قد يتم تسجيل attempt في `failed_logins`.

---

### POST `/api/auth-admin/refresh-token`

تجديد التوكن.

#### Body

```json
{
  "refreshToken": "{{admin_refresh_token}}"
}
```

> ملاحظة اختبار: اسم الحقل المتوقع غالبًا `refreshToken` لأنه route يستخدم `validateRefreshToken` قبل `AuthController.refreshToken`. تأكد فعليًا من response في Postman.

#### Success — 200

```json
{
  "success": true,
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Error Cases

| Status | الحالة |
|---|---|
| 401/403 | refresh token غير صالح أو revoked أو منتهي. |
| 500 | خطأ داخلي. |

---

### POST `/api/auth-admin/request-password-reset`

طلب reset password بالطريقة التقليدية.

#### Body

```json
{
  "email": "admin@example.com"
}
```

`authAdminRoutes.js` يضيف داخليًا:

```js
req.body.entityType = 'admin';
```

#### Success

```json
{
  "success": true,
  "message_ar": "...",
  "message_en": "..."
}
```

---

### POST `/api/auth-admin/reset-password`

تغيير كلمة المرور باستخدام reset token.

#### Body متوقع

```json
{
  "token": "reset-token",
  "newPassword": "NewPassword123!"
}
```

> أسماء الحقول النهائية يجب تأكيدها فعليًا من response لأن route يمرر الطلب مباشرة إلى `AuthController.resetPassword`.

---

### POST `/api/auth-admin/request-password-reset-otp`

طلب reset password باستخدام OTP.

#### Body

```json
{
  "email": "admin@example.com"
}
```

`authAdminRoutes.js` يضيف داخليًا:

```js
req.body.entityType = 'admin';
```

---

### POST `/api/auth-admin/reset-password-otp`

Reset password باستخدام OTP.

#### Body متوقع

```json
{
  "email": "admin@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

> يجب تأكيد أسماء الحقول النهائية من الاختبار الفعلي.

---

## 4. Protected Admin Auth / Security Routes

كل المسارات التالية تمر عبر:

```js
router.use(authenticateJWT, authorizeAnyAdmin);
```

أي أنها تحتاج Bearer Token لأدمن بأي نوع.

### Headers

```http
Authorization: Bearer {{admin_access_token}}
Content-Type: application/json
```

---

### POST `/api/auth-admin/logout`

تسجيل خروج الأدمن الحالي.

#### Body

غالبًا لا يحتاج body، لكن قد يعتمد على token الحالي.

```json
{}
```

#### Expected

```json
{
  "success": true,
  "message_ar": "...",
  "message_en": "..."
}
```

#### DB أثر متوقع

- جعل token الحالي revoked داخل `auth_tokens` أو إنهاء session حسب منطق `AuthController.logout`.

---

### GET `/api/auth-admin/sessions`

جلب الجلسات النشطة للأدمن الحالي.

#### Expected

```json
{
  "success": true,
  "sessions": []
}
```

#### DB

يعتمد على `login_sessions`.

---

### GET `/api/auth-admin/security-logs`

جلب security logs للأدمن الحالي من `AuthController.getSecurityLogs`.

#### Query اختياري

```text
limit=100
```

---

### GET `/api/auth-admin/security/stats`

إحصائيات أمنية عامة.

#### Permission

أي admin.

#### Expected

```json
{
  "success": true,
  "stats": {
    "adminStats": {
      "totalAdminActions": 0,
      "last24hActions": 0,
      "highSeverityActions": 0,
      "suspiciousIPs": 0
    }
  }
}
```

#### DB Tables

- `admin_logs`
- `failed_logins`
- `auth_tokens`
- `login_sessions`
- `blocked_entities`

---

### GET `/api/auth-admin/security/alerts`

جلب security alerts.

#### Permission

أي admin.

#### Expected

```json
{
  "success": true,
  "alerts": []
}
```

---

### GET `/api/auth-admin/security/system-sessions`

عرض sessions على مستوى النظام.

#### Permission

أي admin.

#### Query محتمل

```text
limit=100&offset=0&entityType=admin
```

---

### GET `/api/auth-admin/security/admin-logs`

عرض admin action logs.

#### Permission

أي admin.

#### Query

```text
limit=100&offset=0&adminId=2&action=BLOCK_ENTITY&severity=high&startDate=2026-06-01&endDate=2026-06-30
```

#### Expected

```json
{
  "success": true,
  "logs": [],
  "pagination": {
    "total": 0,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### GET `/api/auth-admin/security/failed-logins`

عرض محاولات تسجيل الدخول الفاشلة.

#### Query

```text
limit=100&offset=0&email=test@example.com&ipAddress=127.0.0.1&entityType=admin&hours=24
```

#### Expected

```json
{
  "success": true,
  "attempts": [],
  "stats": [],
  "pagination": {
    "limit": 100,
    "offset": 0
  }
}
```

---

### GET `/api/auth-admin/security/blocked-entities`

عرض الكيانات المحظورة.

#### Query

```text
limit=100&offset=0&entityType=user&isActive=true
```

#### Expected

```json
{
  "success": true,
  "blockedEntities": [],
  "pagination": {
    "limit": 100,
    "offset": 0
  }
}
```

---

## 5. System Admin and Super Admin Security Actions

بعد routes القراءة، الملف يستخدم:

```js
router.use(authorizeSystemAdmin);
```

أي أن المسارات التالية تحتاج:

```text
super_admin أو system_admin
```

---

### POST `/api/auth-admin/security/block-entity`

حظر user/doctor/assistant.

#### Permission

`system_admin` أو `super_admin`.

#### Body

```json
{
  "targetId": 1,
  "entityType": "user",
  "blockType": "temporary",
  "blockedUntil": "2026-12-31T23:59:59.000Z",
  "reason": "Testing temporary block from admin security module"
}
```

#### Valid entityType هنا

```text
user
doctor
assistant
```

> ملاحظة: هذا endpoint في `AdminSecurityController.blockEntity` لا يقبل `admin` كـ entityType. حظر admins يتم اختباره لاحقًا في دفعة `blockedEntitiesRoutes` إن احتجنا.

#### Expected

```json
{
  "success": true,
  "message": "..."
}
```

#### DB أثر متوقع

- إضافة صف في `blocked_entities`.
- إضافة log في `admin_logs` باسم `BLOCK_ENTITY`.

---

### POST `/api/auth-admin/security/unblock-entity`

فك الحظر عن كيان.

#### Permission

`system_admin` أو `super_admin`.

#### Body

```json
{
  "targetId": 1,
  "entityType": "user",
  "reason": "Testing unblock after temporary block"
}
```

#### DB أثر متوقع

- تحديث `blocked_entities.is_active = 0` أو إضافة `removed_at` حسب SecurityService.
- إضافة log في `admin_logs` باسم `UNBLOCK_ENTITY`.

---

### POST `/api/auth-admin/security/revoke-sessions`

إلغاء كل جلسات كيان معين.

#### Permission

`system_admin` أو `super_admin`.

#### Body

```json
{
  "targetId": 1,
  "entityType": "user",
  "reason": "Security test: revoke all sessions"
}
```

#### DB أثر متوقع

- تحديث `login_sessions.is_active = 0` للكيان المستهدف.
- تحديث `auth_tokens.is_revoked = 1` للكيان المستهدف.
- إضافة log في `admin_logs` باسم `REVOKE_ALL_SESSIONS`.

---

### POST `/api/auth-admin/security/update-entity-status`

تحديث status لكيان.

#### Permission

`system_admin` أو `super_admin`.

#### Body

```json
{
  "targetId": 1,
  "entityType": "user",
  "status": "suspended",
  "reason": "Security test status update"
}
```

#### status المقبولة حسب controller

```text
active
inactive
suspended
```

#### DB أثر متوقع

- تحديث جدول الكيان (`users`, `doctors`, `assistants`, وربما `admins` حسب controller الكامل).
- إضافة log في `admin_logs` باسم `UPDATE_ENTITY_STATUS`.

---

### POST `/api/auth-admin/security/end-session`

إنهاء session محددة.

#### Permission

`system_admin` أو `super_admin`.

#### Body مقترح للاختبار

```json
{
  "sessionId": 123,
  "reason": "Security test end session"
}
```

> إذا أعاد السيرفر خطأ validation، اختبر باسم `sessionToken` بدل `sessionId` لأن controller الكامل غير ظاهر بالكامل في نتيجة البحث المختصرة.

#### DB أثر متوقع

- `login_sessions.is_active = 0`
- `login_sessions.ended_at` ليس null
- log باسم `END_SESSION`

---

## 6. Super Admin Only Routes

بعد system admin section، الملف يستخدم:

```js
router.use(authorizeSuperAdmin);
```

أي أن المسارات التالية تحتاج `super_admin` فقط.

---

### POST `/api/auth-admin/register`

إنشاء admin جديد.

#### Permission

`super_admin` فقط.

#### Body

```json
{
  "email": "new.admin@example.com",
  "phone": "+201000000001",
  "password": "AdminPass123!",
  "adminType": "clinic_admin",
  "full_name": "New Clinic Admin",
  "language_code": "ar"
}
```

`authAdminRoutes.js` يضيف داخليًا:

```js
req.body.entityType = 'admin';
```

#### Valid adminType

```text
super_admin
system_admin
clinic_admin
```

#### Success — 201

```json
{
  "success": true,
  "message_en": "Registration successful. Please verify your email",
  "message_ar": "تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني",
  "userId": 10,
  "profileId": null,
  "uuid": "...",
  "requiresVerification": {
    "email": true,
    "phone": true
  }
}
```

#### DB أثر متوقع

- صف جديد في `admins` بحالة `pending_verification`.
- قد لا يتم إنشاء `admin_profiles` تلقائيًا من register؛ يجب التحقق فعليًا من DB.
- إضافة log باسم `CREATE_ADMIN`.

---

### POST `/api/auth-admin/security/manual-cleanup`

تشغيل cleanup أمني يدوي.

#### Permission

`super_admin` فقط.

#### Body

```json
{}
```

#### Expected

```json
{
  "success": true,
  "message": "Security cleanup completed",
  "stats": {}
}
```

#### DB أثر متوقع

- إضافة log باسم `MANUAL_CLEANUP` أو `MANUAL_SECURITY_CLEANUP` حسب مكان التسجيل.
- تنظيف tokens/sessions/failed attempts القديمة حسب SecurityCleanup.

---

## 7. Admin Profile Routes

Base path:

```text
/api/profile-admin
```

كل المسارات محمية بـ:

```js
router.use(authenticateJWT, authorizeAdmin);
router.use(checkAccountActive);
```

### Headers

```http
Authorization: Bearer {{admin_access_token}}
Accept-Language: ar
```

---

### GET `/api/profile-admin`

جلب ملف الأدمن الحالي بلغة واحدة حسب `Accept-Language` أو `language_preference`.

#### Expected — 200

```json
{
  "success": true,
  "message": "تم جلب الملف الشخصي بنجاح",
  "data": {
    "id": 1,
    "admin_id": 2,
    "full_name": "...",
    "job_title": "...",
    "department": "...",
    "language_preference": "ar"
  }
}
```

#### Error Cases

| Status | الحالة |
|---|---|
| 404 | لا يوجد admin profile لهذا الأدمن. |
| 500 | خطأ داخلي. |

---

### GET `/api/profile-admin/complete`

جلب بيانات الأدمن الكاملة: account + profile + translations.

#### Expected — 200

```json
{
  "success": true,
  "data": {
    "account": {
      "id": 2,
      "uuid": "...",
      "email": "...",
      "phone": "...",
      "admin_type": "super_admin",
      "status": "active",
      "is_active": 1
    },
    "profile": {
      "id": 1,
      "admin_id": 2
    },
    "translations": {
      "ar": {},
      "en": {}
    }
  }
}
```

---

### PUT `/api/profile-admin`

تحديث ملف الأدمن الحالي.

#### Body — flat current language

```json
{
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "nationality": "Egyptian",
  "emergency_contact_phone": "+201000000002",
  "timezone": "Africa/Cairo",
  "language_preference": "ar",
  "full_name": "Admin Arabic Name",
  "job_title": "System Administrator",
  "department": "Operations",
  "emergency_contact_name": "Emergency Contact",
  "emergency_contact_relationship": "Brother"
}
```

#### Body — multi language translations

```json
{
  "timezone": "Africa/Cairo",
  "language_preference": "ar",
  "translations": {
    "ar": {
      "full_name": "اسم الأدمن",
      "job_title": "مدير النظام",
      "department": "الإدارة"
    },
    "en": {
      "full_name": "Admin Name",
      "job_title": "System Admin",
      "department": "Operations"
    }
  }
}
```

#### Valid gender

```text
male
female
other
prefer_not_to_say
```

#### Success — 200

```json
{
  "success": true,
  "message": "تم تحديث الملف الشخصي بنجاح",
  "data": {}
}
```

---

### POST `/api/profile-admin/picture`

رفع صورة بروفايل للأدمن.

#### Content-Type

```http
multipart/form-data
```

#### Form field

```text
profile_picture = file
```

#### Success — 200

```json
{
  "success": true,
  "message": "تم رفع الصورة الشخصية بنجاح",
  "data": {
    "profile_picture_url": "http://localhost:3006/upload/files/profile-picture/...",
    "file_uuid": "...",
    "file_id": 1
  }
}
```

#### DB أثر متوقع

- تحديث `admin_profiles.profile_picture_url`.
- إضافة صف في `files` متعلق بالأدمن.

---

### DELETE `/api/profile-admin/picture`

حذف صورة بروفايل الأدمن الحالي.

#### Success — 200

```json
{
  "success": true,
  "message": "تم حذف الصورة الشخصية بنجاح"
}
```

#### DB أثر متوقع

- `admin_profiles.profile_picture_url = NULL`.

---

### DELETE `/api/profile-admin`

تعطيل حساب الأدمن الحالي.

#### تحذير

لا تستخدم هذا على حساب الأدمن الأساسي أثناء الاختبارات. أنشئ admin تجريبي أولًا.

#### Expected

```json
{
  "success": true,
  "message": "..."
}
```

#### DB أثر متوقع

- تحديث `admins.is_active = 0` أو status حسب controller.

---

### PATCH `/api/profile-admin/reactivate`

إعادة تفعيل حساب الأدمن الحالي بعد التعطيل.

#### Expected

```json
{
  "success": true,
  "message": "..."
}
```

#### DB أثر متوقع

- `admins.is_active = 1`.

---

## 8. Permission Matrix

| Endpoint | Any Admin | System Admin | Super Admin | Notes |
|---|---:|---:|---:|---|
| POST `/auth-admin/login` | Public | Public | Public | route يجبر `entityType=admin`. |
| POST `/auth-admin/refresh-token` | Public + refresh token | Public + refresh token | Public + refresh token | يحتاج refresh token صالح. |
| POST `/auth-admin/logout` | Yes | Yes | Yes | protected. |
| GET `/auth-admin/sessions` | Yes | Yes | Yes | protected. |
| GET `/auth-admin/security/*` read routes | Yes | Yes | Yes | stats/logs/alerts/sessions/failed/blocked. |
| POST `/auth-admin/security/block-entity` | No | Yes | Yes | user/doctor/assistant فقط في هذا route. |
| POST `/auth-admin/security/unblock-entity` | No | Yes | Yes | system+. |
| POST `/auth-admin/security/revoke-sessions` | No | Yes | Yes | system+. |
| POST `/auth-admin/security/update-entity-status` | No | Yes | Yes | system+. |
| POST `/auth-admin/security/end-session` | No | Yes | Yes | system+. |
| POST `/auth-admin/register` | No | No | Yes | super فقط. |
| POST `/auth-admin/security/manual-cleanup` | No | No | Yes | super فقط. |
| GET/PUT `/profile-admin` | Yes | Yes | Yes | current admin profile. |
| POST/DELETE `/profile-admin/picture` | Yes | Yes | Yes | current admin profile picture. |
| DELETE `/profile-admin` | Yes | Yes | Yes | خطر: يعطل الحساب الحالي. |
| PATCH `/profile-admin/reactivate` | Yes | Yes | Yes | يسمح بالرجوع بعد التعطيل حسب middleware. |

