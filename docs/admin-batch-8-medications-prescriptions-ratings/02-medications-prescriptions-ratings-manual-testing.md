# Batch 8 Manual Testing Guide
## Medications / Prescriptions / Ratings

## 0. Required variables

```text
base_url=http://localhost:3006

admin_token=<ADMIN_TOKEN>
doctor_token=<DOCTOR_TOKEN>
user_token=<USER_TOKEN>

doctor_id=<DOCTOR_ID>
patient_id=<USER_ID>
medical_record_id=<VALID_MEDICAL_RECORD_ID_FOR_PATIENT>
appointment_id=<VALID_COMPLETED_APPOINTMENT_ID_FOR_PATIENT_AND_DOCTOR>

medication_id=<CREATED_MEDICATION_ID>
medication_uuid=<CREATED_MEDICATION_UUID>
template_id=<CREATED_TEMPLATE_ID>
template_item_id=<CREATED_TEMPLATE_ITEM_ID>
prescription_id=<CREATED_PRESCRIPTION_ID>
prescription_uuid=<CREATED_PRESCRIPTION_UUID>
rating_id=<CREATED_RATING_ID>
rating_uuid=<CREATED_RATING_UUID>
```

## 1. Important prerequisites

For prescription tests:
- You need a valid `medical_record_id`.
- The medical record must belong to `patient_id`.
- The logged-in doctor must be the doctor creating the prescription.

For rating tests:
- You need a completed appointment.
- Appointment must belong to the logged-in patient.
- Appointment status must be `completed`.
- Only one rating can exist per appointment.

Use SQL verification section to find valid IDs.

---

# Part A - Medications

## 1. Admin Create Medication

```http
POST {{base_url}}/api/medications
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "name_ar": "كريم اختبار دفعة 8",
  "name_en": "Batch 8 Test Cream",
  "scientific_name": "Test Scientific Name",
  "category": "dermatology",
  "form_type": "cream",
  "available_dosages": ["1%", "2%"],
  "indications": "Skin irritation",
  "warning_alert": "Avoid eyes",
  "is_active": true
}
```

Expected:

```text
201 Created
success = true
data.id
data.uuid
data.created_by.type = admin
```

Save:
```text
medication_id = data.id
medication_uuid = data.uuid
```

SQL:

```sql
SELECT * FROM medications WHERE id = <medication_id>;
```

## 2. Doctor Create Medication

```http
POST {{base_url}}/api/medications
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "name_ar": "مرهم اختبار طبيب دفعة 8",
  "name_en": "Batch 8 Doctor Ointment",
  "scientific_name": "Doctor Scientific",
  "category": "dermatology",
  "form_type": "ointment",
  "available_dosages": ["5mg"],
  "is_active": true
}
```

Expected:

```text
201 Created
created_by.type = doctor
created_by.doctor_id exists
```

## 3. List Medications

```http
GET {{base_url}}/api/medications?page=1&limit=20
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
data array
pagination fields: total, page, pages
```

## 4. Search Medication

```http
GET {{base_url}}/api/medications?search=دفعة 8
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
matching medication appears
```

## 5. Filter by Category and Form Type

```http
GET {{base_url}}/api/medications?category=dermatology&form_type=cream&is_active=true
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
only matching rows
```

## 6. Get Medication by ID

```http
GET {{base_url}}/api/medications/{{medication_id}}
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
data.id = medication_id
```

## 7. Get Medication by UUID

```http
GET {{base_url}}/api/medications/{{medication_uuid}}
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
data.uuid = medication_uuid
```

## 8. Categories List

```http
GET {{base_url}}/api/medications/categories/list
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
data contains dermatology if active medication exists
```

## 9. Medications by Category

```http
GET {{base_url}}/api/medications/category/dermatology
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
only active dermatology medications
```

## 10. Admin Update Medication

```http
PUT {{base_url}}/api/medications/{{medication_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "warning_alert": "Updated warning for batch 8",
  "available_dosages": ["1%"]
}
```

Expected:

```text
200 OK
warning_alert updated
```

## 11. Doctor Negative Update Medication

```http
PUT {{base_url}}/api/medications/{{medication_id}}
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "warning_alert": "Doctor should not update"
}
```

Expected:

```text
403 or authorization failure
```

## 12. Admin Toggle Medication Status

```http
PATCH {{base_url}}/api/medications/{{medication_id}}/toggle-status
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
is_active toggled
```

Run again to reactivate before template tests.

## 13. Negative Duplicate Medication

Send create medication again with same `name_ar` or `name_en`.

Expected:

```text
400
message = الدواء موجود بالفعل
```

## 14. Negative Invalid Form Type

```http
POST {{base_url}}/api/medications
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "name_ar": "دواء نوع خاطئ",
  "name_en": "Invalid Type Medication",
  "form_type": "invalid"
}
```

Expected:

```text
400
```

---

# Part B - Prescription Templates

## 15. Doctor Create Template with Medication

