# Admin Batch 2 - User Management + Patient Profiles

This batch documents and tests the backend APIs related to:

1. Admin User Management
2. Admin/Doctor/Assistant access to Patient Profiles

The batch is based on the actual backend route files:

- `routes/adminUserManagementRoutes.js`
- `routes/patientProfileRoutes.js`
- `controllers/AdminUserManagementController.js`
- `controllers/patientProfileController.js`
- `middleware/authMiddleware.js`
- `routes/index.js`

## Base paths

```http
/api/admin/users
/api/patient-profiles
```

## Included files

| File | Purpose |
|---|---|
| `01-admin-user-management-patient-profiles-api-docs.md` | API documentation |
| `02-admin-user-management-patient-profiles-manual-testing.md` | Manual API testing steps |
| `03-admin-user-management-patient-profiles-sql-verification.sql` | SQL verification queries |
| `04-admin-user-management-patient-profiles-postman-collection.json` | Postman collection |
| `05-admin-user-management-patient-profiles-test-matrix.csv` | Test matrix |

## Scope

This batch includes only APIs where Admin is directly involved.

### Included

```http
GET /api/admin/users
GET /api/admin/users/stats
GET /api/admin/users/search
GET /api/admin/users/status/:status
GET /api/admin/users/:id
GET /api/admin/users/:id/medical
GET /api/admin/users/:id/logs
PUT /api/admin/users/:id/status

GET /api/patient-profiles/all
GET /api/patient-profiles/patient/:userId
```

### Not included

The user-only patient profile CRUD is not part of this Admin batch:

```http
POST /api/patient-profiles
GET /api/patient-profiles
GET /api/patient-profiles/complete
PUT /api/patient-profiles
DELETE /api/patient-profiles
```

Those should be documented in a User/Patient batch.

## Permission summary

| Area | Permission |
|---|---|
| Read users | Any admin |
| Search users | Any admin |
| View user details | Any admin |
| View user medical profile | Any admin |
| View user logs | Any admin |
| Update user status | Super admin only |
| View all patient profiles | Any admin |
| View patient profile by user ID | Admin, Doctor, Assistant |
