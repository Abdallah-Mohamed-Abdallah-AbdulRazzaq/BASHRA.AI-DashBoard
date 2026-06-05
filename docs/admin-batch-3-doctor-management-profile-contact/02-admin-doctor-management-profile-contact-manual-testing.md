# Admin Batch 3 Manual Testing Guide
## Doctor Management + Doctor Profile Verification + Contact Details

## 0. Required variables

Set these values in Postman:

```text
base_url=http://localhost:3006
admin_token=<ADMIN_ACCESS_TOKEN>
system_admin_token=<SYSTEM_ADMIN_OR_SUPER_ADMIN_ACCESS_TOKEN>
user_token=<NORMAL_USER_ACCESS_TOKEN>
doctor_token=<DOCTOR_ACCESS_TOKEN>
test_doctor_id=1
test_document_id=<DOCUMENT_ID_IF_EXISTS>
```

## 1. Login as Admin/System Admin

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
accessToken -> admin_token
```

If this admin is system-level or super admin, also save it as:

```text
system_admin_token
```

---

# Part A - Doctor Management Read Tests

## 2. Get doctor statistics

```http
GET {{base_url}}/api/admin/doctors/statistics
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

SQL check:

```sql
SELECT status, COUNT(*) FROM doctors GROUP BY status;
SELECT approval_status, COUNT(*) FROM doctor_profiles GROUP BY approval_status;
```

---

## 3. Get all doctors

```http
GET {{base_url}}/api/admin/doctors?page=1&limit=20
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
data is array
pagination exists
```

---

## 4. Get doctors with filters

```http
GET {{base_url}}/api/admin/doctors?approval_status=pending&page=1&limit=10
Authorization: Bearer {{admin_token}}
```

```http
GET {{base_url}}/api/admin/doctors?is_verified=false&page=1&limit=10
Authorization: Bearer {{admin_token}}
```

```http
GET {{base_url}}/api/admin/doctors?search=katch&page=1&limit=10
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

---

## 5. Get pending doctors

```http
GET {{base_url}}/api/admin/doctors/pending?page=1&limit=10
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

---

## 6. Get doctor details

```http
GET {{base_url}}/api/admin/doctors/{{test_doctor_id}}
Authorization: Bearer {{admin_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
success = true
password_hash is not returned
translations are returned if found
```

SQL check:

```sql
SELECT d.id, d.uuid, d.email, d.status, dp.approval_status, dp.is_verified
FROM doctors d
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
WHERE d.id = 1;
```

---

# Part B - Doctor Management Mutation Tests

Important: use test doctor only.

## 7. Snapshot doctor before changes

Run SQL before mutation tests:

```sql
SELECT 
  d.id, d.email, d.status, d.is_active,
  dp.id AS profile_id,
  dp.is_verified,
  dp.verification_date,
  dp.verified_by,
  dp.approval_status,
  dp.license_number
FROM doctors d
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
WHERE d.id = 1;
```

Save values for rollback.

---

## 8. Update doctor status

```http
PATCH {{base_url}}/api/admin/doctors/{{test_doctor_id}}/status
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "inactive",
  "reason": "Testing doctor status update"
}
```

Expected:

```text
200 OK
success = true
data.oldStatus and data.newStatus returned
```

Rollback example:

```json
{
  "status": "active",
  "reason": "Rollback doctor status after test"
}
```

---

## 9. Verify doctor profile

```http
PATCH {{base_url}}/api/admin/doctors/{{test_doctor_id}}/verify
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "is_verified": true,
  "reason": "Testing doctor verification"
}
```

Expected DB:

```text
doctor_profiles.is_verified = 1
doctor_profiles.verified_by = admin id
doctor_profiles.verification_date is not null
```

Rollback:

```json
{
  "is_verified": false,
  "reason": "Rollback doctor verification"
}
```

---

## 10. Update verification status

```http
PATCH {{base_url}}/api/admin/doctors/{{test_doctor_id}}/verification-status
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "is_verified": true,
  "approval_status": "approved",
  "reason": "Testing comprehensive verification status"
}
```

Expected:

```text
200 OK
doctor profile verification and approval fields updated
```

---

## 11. Update approval status

```http
PATCH {{base_url}}/api/admin/doctors/{{test_doctor_id}}/approval
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "approval_status": "pending",
  "reason": "Testing approval status update"
}
```

Expected:

```text
200 OK
doctor_profiles.approval_status updated
```

---

## 12. Approve doctor

```http
POST {{base_url}}/api/admin/doctors/{{test_doctor_id}}/approve
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "reason": "Testing full doctor approval"
}
```

Expected:

```text
200 OK
doctor approved
```

SQL check:

```sql
SELECT d.status, dp.is_verified, dp.approval_status, dp.verified_by, dp.verification_date
FROM doctors d
JOIN doctor_profiles dp ON dp.doctor_id = d.id
WHERE d.id = 1;
```

