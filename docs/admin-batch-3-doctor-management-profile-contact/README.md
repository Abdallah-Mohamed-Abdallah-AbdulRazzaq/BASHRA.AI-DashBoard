# Admin Batch 3 - Doctor Management + Doctor Profile Verification + Contact Details

This batch documents and tests the Admin APIs related to:

1. Doctor account management
2. Doctor verification and approval workflow
3. Doctor profile management
4. Doctor verification document review
5. Doctor contact details visibility for Admin

The batch is based on the actual backend route files:

- `routes/adminDoctorManagementRoutes.js`
- `routes/adminDoctorProfileManagementRoutes.js`
- `routes/doctorContactDetailsRoutes.js`
- `controllers/AdminDoctorManagementController.js`
- `controllers/AdminDoctorProfileManagementController.js`
- `controllers/doctorContactDetailsController.js`
- `middleware/authMiddleware.js`
- `routes/index.js`

## Base paths

```http
/api/admin/doctors
/api/doctor-contact-details
```

## Included files

| File | Purpose |
|---|---|
| `01-admin-doctor-management-profile-contact-api-docs.md` | API documentation |
| `02-admin-doctor-management-profile-contact-manual-testing.md` | Manual testing guide |
| `03-admin-doctor-management-profile-contact-sql-verification.sql` | SQL verification queries |
| `04-admin-doctor-management-profile-contact-postman-collection.json` | Postman collection |
| `05-admin-doctor-management-profile-contact-test-matrix.csv` | Test matrix |

## Scope

### Included

```http
GET    /api/admin/doctors
GET    /api/admin/doctors/pending
GET    /api/admin/doctors/statistics
GET    /api/admin/doctors/:doctorId

PATCH  /api/admin/doctors/:doctorId/status
PATCH  /api/admin/doctors/:doctorId/verify
PATCH  /api/admin/doctors/:doctorId/verification-status
PATCH  /api/admin/doctors/:doctorId/approval
POST   /api/admin/doctors/:doctorId/approve
POST   /api/admin/doctors/:doctorId/reject
POST   /api/admin/doctors/:doctorId/suspend
POST   /api/admin/doctors/bulk/status

GET    /api/admin/doctors/:doctorId/profile/complete
GET    /api/admin/doctors/:doctorId/profile/personal
GET    /api/admin/doctors/:doctorId/profile/professional
GET    /api/admin/doctors/:doctorId/profile/documents
GET    /api/admin/doctors/:doctorId/profile/documents/summary
PUT    /api/admin/doctors/:doctorId/profile/personal
PUT    /api/admin/doctors/:doctorId/profile/professional
PUT    /api/admin/doctors/:doctorId/profile/documents/:documentId
DELETE /api/admin/doctors/:doctorId/profile
POST   /api/admin/doctors/:doctorId/profile/approve
POST   /api/admin/doctors/:doctorId/profile/reject

GET    /api/doctor-contact-details/all
GET    /api/doctor-contact-details/doctor/:doctorId
```

### Not included

Doctor self-service routes are not part of this Admin batch:

```http
GET    /api/doctor-contact-details/my-details
POST   /api/doctor-contact-details
PUT    /api/doctor-contact-details
DELETE /api/doctor-contact-details
```

Those should be documented in a Doctor-facing batch.

## Permission summary

| Area | Permission |
|---|---|
| List doctors / view doctor details | Any Admin |
| Update doctor account/verification/approval status | System Admin and above |
| Profile management endpoints | Admin |
| Doctor contact details admin read endpoints | Any Admin |

## Important testing warning

Several endpoints modify doctor status, approval, verification, or profile data.

Use a test doctor account only. Before modification tests, run the SQL snapshot queries in the SQL file and save the original values for rollback.