```http
POST {{base_url}}/api/prescription-templates
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "template_name": "قالب اختبار دفعة 8",
  "description": "قالب لعلاج حالة جلدية بسيطة",
  "items": [
    {
      "medication_id": {{medication_id}},
      "default_dosage": "طبقة رقيقة",
      "default_frequency": "مرتين يوميًا",
      "default_duration": "7 أيام",
      "default_instructions": "ضع الدواء على المنطقة المصابة فقط",
      "default_quantity": "1 عبوة"
    }
  ]
}
```

Expected:

```text
201 Created
data.id returned
added_items = 1
```

Save:

```text
template_id = data.id
```

SQL:

```sql
SELECT * FROM prescription_templates WHERE id = <template_id>;
SELECT * FROM prescription_template_items WHERE template_id = <template_id>;
```

## 16. Doctor List Templates with Items

```http
GET {{base_url}}/api/prescription-templates?include_items=true
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
template appears
items included
```

## 17. Doctor Get Template by ID

```http
GET {{base_url}}/api/prescription-templates/{{template_id}}
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
items array exists
```

## 18. Update Template

```http
PUT {{base_url}}/api/prescription-templates/{{template_id}}
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "description": "Updated template description"
}
```

Expected:

```text
200 OK
description updated
```

## 19. Add Second Item to Template

This requires another active medication. Use another `medication_id` if available.

```http
POST {{base_url}}/api/prescription-templates/{{template_id}}/items
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "medication_id": {{another_medication_id}},
  "default_dosage": "مرة واحدة",
  "default_frequency": "مرة يوميًا",
  "default_duration": "5 أيام"
}
```

Expected:

```text
201 Created
item_id returned
```

Save `item_id` as `template_item_id`.

## 20. Negative Duplicate Template Item

Add the same medication to same template again.

Expected:

```text
400
message = الدواء موجود بالفعل في القالب
```

## 21. Update Template Item

```http
PUT {{base_url}}/api/prescription-templates/{{template_id}}/items/{{template_item_id}}
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "default_frequency": "ثلاث مرات يوميًا"
}
```

Expected:

```text
200 OK
```

## 22. Increment Template Usage

```http
PATCH {{base_url}}/api/prescription-templates/{{template_id}}/use
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
usage_count increased by 1
```

---

# Part C - Prescriptions

## 23. Doctor Create Prescription

```http
POST {{base_url}}/api/prescriptions
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
Accept-Language: ar
```

Body:

```json
{
  "medical_record_id": {{medical_record_id}},
  "patient_id": {{patient_id}},
  "medication_name": "كريم اختبار دفعة 8",
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
      "instructions": "يوضع على المنطقة المصابة فقط",
      "indication": "احمرار وحكة",
      "pharmacy_notes": "يراعى تجنب العين"
    },
    "en": {
      "instructions": "Apply to affected area only",
      "indication": "Redness and itching",
      "pharmacy_notes": "Avoid eyes"
    }
  }
}
```

Expected target behavior:

```text
201 Created
status = active
prescription_number starts with RX-
```

Important current-code watch point:

```text
If response is 500 with "lang is not defined", capture logs.
This indicates code issue in PrescriptionsController, not invalid test data.
```

Save:
```text
prescription_id = data.id
prescription_uuid = data.uuid
```

SQL:

```sql
SELECT * FROM prescriptions WHERE id = <prescription_id>;
SELECT * FROM prescription_translations WHERE prescription_id = <prescription_id>;
```

## 24. User List Own Prescriptions

```http
GET {{base_url}}/api/prescriptions
Authorization: Bearer {{user_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
Only prescriptions for this patient
```

## 25. Doctor List Own Prescriptions

```http
GET {{base_url}}/api/prescriptions
Authorization: Bearer {{doctor_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
Only prescriptions for this doctor
```

## 26. Admin List All Prescriptions

```http
GET {{base_url}}/api/prescriptions
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
Admin can see all prescriptions
```

## 27. Get Prescription by ID

```http
GET {{base_url}}/api/prescriptions/{{prescription_id}}
Authorization: Bearer {{doctor_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
translations map returned
```

## 28. Get Prescriptions by Medical Record

```http
GET {{base_url}}/api/prescriptions/medical-record/{{medical_record_id}}
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
prescriptions for record
```

## 29. Update Prescription

```http
PUT {{base_url}}/api/prescriptions/{{prescription_id}}
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "frequency": "مرة يوميًا",
  "quantity": "2 عبوة"
}
```

Expected:

```text
200 OK if prescription is not filled/cancelled
```

## 30. Add/Update Translation

```http
POST {{base_url}}/api/prescriptions/{{prescription_id}}/translations
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "language_code": "ar",
  "instructions": "تعليمات محدثة",
  "indication": "التهاب جلدي بسيط",
  "pharmacy_notes": "ملاحظات محدثة"
}
```

Expected:

```text
200 OK
translation upserted
```

