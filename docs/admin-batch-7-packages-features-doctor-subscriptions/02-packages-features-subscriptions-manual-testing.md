# Admin Batch 7 Manual Testing Guide
## Packages / Features / Doctor Subscriptions

## 0. Required variables

```text
base_url=http://localhost:3006

admin_token=<ADMIN_TOKEN>
doctor_token=<DOCTOR_TOKEN>

feature_id=<CREATED_FEATURE_ID>
feature_id_2=<CREATED_SECOND_FEATURE_ID>
package_id=<CREATED_PACKAGE_ID>
package_feature_id=<CREATED_PACKAGE_FEATURE_ID>
subscription_id=<CREATED_SUBSCRIPTION_ID>
doctor_id=<DOCTOR_ID>
```

## 1. Recommended clean testing flow

Use disposable feature/package names so you can safely delete them after testing.

---

# Part A - Admin Features

## 1. Create Feature

```http
POST {{base_url}}/api/features
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "name_ar": "ميزة اختبار عدد الاستشارات",
  "name_en": "Test Consultations Feature",
  "unit_ar": "استشارة",
  "unit_en": "consultations",
  "is_active": true
}
```

Expected:

```text
201 Created
success = true
data.id returned
```

Save `data.id` as `feature_id`.

SQL:

```sql
SELECT * FROM features WHERE id = <feature_id>;
```

## 2. Create Second Feature for Bulk Test

```http
POST {{base_url}}/api/features
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "name_ar": "ميزة اختبار الظهور",
  "name_en": "Test Visibility Feature",
  "unit_ar": "مرة",
  "unit_en": "times",
  "is_active": true
}
```

Save `data.id` as `feature_id_2`.

## 3. Get All Features

```http
GET {{base_url}}/api/features
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
count >= 2
```

## 4. Get Active Features Only

```http
GET {{base_url}}/api/features?is_active=true
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
all rows is_active = 1
```

## 5. Get Feature by ID

```http
GET {{base_url}}/api/features/{{feature_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
data.id = feature_id
```

## 6. Update Feature

```http
PUT {{base_url}}/api/features/{{feature_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "unit_ar": "استشارة شهرية",
  "unit_en": "monthly consultations"
}
```

Expected:

```text
200 OK
data.unit_ar updated
```

## 7. Negative Duplicate Feature Name

Create another feature with the same `name_ar`.

Expected:

```text
400
message = اسم الميزة موجود مسبقاً
```

## 8. Toggle Feature Status

```http
PATCH {{base_url}}/api/features/{{feature_id}}/toggle-status
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
is_active toggled
```

Run again to reactivate before public tests.

---

# Part B - Admin Packages

## 9. Create Package

```http
POST {{base_url}}/api/packages
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "name_ar": "باقة اختبار شهرية",
  "name_en": "Monthly Test Package",
  "secondary_name_ar": "مناسبة للاختبار",
  "secondary_name_en": "Suitable for testing",
  "duration_days": 30,
  "price": 100,
  "currency_code": "EGP",
  "is_active": true
}
```

Expected:

```text
201 Created
success = true
data.id returned
```

Save `data.id` as `package_id`.

SQL:

```sql
SELECT * FROM packages WHERE id = <package_id>;
```

## 10. Get All Packages

```http
GET {{base_url}}/api/packages?include_features=true
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
packages returned
features included if any
```

## 11. Get Package by ID

```http
GET {{base_url}}/api/packages/{{package_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
features array exists
```

## 12. Update Package

```http
PUT {{base_url}}/api/packages/{{package_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "price": 150,
  "duration_days": 45
}
```

Expected:

```text
200 OK
price and duration_days updated
```

## 13. Negative Package Validation

```http
POST {{base_url}}/api/packages
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "name_ar": "باقة خاطئة",
  "duration_days": 0,
  "price": -1
}
```

Expected:

```text
400
```

---

# Part C - Package Features

## 14. Add Feature to Package

```http
POST {{base_url}}/api/package-features
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "package_id": {{package_id}},
  "feature_id": {{feature_id}},
  "feature_value": "10",
  "is_included": true
}
```

Expected:

```text
201 Created
data.id returned
```

Save `data.id` as `package_feature_id`.

SQL:

```sql
SELECT * FROM package_features WHERE id = <package_feature_id>;
```

## 15. Negative Duplicate Package Feature

Send the same request again.

Expected:

```text
400
message = الميزة موجودة مسبقاً في هذه الباقة
```

## 16. Bulk Add Features

```http
POST {{base_url}}/api/package-features/bulk
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "package_id": {{package_id}},
  "features": [
    {
      "feature_id": {{feature_id_2}},
      "feature_value": "نعم",
      "is_included": true
    },
    {
      "feature_id": 999999,
      "feature_value": "invalid",
      "is_included": true
    }
  ]
}
```

Expected:

```text
201 Created
added_count = 1
errors_count = 1
```

## 17. Get Package Features

```http
GET {{base_url}}/api/package-features/package/{{package_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
count >= 1
```

## 18. Get Feature Packages

```http
GET {{base_url}}/api/package-features/feature/{{feature_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
package appears in data
```

## 19. Update Package Feature

```http
PUT {{base_url}}/api/package-features/{{package_feature_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "feature_value": "20",
  "is_included": true
}
```

Expected:

