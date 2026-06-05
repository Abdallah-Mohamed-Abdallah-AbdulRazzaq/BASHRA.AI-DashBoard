# Batch 8 API Documentation
## Medications / Prescriptions / Ratings

## 1. Route Mounts

```http
/api/medications
/api/prescription-templates
/api/prescriptions
/api/ratings
```

---

# Part A - Medications Directory

## A1. Overview

Medications are a shared medication directory.

Admin:
- Can read/create/update/toggle/delete medications.
- Creates medication with `created_by_doctor_id = NULL`.

Doctor:
- Can read medications.
- Can create medications.
- Creates medication with `created_by_doctor_id = doctor.id`.
- Cannot update/toggle/delete medications because those routes require admin.

Base path:

```http
/api/medications
```

Supported body formats for write routes:

```http
application/json
multipart/form-data
```

---

## A2. Get All Medications

```http
GET /api/medications
Authorization: Bearer <ADMIN_OR_DOCTOR_TOKEN>
Accept-Language: ar
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `is_active` | boolean string | No | `true`, `false`, `1`, `0` |
| `category` | string | No | Exact category match |
| `form_type` | enum | No | tablet, capsule, syrup, cream, ointment, injection, drops, inhaler, suppository, sachet, other |
| `search` | string | No | Searches `name_ar`, `name_en`, `scientific_name` |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20 |

### Response shape

```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "id": 1,
      "uuid": "uuid",
      "name": "كريم اختبار",
      "name_ar": "كريم اختبار",
      "name_en": "Test Cream",
      "scientific_name": "Test Scientific",
      "category": "dermatology",
      "form_type": "cream",
      "available_dosages": ["1%", "2%"],
      "indications": "Skin irritation",
      "warning_alert": "Avoid eyes",
      "is_active": 1,
      "created_by": {
        "type": "admin",
        "verified": true
      }
    }
  ]
}
```

---

## A3. Get Medication by ID or UUID

```http
GET /api/medications/:id
Authorization: Bearer <ADMIN_OR_DOCTOR_TOKEN>
```

`id` can be numeric ID or UUID.

### Not found

```json
{
  "success": false,
  "message": "الدواء غير موجود"
}
```

---

## A4. Get Medication Categories

```http
GET /api/medications/categories/list
Authorization: Bearer <ADMIN_OR_DOCTOR_TOKEN>
```

Returns distinct active categories.

---

## A5. Get Medications by Category

```http
GET /api/medications/category/:category
Authorization: Bearer <ADMIN_OR_DOCTOR_TOKEN>
```

Only active medications are returned.

---

## A6. Create Medication

```http
POST /api/medications
Authorization: Bearer <ADMIN_OR_DOCTOR_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "name_ar": "كريم اختبار",
  "name_en": "Test Cream",
  "scientific_name": "Hydrocortisone Test",
  "category": "dermatology",
  "form_type": "cream",
  "available_dosages": ["1%", "2%"],
  "indications": "Skin inflammation",
  "warning_alert": "Avoid use near eyes",
  "is_active": true
}
```

### Required fields

```text
name_ar
name_en
```

### Valid form types

```text
tablet
capsule
syrup
cream
ointment
injection
drops
inhaler
suppository
sachet
other
```

### Duplicate rule

The controller checks:

```sql
WHERE name_ar = ? OR name_en = ?
```

If duplicate:

```json
{
  "success": false,
  "message": "الدواء موجود بالفعل"
}
```

---

## A7. Update Medication

```http
PUT /api/medications/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

Admin only.

All fields are optional.

```json
{
  "category": "dermatology-updated",
  "available_dosages": ["1%"],
  "warning_alert": "Updated warning"
}
```

Validation:
- Medication must exist.
- Empty body returns 400.
- Invalid `form_type` returns 400.

---

## A8. Toggle Medication Status

```http
PATCH /api/medications/:id/toggle-status
Authorization: Bearer <ADMIN_TOKEN>
```

Switches:

```text
is_active = 1 -> 0
is_active = 0 -> 1
```

---

## A9. Delete Medication

```http
DELETE /api/medications/:id
Authorization: Bearer <ADMIN_TOKEN>
```

Important rule:

Medication cannot be deleted if used in `prescription_template_items`.

If used:

```json
{
  "success": false,
  "message": "لا يمكن حذف الدواء لأنه مستخدم في قوالب وصفات طبية",
  "templates_count": 1
}
```

---

# Part B - Prescription Templates

## B1. Overview

Prescription templates are reusable doctor-owned templates. Each doctor can only manage their own templates.

Base path:

```http
/api/prescription-templates
```

All routes require doctor authentication.

---

## B2. Get Doctor Templates

