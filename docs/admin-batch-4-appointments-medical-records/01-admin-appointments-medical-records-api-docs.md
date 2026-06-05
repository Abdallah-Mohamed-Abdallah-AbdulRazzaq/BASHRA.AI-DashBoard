# Admin Batch 4 API Documentation
## Admin Appointments + Medical Records

## 1. Overview

This document covers the Admin-facing appointment and medical record APIs.

Mounted base paths:

```http
/api/admin/appointments
/api/admin/medical-records
```

## 2. Authentication

All endpoints require:

```http
Authorization: Bearer <ADMIN_TOKEN>
```

## 3. Middleware

### Appointments

The route applies:

```text
authenticateJWT
authorizeAdmin
checkAccountActive
parseFormData
```

### Medical Records

The route applies:

```text
authenticateJWT
authorizeAdmin
parseFormData
```

---

# Part A - Admin Appointments

Base path:

```http
/api/admin/appointments
```

---

## A1. Get Appointment Statistics

```http
GET /api/admin/appointments/statistics
```

### Permission

```text
Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `from_date` | date | No | `YYYY-MM-DD` |
| `to_date` | date | No | `YYYY-MM-DD` |
| `doctor_id` | number | No | Filter by doctor |

### Purpose

Returns aggregate appointment statistics:

```text
total
pending
confirmed
in_progress
completed
cancelled
no_show
rescheduled
total_revenue
pending_revenue
```

### Example

```http
GET /api/admin/appointments/statistics?from_date=2026-06-01&to_date=2026-06-30
```

### Expected success

```json
{
  "success": true,
  "data": {
    "total": 0,
    "pending": 0,
    "confirmed": 0,
    "in_progress": 0,
    "completed": 0,
    "cancelled": 0,
    "no_show": 0,
    "rescheduled": 0,
    "total_revenue": 0,
    "pending_revenue": 0
  }
}
```

---

## A2. Get All Appointments

```http
GET /api/admin/appointments
```

### Permission

```text
Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `status` | string | No | `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show`, `rescheduled` |
| `doctor_id` | number | No | Filter by doctor |
| `patient_id` | number | No | Filter by patient |
| `appointment_type` | string | No | `consultation`, `follow_up`, `urgent`, `routine` |
| `urgency_level` | string | No | `low`, `medium`, `high`, `emergency` |
| `payment_status` | string | No | `pending`, `paid`, `refunded`, `failed` |
| `from_date` | date | No | Scheduled date >= value |
| `to_date` | date | No | Scheduled date <= value |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20 |

### Expected success shape

```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": []
}
```

### Notes

The response joins patient, doctor, and clinic data where available.

---

## A3. Get Single Appointment

```http
GET /api/admin/appointments/:id
```

### Permission

```text
Admin
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `id` | number or UUID | Yes |

### Notes

The controller supports both numeric ID and UUID. It returns appointment details plus translations.

### Expected not found

```json
{
  "success": false,
  "message": "الموعد غير موجود"
}
```

---

## A4. Create Appointment

```http
POST /api/admin/appointments
```

### Permission

```text
Admin
```

### Required body

```json
{
  "patient_id": 1,
  "schedule_id": 1,
  "scheduled_date": "2026-06-10",
  "actual_start_time": "10:00:00"
}
```

### Optional body

```json
{
  "appointment_type": "consultation",
  "urgency_level": "medium",
  "payment_status": "pending",
  "language_code": "ar",
  "chief_complaint": "حكة واحمرار",
  "symptoms_description": "أعراض جلدية منذ يومين",
  "notes": "Created by admin"
}
```

### Important implementation notes

The controller automatically fetches these from `doctor_schedules` using `schedule_id`:

```text
doctor_id
clinic_id
duration_minutes
consultation_fee
currency_code
```

### Validation behavior

The controller validates:

1. `patient_id`, `schedule_id`, `scheduled_date`, `actual_start_time` are required.
2. Patient exists and is active in `users`.
3. Schedule exists.
4. Schedule is active.
5. Doctor linked to schedule exists, has `status='active'`, and profile `approval_status='approved'`.
6. Scheduled date day-of-week matches the schedule's `day_of_week`.
7. Start time is inside the schedule range.
8. There is no appointment conflict for the doctor/date/time unless old appointment is cancelled/no_show.

### Possible errors

| Case | HTTP |
|---|---:|
| Missing required fields | 400 |
| Patient not found | 404 |
| Schedule not found | 404 |
| Schedule inactive | 400 |
| Doctor not available | 404 |
| Wrong day of week | 400 |
| Time outside schedule | 400 |
| Slot already booked | 409 |

### Expected success

```json
{
  "success": true,
  "message": "تم إنشاء الموعد بنجاح",
  "data": {
    "id": 1,
    "uuid": "...",
    "patient_id": 1,
    "doctor_id": 1,
    "schedule_id": 1,
    "status": "pending"
  }
}
```

---

## A5. Update Appointment

```http
PUT /api/admin/appointments/:id
```

### Permission

```text
Admin
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `id` | number or UUID | Yes |

