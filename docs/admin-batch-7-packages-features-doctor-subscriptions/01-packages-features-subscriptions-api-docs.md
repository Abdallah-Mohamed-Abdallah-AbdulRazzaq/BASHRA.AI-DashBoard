# Admin Batch 7 API Documentation
## Packages / Features / Doctor Subscriptions

## 1. Main Database Tables

```text
features
packages
package_features
doctor_subscriptions
doctors
admins
doctor_profiles
doctor_profile_translations
```

## 2. Routes mounted in `routes/index.js`

```http
/api/features
/api/packages
/api/package-features
/api/public/packages
/api/public/features
/api/doctor-subscriptions
```

---

# Part A - Admin Features Management

## A1. Overview

Features represent benefits or limits that can be attached to subscription packages.

Examples:

```text
عدد الاستشارات
ظهور في نتائج البحث
دعم فني
رفع صور العيادة
```

Base path:

```http
/api/features
```

All routes require admin authentication.

The routes accept both:

```http
application/json
multipart/form-data
```

because `parseFormData` supports form-data without files and JSON.

---

## A2. Get All Features

```http
GET /api/features
Authorization: Bearer <ADMIN_TOKEN>
Accept-Language: ar
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `is_active` | boolean string | No | `true`, `false`, `1`, `0` |

### Examples

```http
GET /api/features
GET /api/features?is_active=true
GET /api/features?is_active=false
```

### Response shape

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "عدد الاستشارات",
      "name_ar": "عدد الاستشارات",
      "name_en": "Consultations Count",
      "unit": "استشارة",
      "unit_ar": "استشارة",
      "unit_en": "consultations",
      "is_active": 1,
      "created_at": "2026-06-05T00:00:00.000Z",
      "updated_at": "2026-06-05T00:00:00.000Z"
    }
  ]
}
```

Language behavior:

- `Accept-Language: ar` uses `name_ar` and `unit_ar`.
- `Accept-Language: en` uses `name_en` and `unit_en` when available.

---

## A3. Get Feature by ID

```http
GET /api/features/:id
Authorization: Bearer <ADMIN_TOKEN>
```

### Not found

```json
{
  "success": false,
  "message": "الميزة غير موجودة"
}
```

---

## A4. Create Feature

```http
POST /api/features
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "name_ar": "عدد الاستشارات الشهرية",
  "name_en": "Monthly Consultations",
  "unit_ar": "استشارة",
  "unit_en": "consultations",
  "is_active": true
}
```

### Fields

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `name_ar` | string | Yes | Must be unique |
| `name_en` | string | No | Optional |
| `unit_ar` | string | No | Optional |
| `unit_en` | string | No | Optional |
| `is_active` | boolean | No | Default true |

### Validation

- Missing `name_ar` returns 400.
- Duplicate `name_ar` returns 400.

---

## A5. Update Feature

```http
PUT /api/features/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

All fields are optional.

```json
{
  "name_ar": "عدد الاستشارات المحدث",
  "name_en": "Updated Consultations",
  "unit_ar": "مرة",
  "unit_en": "times",
  "is_active": true
}
```

### Validation

- Feature not found returns 404.
- Duplicate `name_ar` with another feature returns 400.
- Empty body returns 400.

---

## A6. Toggle Feature Status

```http
PATCH /api/features/:id/toggle-status
Authorization: Bearer <ADMIN_TOKEN>
```

### Behavior

Switches:

```text
is_active = 1 -> 0
is_active = 0 -> 1
```

---

## A7. Delete Feature

```http
DELETE /api/features/:id
Authorization: Bearer <ADMIN_TOKEN>
```

### Important rule

Feature cannot be deleted if used in `package_features`.

If used, returns:

```json
{
  "success": false,
  "message": "لا يمكن حذف الميزة لأنها مستخدمة في باقات",
  "packages_count": 1
}
```

---

# Part B - Admin Packages Management

## B1. Overview

Packages represent paid subscription plans for doctors.

Base path:

```http
/api/packages
```

All routes require admin authentication.

---

## B2. Get All Packages

```http
GET /api/packages
Authorization: Bearer <ADMIN_TOKEN>
Accept-Language: ar
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `is_active` | boolean string | No | Filter active/inactive packages |
| `include_features` | boolean string | No | If true, includes package features |

### Examples

```http
GET /api/packages
GET /api/packages?is_active=true
GET /api/packages?include_features=true
GET /api/packages?is_active=true&include_features=true
```

