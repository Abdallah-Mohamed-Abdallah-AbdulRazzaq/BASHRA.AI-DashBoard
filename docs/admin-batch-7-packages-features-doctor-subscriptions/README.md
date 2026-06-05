# Admin Batch 7 - Packages / Features / Doctor Subscriptions

This batch documents and tests the backend logic for subscription package management.

It covers:

1. Admin Features Management
2. Admin Packages Management
3. Admin Package-Feature Linking
4. Public Packages / Features APIs
5. Doctor Subscription Flow
6. Admin Doctor Subscription Management

## Source files reviewed

- `routes/index.js`
- `routes/featuresRoutes.js`
- `routes/packagesRoutes.js`
- `routes/packageFeaturesRoutes.js`
- `routes/publicPackagesRoutes.js`
- `routes/publicFeaturesRoutes.js`
- `routes/doctorSubscriptionsRoutes.js`
- `controllers/featuresController.js`
- `controllers/packagesController.js`
- `controllers/packageFeaturesController.js`
- `controllers/publicPackagesController.js`
- `controllers/doctorSubscriptionsController.js`
- `middleware/formDataMiddleware.js`
- `middleware/authMiddleware.js`
- `SQL-Database-(Bashraai).sql`

## Base paths

```http
/api/features
/api/packages
/api/package-features
/api/public/packages
/api/public/features
/api/doctor-subscriptions
```

## Included files

| File | Purpose |
|---|---|
| `01-packages-features-subscriptions-api-docs.md` | Full API documentation |
| `02-packages-features-subscriptions-manual-testing.md` | Manual testing steps |
| `03-packages-features-subscriptions-sql-verification.sql` | SQL verification queries |
| `04-packages-features-subscriptions-postman-collection.json` | Postman collection |
| `05-packages-features-subscriptions-test-matrix.csv` | Test matrix |

## Permission map

| Area | Base path | Permission |
|---|---|---|
| Features Management | `/api/features` | Admin only |
| Packages Management | `/api/packages` | Admin only |
| Package Features | `/api/package-features` | Admin only |
| Public Packages | `/api/public/packages` | Public |
| Public Features | `/api/public/features` | Public |
| Doctor Subscription - Doctor side | `/api/doctor-subscriptions/subscribe`, `/my-subscriptions`, `/current`, `/:id/cancel` | Doctor only |
| Doctor Subscription - Admin side | `/api/doctor-subscriptions/admin/...` | Admin only |

## Recommended testing order

1. Create a feature.
2. Create a package.
3. Link feature to package.
4. Verify public package/feature visibility.
5. Doctor sends subscription request.
6. Admin approves subscription.
7. Doctor checks current subscription.
8. Admin updates/expires/deletes subscription if needed.
9. Verify DB after each stage.

## Destructive operation warnings

The following endpoints delete data:

```http
DELETE /api/features/:id
DELETE /api/packages/:id
DELETE /api/package-features/:id
DELETE /api/doctor-subscriptions/admin/:id
```

Use disposable records only when testing deletion.
