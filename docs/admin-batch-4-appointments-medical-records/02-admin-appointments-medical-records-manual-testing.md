# Admin Batch 4 Manual Testing Guide
## Admin Appointments + Medical Records

## 0. Required variables

Set these values in Postman:

```text
base_url=http://localhost:3006
admin_token=<ADMIN_ACCESS_TOKEN>
doctor_token=<DOCTOR_ACCESS_TOKEN_FOR_NEGATIVE_TEST>
user_token=<USER_ACCESS_TOKEN_FOR_NEGATIVE_TEST>

test_patient_id=1
test_doctor_id=1
test_schedule_id=<ACTIVE_DOCTOR_SCHEDULE_ID>
test_appointment_id=<APPOINTMENT_ID_OR_UUID>
test_medical_record_id=<MEDICAL_RECORD_ID_OR_UUID>
```

## 1. Login as Admin

```http
POST {{base_url}}/api/auth-admin/login
```

Save:

```text
accessToken -> admin_token
```

---

# Part A - Appointment Read Tests

## 2. Get appointment statistics

```http
GET {{base_url}}/api/admin/appointments/statistics
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
data.total exists
```

With date filter:

```http
GET {{base_url}}/api/admin/appointments/statistics?from_date=2026-06-01&to_date=2026-06-30
```

With doctor filter:

```http
GET {{base_url}}/api/admin/appointments/statistics?doctor_id={{test_doctor_id}}
```

SQL check:

```sql
SELECT status, COUNT(*) FROM appointments GROUP BY status;
```

---

## 3. Get all appointments

```http
GET {{base_url}}/api/admin/appointments?page=1&limit=20
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data is array
page/pages/count/total exist
```

Filter examples:

```http
GET {{base_url}}/api/admin/appointments?status=pending&page=1&limit=10
GET {{base_url}}/api/admin/appointments?doctor_id={{test_doctor_id}}&page=1&limit=10
GET {{base_url}}/api/admin/appointments?patient_id={{test_patient_id}}&page=1&limit=10
GET {{base_url}}/api/admin/appointments?payment_status=pending&page=1&limit=10
GET {{base_url}}/api/admin/appointments?appointment_type=consultation&page=1&limit=10
```

---

## 4. Get single appointment

```http
GET {{base_url}}/api/admin/appointments/{{test_appointment_id}}
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data.translations exists
```

Negative:

```http
GET {{base_url}}/api/admin/appointments/999999999
```

Expected:

```text
404 Not Found
```

---

# Part B - Appointment Create/Update/Cancel/Delete Tests

## 5. Find active schedule before create

Run SQL:

```sql
SELECT 
  ds.id AS schedule_id,
  ds.doctor_id,
  ds.clinic_id,
  ds.day_of_week,
  ds.start_time,
  ds.end_time,
  ds.session_duration,
  ds.session_price,
  ds.currency_code,
  ds.is_active,
  d.status AS doctor_status,
  dp.approval_status
FROM doctor_schedules ds
JOIN doctors d ON d.id = ds.doctor_id
JOIN doctor_profiles dp ON dp.doctor_id = d.id
WHERE ds.is_active = 1
  AND d.status = 'active'
  AND dp.approval_status = 'approved'
ORDER BY ds.id DESC
LIMIT 10;
```

Pick a schedule and choose a `scheduled_date` matching `day_of_week`, and `actual_start_time` within `start_time/end_time`.

---

## 6. Create appointment

```http
POST {{base_url}}/api/admin/appointments
Authorization: Bearer {{admin_token}}
Content-Type: application/json
Accept-Language: ar
```

Body:

```json
{
  "patient_id": 1,
  "schedule_id": 1,
  "scheduled_date": "2026-06-10",
  "actual_start_time": "10:00:00",
  "appointment_type": "consultation",
  "urgency_level": "medium",
  "payment_status": "pending",
  "language_code": "ar",
  "chief_complaint": "حكة واحمرار",
  "symptoms_description": "أعراض جلدية منذ يومين",
  "notes": "Created by admin API test"
}
```

Expected:

```text
201 Created
success = true
data.id and data.uuid exist
status = pending
created_by_admin_id is set
```

Save:

```text
data.id -> test_appointment_id
```

SQL check:

```sql
SELECT * FROM appointments WHERE id = <new_id>;
SELECT * FROM appointment_translations WHERE appointment_id = <new_id>;
```

---

## 7. Create appointment - conflict test

Repeat the exact same create body.

Expected:

```text
409 Conflict
success = false
message indicates slot already booked
```

---

## 8. Update appointment