---

## 13. Reject doctor

```http
POST {{base_url}}/api/admin/doctors/{{test_doctor_id}}/reject
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "reason": "Testing doctor rejection"
}
```

Expected:

```text
200 OK or validation result depending on current state
```

Use rollback after testing.

---

## 14. Suspend doctor

```http
POST {{base_url}}/api/admin/doctors/{{test_doctor_id}}/suspend
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "reason": "Testing doctor suspension"
}
```

Expected:

```text
200 OK
doctor status/profile approval changed to suspended
```

Rollback after testing.

---

## 15. Bulk update doctors status

```http
POST {{base_url}}/api/admin/doctors/bulk/status
Authorization: Bearer {{system_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "doctorIds": [1],
  "status": "active",
  "reason": "Testing bulk doctor status update"
}
```

Expected:

```text
200 OK
affected doctors updated
```

---

## 16. Negative test - Normal admin cannot use system-admin mutation routes

Use a normal admin token, not system admin.

```http
PATCH {{base_url}}/api/admin/doctors/{{test_doctor_id}}/status
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "status": "inactive",
  "reason": "Forbidden test"
}
```

Expected:

```text
403 Forbidden
```

---

# Part C - Doctor Profile Read Tests

## 17. Get complete doctor profile

```http
GET {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/complete
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

---

## 18. Get doctor personal data

```http
GET {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/personal
Authorization: Bearer {{admin_token}}
```

---

## 19. Get doctor professional data

```http
GET {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/professional
Authorization: Bearer {{admin_token}}
```

---

## 20. Get doctor documents

```http
GET {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/documents
Authorization: Bearer {{admin_token}}
```

---

## 21. Get doctor documents summary

```http
GET {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/documents/summary
Authorization: Bearer {{admin_token}}
```

---

# Part D - Doctor Profile Update Tests

Use only a test doctor. Snapshot before update.

## 22. Update personal data

```http
PUT {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/personal
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
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

Expected:

```text
200 OK
doctor / doctor_profiles / doctor_profile_translations updated
```

---

## 23. Update professional data

```http
PUT {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/professional
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
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

Note: avoid changing `license_number` unless using a safe unique value.

---

## 24. Update verification document status

Requires an existing `doctor_verification_documents.id`.

```http
PUT {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/documents/{{test_document_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Approve:

```json
{
  "status": "approved"
}
```

Reject:

```json
{
  "status": "rejected",
  "rejection_reason": "Document is unclear"
}
```

SQL check:

```sql
SELECT id, doctor_id, document_type, status, rejection_reason, verified_at, verified_by
FROM doctor_verification_documents
WHERE id = <document_id>;
```

---

## 25. Approve doctor profile

```http
POST {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/approve
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "reason": "Testing profile approval"
}
```

---

## 26. Reject doctor profile

```http
POST {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile/reject
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "reason": "Testing profile rejection"
}
```

---

## 27. Delete doctor profile - destructive warning

Do not run unless using a disposable test doctor.

```http
DELETE {{base_url}}/api/admin/doctors/{{test_doctor_id}}/profile
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "reason": "Testing soft delete doctor profile"
}
```

Expected:

```text
200 OK or controller-specific success
```

---

# Part E - Doctor Contact Details Admin Tests

## 28. Get all doctor contact details

```http
GET {{base_url}}/api/doctor-contact-details/all
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
success = true
```

---

## 29. Get all doctor contact details filtered by doctor_id

```http
GET {{base_url}}/api/doctor-contact-details/all?doctor_id={{test_doctor_id}}
Authorization: Bearer {{admin_token}}
```

---

## 30. Get contact details by doctor ID

```http
GET {{base_url}}/api/doctor-contact-details/doctor/{{test_doctor_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK if contact details exist
404 if no contact details exist
```

---

## 31. Negative tests

### Normal user cannot list doctors

```http
GET {{base_url}}/api/admin/doctors
Authorization: Bearer {{user_token}}
```

Expected:

```text
403 Forbidden
```

### Doctor cannot access admin doctor management

```http
GET {{base_url}}/api/admin/doctors
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
403 Forbidden
```

### Doctor cannot access admin contact-details list

```http
GET {{base_url}}/api/doctor-contact-details/all
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
403 Forbidden
```

---

# Final verification SQL

Run:

```sql
SELECT 
  d.id, d.email, d.status, d.is_active,
  dp.id AS profile_id,
  dp.license_number,
  dp.is_verified,
  dp.approval_status,
  dp.verified_by,
  dp.verification_date,
  dp.updated_at
FROM doctors d
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
WHERE d.id = 1;

SELECT id, admin_id, action, target_type, target_id, description, severity, created_at
FROM admin_logs
WHERE target_id = 1 OR target_type IN ('doctor', 'doctor_profile', 'doctors')
ORDER BY id DESC
LIMIT 50;
```