## 31. Fill Prescription

```http
PATCH {{base_url}}/api/prescriptions/{{prescription_id}}/fill
Authorization: Bearer {{user_token}}
```

Expected target behavior:

```text
200 OK
status = filled
refills_used = 1
filled_date set
```

Watch point:

```text
If response is 500 with "lang is not defined", capture logs.
```

## 32. Negative Update Filled Prescription

```http
PUT {{base_url}}/api/prescriptions/{{prescription_id}}
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "frequency": "ثلاث مرات يوميًا"
}
```

Expected:

```text
400
Cannot edit filled prescription
```

## 33. Negative Cancel Filled Prescription

```http
PATCH {{base_url}}/api/prescriptions/{{prescription_id}}/cancel
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
400
Cannot cancel filled prescription
```

For cancel success path, create a fresh active prescription and call cancel before fill.

---

# Part D - Ratings

## 34. Patient Create Rating

```http
POST {{base_url}}/api/ratings
Authorization: Bearer {{user_token}}
Content-Type: application/json
Accept-Language: ar
```

Body:

```json
{
  "appointment_id": {{appointment_id}},
  "doctor_id": {{doctor_id}},
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

Expected:

```text
201 Created
status = active
doctor profile rating stats updated
```

Save:
```text
rating_id = data.id
rating_uuid = data.uuid
```

SQL:

```sql
SELECT * FROM ratings WHERE id = <rating_id>;
SELECT * FROM rating_translations WHERE rating_id = <rating_id>;
SELECT rating_average, rating_count FROM doctor_profiles WHERE doctor_id = <doctor_id>;
```

## 35. Negative Duplicate Rating Same Appointment

Send create rating again for same appointment.

Expected:

```text
409
Appointment already rated
```

## 36. Negative Rating Out of Range

Use `rating: 6`.

Expected:

```text
400
rating must be between 1 and 5
```

## 37. Get Doctor Rating Stats Public

```http
GET {{base_url}}/api/ratings/doctor/{{doctor_id}}/stats
```

Expected:

```text
200 OK
average_rating updated
distribution returned
```

## 38. Patient List Own Ratings

```http
GET {{base_url}}/api/ratings
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
Only own ratings
```

## 39. Doctor List Own Ratings

```http
GET {{base_url}}/api/ratings
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
200 OK
Only ratings for this doctor
```

## 40. Admin List All Ratings

```http
GET {{base_url}}/api/ratings
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
Admin can see all ratings
```

## 41. Get Rating by ID

```http
GET {{base_url}}/api/ratings/{{rating_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
translations map returned
```

## 42. Patient Update Rating

```http
PUT {{base_url}}/api/ratings/{{rating_id}}
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

Body:

```json
{
  "rating": 4,
  "would_recommend": true,
  "translations": {
    "ar": {
      "review_title": "تجربة جيدة",
      "review_comment": "تم تحديث التعليق"
    }
  }
}
```

Expected:

```text
200 OK
doctor rating stats recalculated
```

## 43. Doctor Respond to Rating

```http
POST {{base_url}}/api/ratings/{{rating_id}}/respond
Authorization: Bearer {{doctor_token}}
Content-Type: application/json
```

Body:

```json
{
  "language_code": "ar",
  "response": "شكرًا على تقييمك، نتمنى لك دوام الصحة."
}
```

Expected:

```text
200 OK
rating_translations.response_from_doctor updated
ratings.doctor_responded_at set
```

## 44. Admin Flag Rating

```http
PATCH {{base_url}}/api/ratings/{{rating_id}}/flag
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "language_code": "ar",
  "reason": "اختبار إبلاغ إداري"
}
```

Expected:

```text
200 OK
is_flagged = 1
flagged_by_admin_id set
flagged_at set
flagged_reason saved in translation
```

## 45. Admin Hide Rating

```http
PATCH {{base_url}}/api/ratings/{{rating_id}}/status
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "hidden"
}
```

Expected:

```text
200 OK
status = hidden
doctor rating stats recalculated using active ratings only
```

## 46. Admin Reactivate Rating

```http
PATCH {{base_url}}/api/ratings/{{rating_id}}/status
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "active"
}
```

Expected:

```text
200 OK
status = active
stats recalculated
```

## 47. Patient Delete Rating

```http
DELETE {{base_url}}/api/ratings/{{rating_id}}
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
rating deleted
translations deleted by cascade
doctor stats recalculated
```

---

# Optional Cleanup

## Delete Template Item

```http
DELETE {{base_url}}/api/prescription-templates/{{template_id}}/items/{{template_item_id}}
Authorization: Bearer {{doctor_token}}
```

## Delete Template

```http
DELETE {{base_url}}/api/prescription-templates/{{template_id}}
Authorization: Bearer {{doctor_token}}
```

## Delete Medication

Only after removing template references.

```http
DELETE {{base_url}}/api/medications/{{medication_id}}
Authorization: Bearer {{admin_token}}
```