```http
GET /api/prescription-templates
Authorization: Bearer <DOCTOR_TOKEN>
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `include_items` | boolean string | No |

Example:

```http
GET /api/prescription-templates?include_items=true
```

Templates are ordered by:

```sql
usage_count DESC, created_at DESC
```

---

## B3. Get Template by ID or UUID

```http
GET /api/prescription-templates/:id
Authorization: Bearer <DOCTOR_TOKEN>
```

Only returns the template if it belongs to the logged-in doctor.

Always includes items.

---

## B4. Create Template with Items

```http
POST /api/prescription-templates
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "template_name": "قالب علاج التهاب جلدي",
  "description": "قالب اختبار",
  "items": [
    {
      "medication_id": 1,
      "default_dosage": "طبقة رقيقة",
      "default_frequency": "مرتين يوميًا",
      "default_duration": "7 أيام",
      "default_instructions": "يستخدم على المنطقة المصابة فقط",
      "default_quantity": "1 عبوة"
    }
  ]
}
```

### Required fields

Template:
```text
template_name
items array with at least one item
```

Each valid item:
```text
medication_id
default_dosage
default_frequency
```

Medication must exist and be active.

If all items fail, the whole transaction is rolled back.

---

## B5. Update Template

```http
PUT /api/prescription-templates/:id
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

Updates only:

```text
template_name
description
```

---

## B6. Delete Template

```http
DELETE /api/prescription-templates/:id
Authorization: Bearer <DOCTOR_TOKEN>
```

Deletes the template and cascades template items.

---

## B7. Add Item to Template

```http
POST /api/prescription-templates/:id/items
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "medication_id": 1,
  "default_dosage": "طبقة رقيقة",
  "default_frequency": "مرة يوميًا",
  "default_duration": "5 أيام",
  "default_instructions": "بعد غسل المنطقة",
  "default_quantity": "1"
}
```

Validation:
- Template must belong to doctor.
- Medication must exist and be active.
- Same medication cannot be duplicated inside the same template.

---

## B8. Update Template Item

```http
PUT /api/prescription-templates/:id/items/:itemId
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

All item fields are optional, but at least one must be sent.

---

## B9. Delete Template Item

```http
DELETE /api/prescription-templates/:id/items/:itemId
Authorization: Bearer <DOCTOR_TOKEN>
```

---

## B10. Increment Template Usage Count

```http
PATCH /api/prescription-templates/:id/use
Authorization: Bearer <DOCTOR_TOKEN>
```

Increments:

```sql
usage_count = usage_count + 1
```

---

# Part C - Prescriptions

## C1. Overview

Prescriptions are created by doctors for patients and medical records.

Base path:

```http
/api/prescriptions
```

Role behavior:
- Patient views own prescriptions.
- Doctor views own prescriptions.
- Admin views all prescriptions.
- Doctor creates/updates/cancels prescriptions and translations.
- Any authenticated user can call fill endpoint according to current route.

---

## C2. Get All Prescriptions

```http
GET /api/prescriptions
Authorization: Bearer <USER_OR_DOCTOR_OR_ADMIN_TOKEN>
Accept-Language: ar
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `patient_id` | number | No | Additional filter |
| `status` | enum | No | active, filled, expired, cancelled, replaced |
| `medical_record_id` | number | No | Filter by record |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20 |

### Role filters

Current controller adds:
- If role is user: `p.patient_id = req.user.id`
- If role is doctor: `p.doctor_id = req.user.doctor_id || req.user.id`
- Admin: no role-based filter

---

## C3. Get Prescriptions by Medical Record

```http
GET /api/prescriptions/medical-record/:recordId
Authorization: Bearer <USER_OR_DOCTOR_OR_ADMIN_TOKEN>
```

Role filtering is also applied.

---

## C4. Get Prescription by ID or UUID

```http
GET /api/prescriptions/:id
Authorization: Bearer <USER_OR_DOCTOR_OR_ADMIN_TOKEN>
```

Returns translations map.

---

## C5. Create Prescription

```http
POST /api/prescriptions
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "medical_record_id": 1,
  "patient_id": 1,
  "medication_name": "كريم اختبار",
  "dosage": "طبقة رقيقة",
  "frequency": "مرتين يوميًا",
  "duration": "7 أيام",
  "quantity": "1 عبوة",
  "route_of_administration": "topical",
  "refills_allowed": 1,
  "is_generic_allowed": true,
  "expiry_date": "2026-12-31",
  "translations": {
    "ar": {
      "instructions": "ضع الكريم على المنطقة المصابة",
      "indication": "حكة واحمرار",
      "pharmacy_notes": "لا يصرف بدون متابعة"
    },
    "en": {
      "instructions": "Apply to affected area",
      "indication": "Itching and redness",
      "pharmacy_notes": "Follow-up recommended"
    }
  }
}
```

### Required fields

```text
medical_record_id
patient_id
medication_name
dosage
frequency
```

### Validation

Medical record must exist and belong to patient:

```sql
SELECT id FROM medical_records WHERE id = ? AND patient_id = ?
```

### Current source-review warning

`createPrescription` references `lang` inside the function but does not define it before use in several response paths. If you get `500 ReferenceError: lang is not defined`, this is a code issue to fix, not an API usage mistake.

---

## C6. Update Prescription