### Body

All fields are optional, but at least one must be provided:

```json
{
  "scheduled_date": "2026-06-10",
  "actual_start_time": "11:00:00",
  "duration_minutes": 30,
  "appointment_type": "follow_up",
  "urgency_level": "medium",
  "consultation_fee": 500,
  "currency_code": "EGP",
  "payment_status": "paid",
  "status": "confirmed"
}
```

### Expected no-data error

```json
{
  "success": false,
  "message": "لا توجد بيانات للتحديث"
}
```

### Important note

The update endpoint directly updates provided fields. Unlike create, it does not re-run the full schedule conflict validation in the currently reviewed controller code.

---

## A6. Cancel Appointment

```http
PATCH /api/admin/appointments/:id/cancel
```

### Permission

```text
Admin
```

### Body - string reason

```json
{
  "cancellation_reason": "Cancelled by admin for testing"
}
```

### Body - multilingual reason

```json
{
  "cancellation_reason": {
    "ar": "تم الإلغاء بواسطة الإدارة",
    "en": "Cancelled by admin"
  }
}
```

### Expected impact

```text
appointments.status = cancelled
appointments.cancelled_by_admin_id = current admin id
appointments.cancelled_at = NOW()
appointment_translations.cancellation_reason updated/inserted
```

### Already cancelled error

```json
{
  "success": false,
  "message": "الموعد ملغى بالفعل"
}
```

---

## A7. Delete Appointment

```http
DELETE /api/admin/appointments/:id
```

### Permission

```text
Admin
```

### Important warning

The controller executes:

```sql
DELETE FROM appointments WHERE id = ?
```

This is an actual delete. Translations are expected to be deleted by cascade if the database constraints are configured.

### Use only on disposable test appointment.

---

# Part B - Admin Medical Records

Base path:

```http
/api/admin/medical-records
```

---

## B1. Get Medical Records Statistics

```http
GET /api/admin/medical-records/statistics
```

### Permission

```text
Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `from_date` | date | No | `YYYY-MM-DD` |
| `to_date` | date | No | `YYYY-MM-DD` |
| `doctor_id` | number | No | Filter by doctor |

### Returned metrics

```text
total
draft
final
amended
follow_ups_recommended
unique_patients
unique_doctors
```

---

## B2. Get Patient Complete Medical History

```http
GET /api/admin/medical-records/patient/:patient_id/history
```

### Permission

```text
Admin
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `patient_id` | number | Yes |

### Expected success shape

```json
{
  "success": true,
  "patient": {},
  "records_count": 0,
  "data": []
}
```

### Expected not found

```json
{
  "success": false,
  "message": "المريض غير موجود"
}
```

---

## B3. Get All Medical Records

```http
GET /api/admin/medical-records
```

### Permission

```text
Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `patient_id` | number | No | Filter by patient |
| `doctor_id` | number | No | Filter by doctor |
| `record_status` | string | No | `draft`, `final`, `amended` |
| `from_date` | date | No | `visit_date >= value` |
| `to_date` | date | No | `visit_date <= value` |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20 |

### Expected success shape

```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": []
}
```

---

## B4. Get Single Medical Record

```http
GET /api/admin/medical-records/:id
```

### Permission

```text
Admin
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `id` | number or UUID | Yes |

### Notes

The controller supports both numeric ID and UUID.

### Returned data includes

```text
medical_records fields
patient info
doctor info
translations object
```

---

## B5. Delete Medical Record

```http
DELETE /api/admin/medical-records/:id
```

### Permission

```text
Admin
```

### Important warning

This endpoint permanently deletes from `medical_records`:

```sql
DELETE FROM medical_records WHERE id = ?
```

Translations are expected to be deleted automatically by cascade.

Use only on disposable test records.

---

# Permission Matrix

| Endpoint | Admin | Doctor | User |
|---|---:|---:|---:|
| `GET /api/admin/appointments/statistics` | Yes | No | No |
| `GET /api/admin/appointments` | Yes | No | No |
| `GET /api/admin/appointments/:id` | Yes | No | No |
| `POST /api/admin/appointments` | Yes | No | No |
| `PUT /api/admin/appointments/:id` | Yes | No | No |
| `PATCH /api/admin/appointments/:id/cancel` | Yes | No | No |
| `DELETE /api/admin/appointments/:id` | Yes | No | No |
| `GET /api/admin/medical-records/statistics` | Yes | No | No |
| `GET /api/admin/medical-records/patient/:patient_id/history` | Yes | No | No |
| `GET /api/admin/medical-records` | Yes | No | No |
| `GET /api/admin/medical-records/:id` | Yes | No | No |
| `DELETE /api/admin/medical-records/:id` | Yes | No | No |
