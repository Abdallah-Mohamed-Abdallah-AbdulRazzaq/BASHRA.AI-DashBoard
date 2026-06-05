# Admin Batch 3 API Documentation
## Doctor Management + Doctor Profile Verification + Contact Details

## 1. Overview

This document covers the Admin-facing APIs for doctor management.

These routes are mounted from:

```js
router.use("/admin/doctors", adminDoctorManagementRoutes);
router.use("/admin/doctors", adminDoctorProfileManagementRoutes);
router.use("/doctor-contact-details", doctorContactDetailsRoutes);
```

## 2. Authentication

All endpoints in this batch require:

```http
Authorization: Bearer <TOKEN>
```

## 3. Roles

| Role | Description |
|---|---|
| `admin` | Can view doctors and use profile management APIs depending on middleware |
| `system_admin` | Required for sensitive doctor management updates |
| `super_admin` | Includes system-level privileges |
| `doctor` | Not allowed to use Admin routes in this batch |
| `user` | Not allowed |

---

# Part A - Admin Doctor Management

Base path:

```http
/api/admin/doctors
```

The route file applies:

```text
parseFormData
authenticateJWT
authorizeAnyAdmin
```

to all routes, then applies:

```text
authorizeSystemAdmin
```

before modification routes.

---

## A1. Get All Doctors

```http
GET /api/admin/doctors
```

### Permission

```text
Any Admin
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20 |
| `status` | string | No | `active`, `inactive`, `suspended`, `pending_verification` |
| `approval_status` | string | No | `pending`, `approved`, `rejected`, `suspended` |
| `is_verified` | boolean string | No | `true` or `false` |
| `search` | string | No | email, phone, name, license number |
| `sort_by` | string | No | `created_at`, `email`, `status`, `approval_status`, `is_verified`, `rating_average` |
| `sort_order` | string | No | `ASC` or `DESC` |

### Example

```http
GET /api/admin/doctors?page=1&limit=20&approval_status=pending
```

### Expected success

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 20,
    "totalPages": 0,
    "hasMore": false
  }
}
```

---

## A2. Get Pending Doctors

```http
GET /api/admin/doctors/pending
```

### Permission

