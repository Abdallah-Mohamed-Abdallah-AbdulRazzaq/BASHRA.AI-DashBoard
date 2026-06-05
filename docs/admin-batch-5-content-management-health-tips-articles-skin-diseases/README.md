# Admin Batch 5 - Content Management
## Health Tips / Medical Articles / Skin Diseases

This batch documents and tests the content-management APIs related to:

1. Daily Health Tips
2. Medical Articles
3. Skin Diseases Information
4. Advanced Health Content APIs: statistics, search, recent, by-admin, bulk status, export, validation

The batch is based on the actual backend route/controller/service files:

- `routes/index.js`
- `routes/healthTipsRoutes.js`
- `routes/advancedHealthRoutes.js`
- `controllers/dailyTipsController.js`
- `controllers/medicalArticlesController.js`
- `controllers/skinDiseasesController.js`
- `services/HealthTipsService.js`
- `validations/healthTipsValidation.js`
- `middleware/healthTipsMiddleware.js`
- `middleware/authMiddleware.js`
- `middleware/formDataMiddleware.js`

## Base paths

```http
/api/health-tips
/api/health-tips/advanced
```

## Included files

| File | Purpose |
|---|---|
| `01-content-management-api-docs.md` | API documentation |
| `02-content-management-manual-testing.md` | Manual API testing guide |
| `03-content-management-sql-verification.sql` | SQL verification queries |
| `04-content-management-postman-collection.json` | Postman collection |
| `05-content-management-test-matrix.csv` | Test matrix |

## Scope

### Daily Tips

```http
GET    /api/health-tips/daily-tips
GET    /api/health-tips/daily-tips/active
GET    /api/health-tips/daily-tips/latest
GET    /api/health-tips/daily-tips/:id
POST   /api/health-tips/daily-tips
PUT    /api/health-tips/daily-tips/:id
DELETE /api/health-tips/daily-tips/:id
PATCH  /api/health-tips/daily-tips/:id/toggle-status
```

### Medical Articles

```http
GET    /api/health-tips/medical-articles
GET    /api/health-tips/medical-articles/active
GET    /api/health-tips/medical-articles/:id
POST   /api/health-tips/medical-articles
PUT    /api/health-tips/medical-articles/:id
DELETE /api/health-tips/medical-articles/:id
PATCH  /api/health-tips/medical-articles/:id/toggle-status
```

### Skin Diseases Info

```http
GET    /api/health-tips/skin-diseases
GET    /api/health-tips/skin-diseases/active
GET    /api/health-tips/skin-diseases/:id
POST   /api/health-tips/skin-diseases
PUT    /api/health-tips/skin-diseases/:id
DELETE /api/health-tips/skin-diseases/:id
PATCH  /api/health-tips/skin-diseases/:id/toggle-status
```

### Advanced

```http
GET   /api/health-tips/advanced/statistics
GET   /api/health-tips/advanced/search
GET   /api/health-tips/advanced/recent
GET   /api/health-tips/advanced/by-admin/:adminId
PATCH /api/health-tips/advanced/bulk-status
GET   /api/health-tips/advanced/export
POST  /api/health-tips/advanced/validate
```

## Permission summary

| Area | Current permission in code |
|---|---|
| Basic GET daily tips/articles/skin diseases | Public in current route file because auth lines are commented |
| Create/update/delete/toggle daily tips | Any Admin |
| Create/update/delete/toggle medical articles | Any Admin |
| Create/update/delete/toggle skin diseases | Any Admin |
| Advanced statistics | Any Admin |
| Advanced search | Authenticated User/Doctor/Assistant |
| Advanced recent | Authenticated User/Doctor/Assistant |
| Advanced by-admin | Any Admin |
| Advanced bulk-status | Any Admin |
| Advanced export | Any Admin |
| Advanced validate | Any Admin |

## Important destructive-operation warning

The delete endpoints execute direct delete operations:

```http
DELETE /api/health-tips/daily-tips/:id
DELETE /api/health-tips/medical-articles/:id
DELETE /api/health-tips/skin-diseases/:id
```

Use only disposable test records when testing delete.

## Important notes

1. Health Tips are stored in `daily_tips`.
2. Medical Articles are stored in `medical_articles`.
3. Skin Diseases are stored in `skin_diseases_info`.
4. Advanced search only returns active content.
5. `advanced/export` currently supports JSON only.
6. The health tips upload middleware exists for future image upload, but it is not connected to the current content routes in this batch.