```http
PUT {{base_url}}/api/admin/appointments/{{test_appointment_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "confirmed",
  "payment_status": "paid",
  "urgency_level": "medium"
}
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT id, uuid, status, payment_status, urgency_level
FROM appointments
WHERE id = <test_appointment_id>;
```

---

## 9. Update appointment - no body negative test

```http
PUT {{base_url}}/api/admin/appointments/{{test_appointment_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{}
```

Expected:

```text
400 Bad Request
message = No data to update / لا توجد بيانات للتحديث
```

---

## 10. Cancel appointment

```http
PATCH {{base_url}}/api/admin/appointments/{{test_appointment_id}}/cancel
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "cancellation_reason": {
    "ar": "تم الإلغاء بواسطة الإدارة أثناء اختبار API",
    "en": "Cancelled by admin during API testing"
  }
}
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT id, status, cancelled_by_admin_id, cancelled_at
FROM appointments
WHERE id = <test_appointment_id>;

SELECT appointment_id, language_code, cancellation_reason
FROM appointment_translations
WHERE appointment_id = <test_appointment_id>;
```

---

## 11. Cancel appointment again negative test

Repeat cancel request.

Expected:

```text
400 Bad Request
message indicates appointment already cancelled
```

---

## 12. Delete appointment - destructive

Use only disposable test appointment.

```http
DELETE {{base_url}}/api/admin/appointments/{{test_appointment_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT * FROM appointments WHERE id = <test_appointment_id>;
```

Expected no rows.

---

# Part C - Medical Records Read Tests

## 13. Get medical records statistics

```http
GET {{base_url}}/api/admin/medical-records/statistics
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
data.total exists
```

With filters:

```http
GET {{base_url}}/api/admin/medical-records/statistics?from_date=2026-06-01&to_date=2026-06-30
GET {{base_url}}/api/admin/medical-records/statistics?doctor_id={{test_doctor_id}}
```

---

## 14. Get all medical records

```http
GET {{base_url}}/api/admin/medical-records?page=1&limit=20
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data is array
```

Filter examples:

```http
GET {{base_url}}/api/admin/medical-records?patient_id={{test_patient_id}}&page=1&limit=10
GET {{base_url}}/api/admin/medical-records?doctor_id={{test_doctor_id}}&page=1&limit=10
GET {{base_url}}/api/admin/medical-records?record_status=final&page=1&limit=10
GET {{base_url}}/api/admin/medical-records?from_date=2026-06-01&to_date=2026-06-30&page=1&limit=10
```

---

## 15. Get patient medical history

```http
GET {{base_url}}/api/admin/medical-records/patient/{{test_patient_id}}/history
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
patient exists
records_count exists
data is array
```

Negative:

```http
GET {{base_url}}/api/admin/medical-records/patient/999999999/history
```

Expected:

```text
404 Not Found
patient not found
```

---

## 16. Get single medical record

```http
GET {{base_url}}/api/admin/medical-records/{{test_medical_record_id}}
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data.translations exists
```

Negative:

```http
GET {{base_url}}/api/admin/medical-records/999999999
```

Expected:

```text
404 Not Found
```

---

## 17. Delete medical record - destructive

Only run this on a disposable test record.

```http
DELETE {{base_url}}/api/admin/medical-records/{{test_medical_record_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT * FROM medical_records WHERE id = <test_medical_record_id>;
```

Expected no rows.

---

# Part D - Security Negative Tests

## 18. Normal user cannot access admin appointments

```http
GET {{base_url}}/api/admin/appointments
Authorization: Bearer {{user_token}}
```

Expected:

```text
403 Forbidden
```

## 19. Doctor cannot access admin appointments

```http
GET {{base_url}}/api/admin/appointments
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
403 Forbidden
```

## 20. Normal user cannot access admin medical records

```http
GET {{base_url}}/api/admin/medical-records
Authorization: Bearer {{user_token}}
```

Expected:

```text
403 Forbidden
```

## 21. Doctor cannot access admin medical records

```http
GET {{base_url}}/api/admin/medical-records
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
403 Forbidden
```

---

# Final SQL summary

```sql
SELECT status, COUNT(*) AS count FROM appointments GROUP BY status;
SELECT record_status, COUNT(*) AS count FROM medical_records GROUP BY record_status;

SELECT id, uuid, patient_id, doctor_id, status, payment_status, scheduled_date, actual_start_time, created_by_admin_id, cancelled_by_admin_id, cancelled_at
FROM appointments
ORDER BY id DESC
LIMIT 20;

SELECT id, uuid, patient_id, doctor_id, appointment_id, visit_date, record_status
FROM medical_records
ORDER BY id DESC
LIMIT 20;
```
