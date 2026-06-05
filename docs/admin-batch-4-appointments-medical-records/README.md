# Admin Batch 4 - Appointments + Medical Records

This batch documents and tests the Admin APIs related to:

1. Admin appointments management
2. Admin medical records visibility and deletion

The batch is based on the actual backend route/controller files:

- `routes/adminAppointmentsRoutes.js`
- `routes/adminMedicalRecordsRoutes.js`
- `controllers/adminAppointmentsController.js`
- `controllers/adminMedicalRecordsController.js`
- `middleware/authMiddleware.js`
- `middleware/checkAccountActive.js`
- `middleware/formDataMiddleware.js`
- `routes/index.js`

## Base paths

```http
/api/admin/appointments
/api/admin/medical-records
```

## Included files

| File | Purpose |
|---|---|
| `01-admin-appointments-medical-records-api-docs.md` | API documentation |
| `02-admin-appointments-medical-records-manual-testing.md` | Manual API testing guide |
| `03-admin-appointments-medical-records-sql-verification.sql` | SQL verification queries |
| `04-admin-appointments-medical-records-postman-collection.json` | Postman collection |
| `05-admin-appointments-medical-records-test-matrix.csv` | Test matrix |

## Scope

### Admin Appointments

```http
GET    /api/admin/appointments/statistics
GET    /api/admin/appointments
GET    /api/admin/appointments/:id
POST   /api/admin/appointments
PUT    /api/admin/appointments/:id
PATCH  /api/admin/appointments/:id/cancel
DELETE /api/admin/appointments/:id
```

### Admin Medical Records

```http
GET    /api/admin/medical-records/statistics
GET    /api/admin/medical-records/patient/:patient_id/history
GET    /api/admin/medical-records
GET    /api/admin/medical-records/:id
DELETE /api/admin/medical-records/:id
```

## Permission summary

| Area | Permission |
|---|---|
| Appointments admin APIs | Admin |
| Medical records admin APIs | Admin |

## Important destructive-operation warning

The following endpoints perform actual delete operations in the controllers:

```http
DELETE /api/admin/appointments/:id
DELETE /api/admin/medical-records/:id
```

Do not run them against real production data. Use disposable test appointments/records only.

## Important appointment creation requirements

Creating an appointment requires a valid active schedule from `doctor_schedules`. The controller automatically derives the doctor, clinic, duration, fee, and currency from `schedule_id`.

Required fields:

```json
{
  "patient_id": 1,
  "schedule_id": 1,
  "scheduled_date": "YYYY-MM-DD",
  "actual_start_time": "HH:MM:SS"
}
```