```text
Any Admin
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `page` | number | No |
| `limit` | number | No |

### Purpose

Returns doctors pending admin approval.

---

## A3. Get Doctor Statistics

```http
GET /api/admin/doctors/statistics
```

### Permission

```text
Any Admin
```

### Purpose

Returns doctor counts and dashboard statistics.

---

## A4. Get Single Doctor Details

```http
GET /api/admin/doctors/:doctorId
```

### Permission

```text
Any Admin
```

### Path params

| Param | Type | Required |
|---|---:|---:|
| `doctorId` | number | Yes |

### Expected not found

```json
{
  "success": false,
  "message_ar": "الطبيب غير موجود",
  "message_en": "Doctor not found"
}
```

---

## A5. Update Doctor Status

```http
PATCH /api/admin/doctors/:doctorId/status
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "status": "active",
  "reason": "Admin status update test"
}
```

### Valid status values

```text
active
inactive
suspended
pending_verification
```

### Expected success

```json
{
  "success": true,
  "message_ar": "تم تحديث حالة الطبيب بنجاح",
  "message_en": "Doctor status updated successfully",
  "data": {
    "doctorId": "1",
    "oldStatus": "pending_verification",
    "newStatus": "active"
  }
}
```

---

## A6. Verify / Unverify Doctor Profile

```http
PATCH /api/admin/doctors/:doctorId/verify
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "is_verified": true,
  "reason": "Verification test"
}
```

### Notes

- `is_verified` must be a boolean.
- When verified, `doctor_profiles.verified_by` and `verification_date` are updated.
- When unverified, verification metadata can be cleared.

---

## A7. Update Comprehensive Verification Status

```http
PATCH /api/admin/doctors/:doctorId/verification-status
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "is_verified": true,
  "approval_status": "approved",
  "reason": "Verification and approval update test"
}
```

### Valid `approval_status`

```text
pending
approved
rejected
suspended
```

---

## A8. Update Doctor Approval Status

```http
PATCH /api/admin/doctors/:doctorId/approval
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "approval_status": "approved",
  "reason": "Approval status update test"
}
```

---

## A9. Approve Doctor

```http
POST /api/admin/doctors/:doctorId/approve
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "reason": "Approved after reviewing profile and documents"
}
```

### Expected impact

Usually combines:

```text
doctors.status = active
doctor_profiles.is_verified = 1
doctor_profiles.approval_status = approved
```

---

## A10. Reject Doctor

```http
POST /api/admin/doctors/:doctorId/reject
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "reason": "Missing required verification documents"
}
```

### Expected impact

Usually combines:

```text
doctors.status = inactive
doctor_profiles.approval_status = rejected
```

---

## A11. Suspend Doctor

```http
POST /api/admin/doctors/:doctorId/suspend
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "reason": "Suspended during compliance review"
}
```

### Expected impact

Usually combines:

```text
doctors.status = suspended
doctor_profiles.approval_status = suspended
```

---

## A12. Bulk Update Doctors Status

```http
POST /api/admin/doctors/bulk/status
```

### Permission

```text
System Admin and above
```

### Body

```json
{
  "doctorIds": [1, 2],
  "status": "inactive",
  "reason": "Bulk test update"
}
```

### Warning

Use only test doctor IDs. This endpoint can affect multiple doctors.

---

# Part B - Admin Doctor Profile Management

Base path:

```http
/api/admin/doctors
```

The profile management route file applies:

```text
authenticateJWT
authorizeAdmin
```

to all routes.

---

## B1. Get Doctor Complete Profile

```http
GET /api/admin/doctors/:doctorId/profile/complete
```

### Permission

```text
Admin
```

### Purpose

Returns doctor complete profile including personal, professional, and document data.

---

## B2. Get Doctor Personal Data

```http
GET /api/admin/doctors/:doctorId/profile/personal
```

### Permission

```text
Admin
```

---

## B3. Get Doctor Professional Data

```http
GET /api/admin/doctors/:doctorId/profile/professional
```

### Permission

```text
Admin
```

---

## B4. Get Doctor Verification Documents

```http
GET /api/admin/doctors/:doctorId/profile/documents
```

### Permission

```text
Admin
```

---

## B5. Get Doctor Documents Summary

```http
GET /api/admin/doctors/:doctorId/profile/documents/summary
```

### Permission

```text
Admin
```

---

## B6. Update Doctor Personal Data

```http
PUT /api/admin/doctors/:doctorId/profile/personal
```

### Permission

```text
Admin
```

### Body

```json
{
  "email": "doctor@example.com",
  "phone": "+201000000000",
  "date_of_birth": "1988-01-01",
  "gender": "male",
  "nationality": "Egyptian",
  "emergency_contact_phone": "+201111111111",
  "timezone": "Africa/Cairo",
  "language_preference": "ar",
  "translations": {
    "ar": {
      "full_name": "دكتور اختبار",
      "emergency_contact_name": "جهة اتصال",
      "emergency_contact_relationship": "brother"
    },
    "en": {
      "full_name": "Test Doctor",
      "emergency_contact_name": "Contact Person",
      "emergency_contact_relationship": "brother"
    }
  }
}
```

### Warning

This can modify doctor login/contact identity. Use test doctor only.

---

## B7. Update Doctor Professional Data

```http
PUT /api/admin/doctors/:doctorId/profile/professional
```

### Permission

```text
Admin
```

### Body

```json
{
  "license_number": "TEST-LICENSE-001",
  "years_of_experience": 10,
  "medical_school": "Test Medical School",
  "graduation_year": 2014,
  "board_certifications": ["Dermatology Board"],
  "languages_spoken": ["ar", "en"],
  "translations": {
    "ar": {
      "specialty": "جلدية",
      "sub_specialty": "أمراض جلدية",
      "biography": "سيرة اختبارية"
    },
    "en": {
      "specialty": "Dermatology",
      "sub_specialty": "Dermatology",
      "biography": "Test biography"
    }
  }
}
```

### Warning

`license_number` is unique in `doctor_profiles`.

---

## B8. Update Doctor Verification Document Status

```http
PUT /api/admin/doctors/:doctorId/profile/documents/:documentId
```

### Permission

```text
Admin
```

### Body - approve

```json
{
  "status": "approved"
}
```

### Body - reject

```json
{
  "status": "rejected",
  "rejection_reason": "Document is unclear"
}
```

### Valid status values

```text
pending
approved
rejected
```

---

## B9. Delete Doctor Profile

```http
DELETE /api/admin/doctors/:doctorId/profile
```

### Permission

```text
Admin
```

### Body

```json
{
  "reason": "Soft delete test"
}
```

### Warning

This is destructive or semi-destructive depending on controller implementation. Do not run on production or real doctor data without a backup.

---

## B10. Approve Doctor Profile

```http
POST /api/admin/doctors/:doctorId/profile/approve
```

### Permission

```text
Admin
```

### Body

```json
{
  "reason": "Profile approved after review"
}
```

---

## B11. Reject Doctor Profile

```http
POST /api/admin/doctors/:doctorId/profile/reject
```

### Permission

```text
Admin
```

### Body

```json
{
  "reason": "Profile rejected due to missing documents"
}
```

---

# Part C - Doctor Contact Details Admin Read APIs

Base path:

```http
/api/doctor-contact-details
```

Only Admin read endpoints are included in this batch.

---

## C1. Get All Doctors Contact Details

```http
GET /api/doctor-contact-details/all
```

### Permission

```text
Any Admin
```

### Optional query

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `doctor_id` | number | No | Filter by a specific doctor |

### Example

```http
GET /api/doctor-contact-details/all?doctor_id=1
```

---

## C2. Get Contact Details By Doctor ID

```http
GET /api/doctor-contact-details/doctor/:doctorId
```

### Permission

```text
Any Admin
```

---

# Permission Matrix

| Endpoint group | Admin | System Admin | Super Admin | Doctor | User |
|---|---:|---:|---:|---:|---:|
| List/view doctors | Yes | Yes | Yes | No | No |
| Update doctor account status | No unless system-level | Yes | Yes | No | No |
| Verify/unverify doctor profile | No unless system-level | Yes | Yes | No | No |
| Approve/reject/suspend doctor account | No unless system-level | Yes | Yes | No | No |
| Doctor profile read APIs | Yes | Yes | Yes | No | No |
| Doctor profile update APIs | Yes | Yes | Yes | No | No |
| Doctor document review APIs | Yes | Yes | Yes | No | No |
| Admin contact detail read APIs | Yes | Yes | Yes | No | No |

---

# Frontend Admin Dashboard Suggested Sections

1. Doctors list
2. Pending doctors
3. Doctor statistics cards
4. Doctor details drawer/page
5. Doctor profile review
6. Verification documents review
7. Approval/rejection actions
8. Doctor contact details view
9. Bulk status management