```http
PUT /api/prescriptions/:id
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

Doctor can update only own prescription.

Cannot update if status is:

```text
filled
cancelled
```

All fields are optional, but at least one must be sent.

---

## C7. Cancel Prescription

```http
PATCH /api/prescriptions/:id/cancel
Authorization: Bearer <DOCTOR_TOKEN>
```

Doctor can cancel only own prescription.

Cannot cancel:
- already cancelled prescription
- filled prescription

### Current source-review warning

`cancelPrescription` references `lang` before defining it in some branches. If testing returns 500, capture terminal error.

---

## C8. Fill Prescription

```http
PATCH /api/prescriptions/:id/fill
Authorization: Bearer <ANY_AUTHENTICATED_TOKEN>
```

Current route requires authentication only.

Behavior:
- If active: status becomes `filled`, `filled_date = NOW()`, `refills_used = 1`.
- If already filled and refills remain: increments `refills_used`.
- Cancelled prescriptions cannot be filled.
- Expired prescriptions cannot be filled.
- If `refills_used >= refills_allowed` and current status is `filled`, returns 400.

### Current source-review warning

`fillPrescription` references `lang` before defining it in some branches. If testing returns 500, capture terminal error.

---

## C9. Add or Update Prescription Translation

```http
POST /api/prescriptions/:id/translations
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "language_code": "ar",
  "instructions": "تعليمات محدثة",
  "indication": "التهاب جلدي",
  "pharmacy_notes": "ملاحظات للصيدلية"
}
```

If translation exists, it updates. Otherwise, it inserts.

---

# Part D - Ratings

## D1. Overview

Ratings connect completed appointments to doctor reviews.

Base path:

```http
/api/ratings
```

Role behavior:
- Patient creates/updates/deletes own ratings.
- Doctor views own ratings and responds.
- Admin views all ratings and moderates.
- Public can view doctor stats.

---

## D2. Get All Ratings

```http
GET /api/ratings
Authorization: Bearer <USER_OR_DOCTOR_OR_ADMIN_TOKEN>
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `doctor_id` | number | No | Filter by doctor |
| `patient_id` | number | No | Applied only for admin |
| `status` | enum | No | active, hidden, removed |
| `min_rating` | number | No | 1-5 |
| `max_rating` | number | No | 1-5 |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20 |

Role filters:
- Patient sees own ratings.
- Doctor sees own ratings.
- Admin can see all and filter by patient.

Anonymous ratings return anonymous patient display name.

---

## D3. Get Doctor Rating Stats

```http
GET /api/ratings/doctor/:doctor_id/stats
```

Public endpoint.

Returns:
- total ratings
- average rating
- distribution 1-5
- recommendation count and percentage

Only `status = active` is counted.

---

## D4. Get Rating by ID or UUID

```http
GET /api/ratings/:id
Authorization: Bearer <USER_OR_DOCTOR_OR_ADMIN_TOKEN>
```

Role-restricted:
- Patient only own rating.
- Doctor only own doctor ratings.
- Admin any rating.

Returns translations map with:
- review title
- review comment
- flagged reason
- doctor response

---

## D5. Create Rating

```http
POST /api/ratings
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "appointment_id": 1,
  "doctor_id": 1,
  "rating": 5,
  "categories": {
    "communication": 5,
    "punctuality": 4,
    "care_quality": 5
  },
  "would_recommend": true,
  "is_anonymous": false,
  "translations": {
    "ar": {
      "review_title": "تجربة ممتازة",
      "review_comment": "الطبيب كان متعاونًا"
    },
    "en": {
      "review_title": "Excellent experience",
      "review_comment": "The doctor was helpful"
    }
  }
}
```

### Validation

- `appointment_id`, `doctor_id`, `rating` are required.
- `rating` must be 1-5.
- Appointment must belong to patient.
- Appointment must be `completed`.
- Only one rating per appointment is allowed.
- Doctor rating stats are recalculated after create.

---

## D6. Update Rating

```http
PUT /api/ratings/:id
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json
```

Patient can update own rating.

Allowed fields:
- rating
- categories
- would_recommend
- is_anonymous
- translations

Doctor stats are recalculated if rating value changes.

---

## D7. Delete Rating

```http
DELETE /api/ratings/:id
Authorization: Bearer <USER_TOKEN>
```

Patient can delete own rating. Rating translations are deleted by cascade. Doctor stats are recalculated.

---

## D8. Doctor Responds to Rating

```http
POST /api/ratings/:id/respond
Authorization: Bearer <DOCTOR_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "language_code": "ar",
  "response": "شكرًا على تقييمك، نتمنى لك دوام الصحة."
}
```

Rules:
- Rating must belong to this doctor.
- If translation exists for language, response is updated.
- Otherwise a translation row is inserted.
- `doctor_responded_at = NOW()`.

---

## D9. Admin Flags Rating

```http
PATCH /api/ratings/:id/flag
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "language_code": "ar",
  "reason": "مراجعة غير مناسبة"
}
```

Behavior:
- `is_flagged = 1`
- `flagged_by_admin_id = admin id`
- `flagged_at = NOW()`
- If `language_code` is provided, `flagged_reason` is saved/updated in `rating_translations`.

---

## D10. Admin Updates Rating Status

```http
PATCH /api/ratings/:id/status
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "status": "hidden"
}
```

Allowed status:

```text
active
hidden
removed
```

Doctor stats are recalculated based on active ratings only.