### Response shape

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "الباقة الأساسية",
      "name_ar": "الباقة الأساسية",
      "name_en": "Basic Plan",
      "secondary_name": "للبداية",
      "duration_days": 30,
      "price": 100,
      "currency_code": "EGP",
      "is_active": 1,
      "features": []
    }
  ]
}
```

---

## B3. Get Package by ID

```http
GET /api/packages/:id
Authorization: Bearer <ADMIN_TOKEN>
```

Always includes package features.

---

## B4. Create Package

```http
POST /api/packages
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "name_ar": "باقة اختبار",
  "name_en": "Test Plan",
  "secondary_name_ar": "مناسبة للتجربة",
  "secondary_name_en": "For testing",
  "duration_days": 30,
  "price": 100,
  "currency_code": "EGP",
  "is_active": true
}
```

### Fields

| Field | Type | Required |
|---|---:|---:|
| `name_ar` | string | Yes |
| `name_en` | string | No |
| `secondary_name_ar` | string | No |
| `secondary_name_en` | string | No |
| `duration_days` | number | Yes |
| `price` | number | Yes |
| `currency_code` | string | No |
| `is_active` | boolean | No |

### Validation

- `name_ar`, `duration_days`, and `price` are required.
- `duration_days` must be greater than zero.
- `price` must be zero or greater.

---

## B5. Update Package

```http
PUT /api/packages/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

All fields are optional.

```json
{
  "name_ar": "باقة اختبار محدثة",
  "duration_days": 60,
  "price": 150,
  "currency_code": "EGP",
  "is_active": true
}
```

### Validation

- Package not found returns 404.
- Empty body returns 400.
- `duration_days <= 0` returns 400.
- `price < 0` returns 400.

---

## B6. Toggle Package Status

```http
PATCH /api/packages/:id/toggle-status
Authorization: Bearer <ADMIN_TOKEN>
```

Switches package active state.

---

## B7. Delete Package

```http
DELETE /api/packages/:id
Authorization: Bearer <ADMIN_TOKEN>
```

### Important rule

Package cannot be deleted if used in `doctor_subscriptions`.

If used, returns:

```json
{
  "success": false,
  "message": "لا يمكن حذف الباقة لأنها مستخدمة في اشتراكات",
  "subscriptions_count": 1
}
```

When deleted, related rows in `package_features` are deleted by cascade.

---

# Part C - Admin Package Features

## C1. Overview

`package_features` links a feature to a package with a value.

Example:

```text
Package: Premium
Feature: Monthly Consultations
feature_value: 100
is_included: true
```

Base path:

```http
/api/package-features
```

All routes require admin authentication.

---

## C2. Get Features for Package

```http
GET /api/package-features/package/:packageId
Authorization: Bearer <ADMIN_TOKEN>
```

### Not found

If package does not exist, returns 404.

---

## C3. Get Packages for Feature

```http
GET /api/package-features/feature/:featureId
Authorization: Bearer <ADMIN_TOKEN>
```

### Not found

If feature does not exist, returns 404.

---

## C4. Add Feature to Package

```http
POST /api/package-features
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "package_id": 1,
  "feature_id": 1,
  "feature_value": "10",
  "is_included": true
}
```

### Validation

- `package_id`, `feature_id`, and `feature_value` are required.
- Package must exist.
- Feature must exist.
- Same feature cannot be added twice to the same package.

---

## C5. Bulk Add Features to Package

```http
POST /api/package-features/bulk
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "package_id": 1,
  "features": [
    {
      "feature_id": 1,
      "feature_value": "10",
      "is_included": true
    },
    {
      "feature_id": 2,
      "feature_value": "نعم",
      "is_included": true
    }
  ]
}
```

### Behavior

The endpoint returns:

```text
added_count
errors_count
added
errors
```

If one feature is invalid or already exists, it is added to `errors` and the remaining valid features continue.

---

## C6. Update Package Feature

```http
PUT /api/package-features/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "feature_value": "20",
  "is_included": true
}
```

### Validation

- Relationship not found returns 404.
- Empty body returns 400.

---

## C7. Delete Package Feature

```http
DELETE /api/package-features/:id
Authorization: Bearer <ADMIN_TOKEN>
```

Deletes the relationship from `package_features`.

---

# Part D - Public Packages / Features

## D1. Overview

Public APIs are read-only and require no authentication.

They only return:

```text
active packages
active features
included package features
```

---

## D2. Get All Public Packages

```http
GET /api/public/packages
Accept-Language: ar
```

Returns active packages ordered by price ascending.

Only included active features are returned:

```sql
f.is_active = 1
pf.is_included = 1
```

---

## D3. Get Public Package by ID

```http
GET /api/public/packages/:id
```

Returns 404 if package is not active or does not exist.

---

## D4. Get Packages Comparison Matrix

```http
GET /api/public/packages/comparison
```

Returns:

```json
{
  "success": true,
  "data": {
    "features": [],
    "packages": []
  }
}
```

Used for pricing/comparison UI.

---

## D5. Get Featured Package