```text
200 OK
feature_value updated
```

---

# Part D - Public APIs

## 20. Get Public Packages

```http
GET {{base_url}}/api/public/packages
Accept-Language: ar
```

Expected:

```text
200 OK
Only active packages
Only active and included features
```

## 21. Get Public Package by ID

```http
GET {{base_url}}/api/public/packages/{{package_id}}
```

Expected:

```text
200 OK if package is active
404 if package inactive
```

## 22. Get Public Comparison Matrix

```http
GET {{base_url}}/api/public/packages/comparison
```

Expected:

```text
200 OK
data.features
data.packages
```

## 23. Get Featured Package

```http
GET {{base_url}}/api/public/packages/featured
```

Expected:

```text
200 OK if active packages exist
```

## 24. Get Cheapest Package

```http
GET {{base_url}}/api/public/packages/cheapest
```

Expected:

```text
200 OK if active packages exist
```

## 25. Get Premium Package

```http
GET {{base_url}}/api/public/packages/premium
```

Expected:

```text
200 OK if active packages exist
```

## 26. Get Public Features

```http
GET {{base_url}}/api/public/features
```

Expected:

```text
200 OK
Only active features
```

---

# Part E - Doctor Subscription Flow

## 27. Doctor Subscribe

```http
POST {{base_url}}/api/doctor-subscriptions/subscribe
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "package_id": {{package_id}}
}
```

Expected:

```text
201 Created
subscription_status = pending
```

Save `data.id` as `subscription_id`.

SQL:

```sql
SELECT * FROM doctor_subscriptions WHERE id = <subscription_id>;
```

## 28. Negative Duplicate Active/Pending Subscription

Send subscribe request again with the same doctor.

Expected:

```text
400
message indicates doctor already has active or pending subscription
```

## 29. Doctor My Subscriptions

```http
GET {{base_url}}/api/doctor-subscriptions/my-subscriptions
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
subscription appears
```

## 30. Doctor My Pending Subscriptions

```http
GET {{base_url}}/api/doctor-subscriptions/my-subscriptions?status=pending
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
only pending rows
```

## 31. Doctor Current Subscription Before Approval

```http
GET {{base_url}}/api/doctor-subscriptions/current
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
404
message = لا يوجد اشتراك نشط حالياً
```

---

# Part F - Admin Subscription Management

## 32. Admin List All Subscriptions

```http
GET {{base_url}}/api/doctor-subscriptions/admin/all
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
data array
```

## 33. Admin Filter Pending Subscriptions

```http
GET {{base_url}}/api/doctor-subscriptions/admin/all?status=pending
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
only pending rows
```

## 34. Admin Get Subscription by ID

```http
GET {{base_url}}/api/doctor-subscriptions/admin/{{subscription_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
features array exists
```

## 35. Admin Approve Subscription

```http
PATCH {{base_url}}/api/doctor-subscriptions/admin/{{subscription_id}}/approve
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
subscription_status = active
approved_by_admin_id = admin id
last_modified_by_admin_id = admin id
doctors.current_subscription_id = subscription_id
```

SQL:

```sql
SELECT id, subscription_status, approved_by_admin_id, last_modified_by_admin_id
FROM doctor_subscriptions
WHERE id = <subscription_id>;

SELECT id, current_subscription_id
FROM doctors
WHERE id = <doctor_id>;
```

## 36. Doctor Current Subscription After Approval

```http
GET {{base_url}}/api/doctor-subscriptions/current
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
data.id = subscription_id
features returned
```

## 37. Negative Approve Active Subscription Again

```http
PATCH {{base_url}}/api/doctor-subscriptions/admin/{{subscription_id}}/approve
Authorization: Bearer {{admin_token}}
```

Expected:

```text
400
cannot activate subscription with status active
```

## 38. Admin Update Subscription

```http
PUT {{base_url}}/api/doctor-subscriptions/admin/{{subscription_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "is_trial": false,
  "end_date": "2026-12-31"
}
```

Expected:

```text
200 OK
last_modified_by_admin_id updated
end_date updated
```

## 39. Admin Expire Subscription

```http
PATCH {{base_url}}/api/doctor-subscriptions/admin/{{subscription_id}}/expire
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "reason": "Manual test"
}
```

Expected:

```text
200 OK
subscription_status = expired
doctors.current_subscription_id = NULL if this was current
```

## 40. Doctor Current Subscription After Expire

```http
GET {{base_url}}/api/doctor-subscriptions/current
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
404
```

---

# Part G - Optional Cleanup

Use only if test records are disposable.

## 41. Delete Package Feature

```http
DELETE {{base_url}}/api/package-features/{{package_feature_id}}
Authorization: Bearer {{admin_token}}
```

## 42. Delete Subscription

```http
DELETE {{base_url}}/api/doctor-subscriptions/admin/{{subscription_id}}
Authorization: Bearer {{admin_token}}
```

## 43. Delete Package

Only works if no subscription uses the package.

```http
DELETE {{base_url}}/api/packages/{{package_id}}
Authorization: Bearer {{admin_token}}
```

If blocked by subscriptions, this is correct behavior.

## 44. Delete Feature

Only works after removing package_features relationships.

```http
DELETE {{base_url}}/api/features/{{feature_id}}
Authorization: Bearer {{admin_token}}
```
