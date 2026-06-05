# Batch 8 - Medications / Prescriptions / Ratings

This batch documents and tests the backend logic for:

1. Medications Directory
2. Prescription Templates
3. Prescriptions
4. Ratings and Reviews

## Source files reviewed

- `routes/index.js`
- `routes/medicationsRoutes.js`
- `routes/prescriptionTemplatesRoutes.js`
- `routes/prescriptionsRoutes.js`
- `routes/ratingsRoutes.js`
- `controllers/medicationsController.js`
- `controllers/prescriptionTemplatesController.js`
- `controllers/prescriptionsController.js`
- `controllers/ratingsController.js`
- `middleware/formDataMiddleware.js`
- `middleware/authMiddleware.js`
- `SQL-Database-(Bashraai).sql`

## Base paths

```http
/api/medications
/api/prescription-templates
/api/prescriptions
/api/ratings
```

## Included files

| File | Purpose |
|---|---|
| `01-medications-prescriptions-ratings-api-docs.md` | Full API documentation |
| `02-medications-prescriptions-ratings-manual-testing.md` | Manual testing steps |
| `03-medications-prescriptions-ratings-sql-verification.sql` | SQL verification queries |
| `04-medications-prescriptions-ratings-postman-collection.json` | Postman collection |
| `05-medications-prescriptions-ratings-test-matrix.csv` | Test matrix |

## Permission map

| Area | Base path | Permission |
|---|---|---|
| Medications read/list/create | `/api/medications` | Admin or Doctor |
| Medications update/toggle/delete | `/api/medications/:id` | Admin only |
| Prescription Templates | `/api/prescription-templates` | Doctor only |
| Prescriptions list/view | `/api/prescriptions` | Patient, Doctor, Admin, role-filtered |
| Prescriptions create/update/cancel/translation | `/api/prescriptions` | Doctor only |
| Prescriptions fill | `/api/prescriptions/:id/fill` | Authenticated |
| Ratings list/view | `/api/ratings` | Patient, Doctor, Admin, role-filtered |
| Rating stats | `/api/ratings/doctor/:doctor_id/stats` | Public |
| Ratings create/update/delete | `/api/ratings` | Patient only, own rating |
| Doctor rating response | `/api/ratings/:id/respond` | Doctor only, own ratings |
| Admin rating moderation | `/api/ratings/:id/flag`, `/api/ratings/:id/status` | Admin only |

## Current source-review notes

The current `PrescriptionsController` references `lang` inside `createPrescription`, `cancelPrescription`, and `fillPrescription` without defining it before use in some paths. This can produce a `ReferenceError` during testing. The test guide includes this as a watch point rather than hiding it.

## Recommended testing order

1. Admin or Doctor creates a medication.
2. Admin verifies medication listing/search/filtering.
3. Doctor creates a prescription template using the medication.
4. Doctor creates prescription for a valid patient medical record.
5. Patient/Doctor/Admin verify prescription visibility by role.
6. Doctor updates, translates, cancels prescription.
7. Authenticated user tests fill logic.
8. Patient creates rating for a completed appointment.
9. Doctor responds to rating.
10. Admin flags and updates rating status.
11. SQL verification after every step.

## Destructive operation warnings

The following endpoints delete data:

```http
DELETE /api/medications/:id
DELETE /api/prescription-templates/:id
DELETE /api/prescription-templates/:id/items/:itemId
DELETE /api/ratings/:id
```

Use disposable test records.