```http
GET /api/public/packages/featured
```

Current logic:

- Gets active packages ordered by price ascending.
- Selects the middle package using `Math.floor(packages.length / 2)`.

---

## D6. Get Cheapest Package

```http
GET /api/public/packages/cheapest
```

Current logic:

```sql
ORDER BY price ASC LIMIT 1
```

---

## D7. Get Premium Package

```http
GET /api/public/packages/premium
```

Current logic:

```sql
ORDER BY price DESC LIMIT 1
```

---

## D8. Get Public Active Features

```http
GET /api/public/features
```

Returns only active features.

---

# Part E - Doctor Subscription Flow

## E1. Overview

Doctors can:

1. Subscribe to an active package.
2. View their subscriptions.
3. View current active subscription.
4. Cancel only pending subscription requests.

Base path:

```http
/api/doctor-subscriptions
```

Doctor routes require doctor token.

---

## E2. Doctor Creates Subscription Request

```http
POST /api/doctor-subscriptions/subscribe
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "package_id": 1
}
```

### Behavior

- Package must exist.
- Package must be active.
- Doctor cannot have active or pending subscription.
- Subscription is created with `subscription_status = pending`.
- `start_date = today`.
- `end_date = today + package.duration_days`.

### Renewal behavior

If doctor has a canceled subscription, the endpoint updates the latest canceled subscription to pending instead of inserting a new row.

---

## E3. Doctor Gets My Subscriptions

```http
GET /api/doctor-subscriptions/my-subscriptions
Authorization: Bearer <DOCTOR_TOKEN>
```

Optional:

```http
GET /api/doctor-subscriptions/my-subscriptions?status=pending
```

---

## E4. Doctor Gets Current Active Subscription

```http
GET /api/doctor-subscriptions/current
Authorization: Bearer <DOCTOR_TOKEN>
```

Returns 404 if there is no active subscription.

If active subscription exists, package features are included.

---

## E5. Doctor Cancels Pending Subscription Request

```http
DELETE /api/doctor-subscriptions/:id/cancel
Authorization: Bearer <DOCTOR_TOKEN>
```

### Rules

- Subscription must belong to the doctor.
- Only `pending` subscriptions can be canceled.
- Status becomes `canceled`.

---

# Part F - Admin Doctor Subscription Management

## F1. Overview

Admin can:

- List all subscriptions.
- View subscription details.
- Approve pending subscription.
- Update subscription fields.
- Expire subscription.
- Delete subscription.

Admin routes are under:

```http
/api/doctor-subscriptions/admin
```

---

## F2. Admin Gets All Subscriptions

```http
GET /api/doctor-subscriptions/admin/all
Authorization: Bearer <ADMIN_TOKEN>
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `status` | string | No |
| `doctor_id` | number | No |
| `package_id` | number | No |

Allowed status values from DB:

```text
active
pending
expired
canceled
```

---

## F3. Admin Gets Subscription by ID

```http
GET /api/doctor-subscriptions/admin/:id
Authorization: Bearer <ADMIN_TOKEN>
```

Includes package features.

---

## F4. Admin Approves Subscription

```http
PATCH /api/doctor-subscriptions/admin/:id/approve
Authorization: Bearer <ADMIN_TOKEN>
```

### Rules

- Subscription must exist.
- Subscription must be `pending`.
- Existing active subscriptions for the same doctor are set to `expired`.
- Selected subscription becomes `active`.
- `approved_by_admin_id` and `last_modified_by_admin_id` are set.
- `doctors.current_subscription_id` is updated.

---

## F5. Admin Updates Subscription

```http
PUT /api/doctor-subscriptions/admin/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "subscription_status": "active",
  "is_trial": false,
  "start_date": "2026-06-05",
  "end_date": "2026-07-05"
}
```

### Notes

- All fields are optional, but at least one must be sent.
- `last_modified_by_admin_id` is always updated.
- If `subscription_status = active`, `doctors.current_subscription_id` is updated.

---

## F6. Admin Expires Subscription

```http
PATCH /api/doctor-subscriptions/admin/:id/expire
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "reason": "Manual admin test"
}
```

### Current behavior

`reason` is accepted in the body but not persisted in the DB by current controller logic.

### DB impact

- `doctor_subscriptions.subscription_status = expired`
- `last_modified_by_admin_id = adminId`
- If subscription is current, `doctors.current_subscription_id = NULL`

---

## F7. Admin Deletes Subscription

```http
DELETE /api/doctor-subscriptions/admin/:id
Authorization: Bearer <ADMIN_TOKEN>
```

### DB impact

- Clears `doctors.current_subscription_id` if it points to this subscription.
- Deletes row from `doctor_subscriptions`.

Use only disposable subscriptions for deletion testing.
