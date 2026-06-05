# Admin Batch 6 - Locations + Files Management

This batch documents and tests the backend APIs related to:

1. Address management
2. Countries / Cities / Regions / Districts
3. Doctors by Location public discovery APIs
4. Admin Files Management APIs

The documentation is based on the actual backend files:

- `routes/index.js`
- `routes/addressRoutes.js`
- `routes/countriesCitiesRoutes.js`
- `routes/doctorsByLocationRoutes.js`
- `routes/filesRoutes.js`
- `controllers/addressController.js`
- `controllers/countriesCitiesController.js`
- `controllers/doctorsByLocationController.js`
- `controllers/FilesController.js`
- `services/fileService.js`
- `middleware/fileUploadMiddleware.js`
- `middleware/authMiddleware.js`

## Base paths

```http
/api/addresses
/api/countries-cities
/api/doctors-by-location
/api/files
```

## Included files

| File | Purpose |
|---|---|
| `01-locations-files-api-docs.md` | API documentation |
| `02-locations-files-manual-testing.md` | Manual testing guide |
| `03-locations-files-sql-verification.sql` | SQL verification queries |
| `04-locations-files-postman-collection.json` | Postman collection |
| `05-locations-files-test-matrix.csv` | Test matrix |

## Scope summary

### Addresses

Authenticated entities can manage their own addresses:

```http
GET    /api/addresses
GET    /api/addresses/primary
GET    /api/addresses/:id
POST   /api/addresses
PUT    /api/addresses/:id
PATCH  /api/addresses/:id/set-primary
DELETE /api/addresses/:id
```

Supported authenticated entity types:

```text
user
doctor
admin
assistant
```

### Countries / Cities

Public read APIs:

```http
GET /api/countries-cities
GET /api/countries-cities/countries
GET /api/countries-cities/cities/:country_id
GET /api/countries-cities/regions/:city_id
GET /api/countries-cities/districts/:region_id
GET /api/countries-cities/hierarchy/:id
GET /api/countries-cities/search
GET /api/countries-cities/:id
```

Admin write APIs:

```http
POST   /api/countries-cities
PUT    /api/countries-cities/:id
DELETE /api/countries-cities/:id
```

### Doctors by Location

Public doctor discovery APIs:

```http
GET /api/doctors-by-location
GET /api/doctors-by-location/count
GET /api/doctors-by-location/grouped
GET /api/doctors-by-location/search
GET /api/doctors-by-location/nearby
```

### Files Management

Files management APIs are mounted under:

```http
/api/files
```

The current route applies:

```text
authenticateJWT
authorizeSuperAdmin
authorizeAnyAdmin
```

Because `authorizeSuperAdmin` runs before `authorizeAnyAdmin`, test this section with a `super_admin` token.

```http
GET    /api/files
GET    /api/files/statistics
GET    /api/files/:uuid
GET    /api/files/uploader/:entityType/:entityId
GET    /api/files/related/:relatedToType/:relatedToId
PUT    /api/files/:uuid
DELETE /api/files/:uuid
POST   /api/files/:uuid/restore
POST   /api/files/cleanup/expired
POST   /api/files/bulk-delete
```

## Important destructive-operation warnings

The following endpoints perform destructive or potentially destructive operations:

```http
DELETE /api/addresses/:id
DELETE /api/countries-cities/:id
DELETE /api/files/:uuid
POST /api/files/cleanup/expired
POST /api/files/bulk-delete
```

Use disposable test records only.
