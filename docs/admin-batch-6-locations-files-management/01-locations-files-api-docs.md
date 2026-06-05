# Admin Batch 6 API Documentation
## Locations + Files Management

## 1. Base Paths

```http
/api/addresses
/api/countries-cities
/api/doctors-by-location
/api/files
```

---

# Part A - Addresses

## A1. Overview

Address APIs are authenticated and are not admin-only. They support:

```text
user
doctor
admin
assistant
```

The controller maps entity types as:

```text
user      -> User
doctor    -> Doctor
admin     -> Admin
assistant -> Assistant
```

Data is stored in:

```text
addresses
addressable
countries_cities
```

The `addressable` table links an address to the authenticated entity.

---

## A2. Get Current Entity Addresses

```http
GET /api/addresses
Authorization: Bearer <TOKEN>
```

### Headers

```http
Accept-Language: ar
```

or:

```http
Accept-Language: en
```

### Response

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "address_line1": "Nasr City",
      "countries_cities_id": 10,
      "location_name": "مدينة نصر",
      "location_type": "district",
      "is_primary": 1
    }
  ]
}
```

---

## A3. Get Primary Address

```http
GET /api/addresses/primary
Authorization: Bearer <TOKEN>
```

### Expected not found

```json
{
  "success": false,
  "message": "لا يوجد عنوان رئيسي"
}
```

---

## A4. Get Address by ID

```http
GET /api/addresses/:id
Authorization: Bearer <TOKEN>
```

### Authorization rule

The address must belong to the authenticated entity through `addressable`.

---

## A5. Create Address

```http
POST /api/addresses
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "address_line1": "Building 10, Street 20",
  "address_line2": "Apartment 5",
  "postal_code": "11765",
  "countries_cities_id": 1,
  "latitude": 30.0444,
  "longitude": 31.2357,
  "type": "home",
  "is_primary": true
}
```

### Fields

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `address_line1` | string | Yes | Required |
| `address_line2` | string | No | Optional |
| `postal_code` | string | No | Optional |
| `countries_cities_id` | number | No | FK to `countries_cities` |
| `latitude` | number | No | Used by nearby search if doctor address |
| `longitude` | number | No | Used by nearby search if doctor address |
| `type` | string | No | `home`, `work`, `billing`, `shipping`, `other`; default `home` |
| `is_primary` | boolean | No | If true, other addresses for same entity become non-primary |

### DB impact

1. Insert row into `addresses`.
2. Insert row into `addressable`.
3. If `is_primary = true`, unset other primary addresses for the same entity.

---

## A6. Update Address

```http
PUT /api/addresses/:id
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

### Body

All fields are optional.

```json
{
  "address_line1": "Updated address line",
  "latitude": 30.0500,
  "longitude": 31.2400,
  "is_primary": true
}
```

### Rules

- The address must belong to the authenticated entity.
- If no fields are sent, returns 400.
- If setting primary, other addresses for same entity are unset.

---

## A7. Set Primary Address

```http
PATCH /api/addresses/:id/set-primary
Authorization: Bearer <TOKEN>
```

### DB impact

- Sets all current entity addresses `is_primary = 0`.
- Sets selected address `is_primary = 1`.

---

## A8. Delete Address

```http
DELETE /api/addresses/:id
Authorization: Bearer <TOKEN>
```

### Warning

This executes:

```sql
DELETE FROM addresses WHERE id = ?
```

Use a disposable address when testing deletion.

---

# Part B - Countries / Cities / Regions / Districts

## B1. Overview

This module stores hierarchical location data in:

```text
countries_cities
```

Supported levels:

```text
country
city
region
district
```

Hierarchy:

```text
country -> city -> region -> district
```

Read endpoints are public. Create/update/delete endpoints require an admin token.

---

## B2. Get All Locations

```http
GET /api/countries-cities
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `level_type` | string | No | `country`, `city`, `region`, `district` |
| `parent_id` | number | No | Parent location id |
| `lang` | string | No | `ar` or `en`; default `ar` |

### Example

```http
GET /api/countries-cities?level_type=city&parent_id=1&lang=ar
```

---

## B3. Get Countries

```http
GET /api/countries-cities/countries?lang=ar
```

---

## B4. Get Cities by Country

```http
GET /api/countries-cities/cities/:country_id?lang=ar
```

---

## B5. Get Regions by City

```http
GET /api/countries-cities/regions/:city_id?lang=ar
```

---

## B6. Get Districts by Region

```http
GET /api/countries-cities/districts/:region_id?lang=ar
```

---

## B7. Get Hierarchy

```http
GET /api/countries-cities/hierarchy/:id?lang=ar
```

### Response data

```json
{
  "full_hierarchy": [],
  "country": {},
  "city": {},
  "region": {},
  "district": {}
}
```

---

## B8. Search Locations

```http
GET /api/countries-cities/search?q=القاهرة&level_type=city&lang=ar
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `q` | string | Yes |
| `level_type` | string | No |
| `lang` | string | No |

### Missing q

Returns 400.

---

## B9. Get Location by ID

```http
GET /api/countries-cities/:id?lang=ar
```

---

## B10. Create Location

```http
POST /api/countries-cities
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data
```

### Form-data fields

| Field | Type | Required | Notes |
|---|---:|---:|---|
| `name_ar` | string | Yes | Arabic name |
| `name_en` | string | Yes | English name |
| `level_type` | string | Yes | `country`, `city`, `region`, `district` |
| `parent_id` | number | Conditional | Required for city/region/district |
| `image` | file | No | Optional image; field name must be `image` |

### Examples

Create country:

```text
name_ar = مصر
name_en = Egypt
level_type = country
```

Create city:

```text
name_ar = القاهرة
name_en = Cairo
level_type = city
parent_id = <country_id>
```

### Validation

- Missing `name_ar`, `name_en`, or `level_type` returns 400.
- Invalid `level_type` returns 400.
- Non-country without `parent_id` returns 400.
- Parent not found returns 404.

### Image

If image is sent:

- It is stored under `upload/files/location-images`.
- The DB `image` column stores a full URL generated from `process.env.BASE_URL || http://localhost:3006`.

---

## B11. Update Location

```http
PUT /api/countries-cities/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data
```

### Form-data fields

| Field | Type | Required |
|---|---:|---:|
| `name_ar` | string | No |
| `name_en` | string | No |
| `parent_id` | number | No |
| `image` | file | No |

If no update fields are sent, returns 400.

---

## B12. Delete Location

```http
DELETE /api/countries-cities/:id
Authorization: Bearer <ADMIN_TOKEN>
```

### Warning

This executes:

```sql
DELETE FROM countries_cities WHERE countries_cities_id = ?
```

The route comment indicates cascade delete children. Test only with disposable location trees.

---

# Part C - Doctors by Location

## C1. Overview

All doctors-by-location endpoints are public.

They join:

```text
doctors
doctor_profiles
doctor_profile_translations
addressable
addresses
countries_cities
```

Only doctors with:

```text
doctors.is_active = 1
doctors.status = 'active'
```

are included.

---

## C2. Get Doctors by Location

```http
GET /api/doctors-by-location?countries_cities_id=1&level_type=city&include_children=true&page=1&limit=20&lang=ar
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `countries_cities_id` | number | Yes | Location id |
| `level_type` | string | No | `country`, `city`, `region`, `district` |
| `include_children` | boolean string | No | Default true |
| `page` | number | No | Default 1 |
| `limit` | number | No | Default 20, max 100 |
| `lang` | string | No | `ar` or `en` |

### Missing location

Returns 400.

---

## C3. Get Doctors Count by Location

```http
GET /api/doctors-by-location/count?countries_cities_id=1&include_children=true
```

---

## C4. Get Doctors Grouped by Location

```http
GET /api/doctors-by-location/grouped?level_type=city&parent_id=1&lang=ar
```

### Required

```text
level_type
```

### Valid level_type

```text
country
city
region
district
```

---

## C5. Search Doctors by Location

```http
GET /api/doctors-by-location/search?countries_cities_id=1&specialization=جلدية&min_experience=5&include_children=true&sort_by=rating&order=desc&page=1&limit=20&lang=ar
```

### Query params

| Param | Type | Required | Notes |
|---|---:|---:|---|
| `countries_cities_id` | number | Yes | Location id |
| `specialization` | string | No | Searches translated specialty |
| `min_experience` | number | No | `dp.years_of_experience >= value` |
| `include_children` | boolean string | No | Default true |
| `sort_by` | string | No | `experience`, `name`, `created_at`, `rating` |
| `order` | string | No | `asc` or `desc` |
| `page` | number | No | Default 1 |
| `limit` | number | No | Max 100 |
| `lang` | string | No | `ar` or `en` |

---

## C6. Get Nearby Doctors

```http
GET /api/doctors-by-location/nearby?latitude=30.0444&longitude=31.2357&radius=10&page=1&limit=20&lang=ar
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `latitude` | number | Yes |
| `longitude` | number | Yes |
| `radius` | number | No, default 5 |
| `page` | number | No |
| `limit` | number | No |
| `lang` | string | No |

### Validation

- Missing latitude/longitude returns 400.
- Invalid coordinate ranges return 400.
- Distance is calculated with the Haversine formula using Earth radius 6371 km.

---

# Part D - Files Management

## D1. Overview

Files APIs are under:

```http
/api/files
```

Current middleware chain:

```text
authenticateJWT
authorizeSuperAdmin
authorizeAnyAdmin
```

Because `authorizeSuperAdmin` runs first, use a `super_admin` token for tests.

Files are stored in:

```text
files
```

Soft delete uses:

```text
is_deleted = 1
deleted_at = CURRENT_TIMESTAMP
```

---

## D2. Get All Files

```http
GET /api/files?page=1&limit=50
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

### Query params

| Param | Type | Required |
|---|---:|---:|
| `page` | number | No |
| `limit` | number | No, max 100 |
| `entityType` | string | No |
| `entityId` | number | No |
| `fileCategory` | string | No |
| `relatedToType` | string | No |
| `relatedToId` | number | No |
| `virusScanStatus` | string | No |
| `isPublic` | boolean string | No |
| `storageProvider` | string | No |
| `searchTerm` | string | No |

### Notes

- `entityType` dynamically maps to `uploaded_by_<entityType>_id`.
- Valid practical entity types: `user`, `admin`, `doctor`, `assistant`.

---

## D3. Get File Statistics

```http
GET /api/files/statistics
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

Optional:

```http
GET /api/files/statistics?entityType=user&entityId=1
```

Returns:

```text
overall
byCategory
byVirusScan
byStorageProvider
```

---

## D4. Get File by UUID

```http
GET /api/files/:uuid
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

### Side effect

`FileService.getFileByUuid` increments:

```text
access_count
last_accessed_at
```

---

## D5. Get Files by Uploader

```http
GET /api/files/uploader/:entityType/:entityId?fileCategory=profile_picture&limit=50&offset=0
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

---

## D6. Get Files by Related Entity

```http
GET /api/files/related/:relatedToType/:relatedToId?fileCategory=medical_image&limit=50&offset=0
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

---

## D7. Update File Metadata

```http
PUT /api/files/:uuid
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "is_public": true,
  "metadata": {
    "reviewed_by": "admin"
  },
  "virus_scan_status": "clean",
  "virus_scan_date": "2026-06-05 12:00:00",
  "expires_at": "2026-12-31 23:59:59"
}
```

### Allowed update fields

```text
is_public
metadata
virus_scan_status
virus_scan_date
expires_at
```

If no valid fields are sent, the service throws `No valid fields to update`.

---

## D8. Delete File

```http
DELETE /api/files/:uuid?deleteFromDisk=false
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

### DB impact

Soft delete:

```text
is_deleted = 1
deleted_at = CURRENT_TIMESTAMP
```

If `deleteFromDisk=true` and the storage provider is `local`, the physical file is also removed from disk.

---

## D9. Restore Deleted File

```http
POST /api/files/:uuid/restore
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

### DB impact

```text
is_deleted = 0
deleted_at = NULL
```

---

## D10. Cleanup Expired Files

```http
POST /api/files/cleanup/expired
Authorization: Bearer <SUPER_ADMIN_TOKEN>
```

### DB impact

Soft-deletes files where:

```text
expires_at IS NOT NULL
expires_at < NOW()
is_deleted = 0
```

The service also attempts to remove local disk files.

---

## D11. Bulk Delete Files

```http
POST /api/files/bulk-delete
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Content-Type: application/json
```

### Body

```json
{
  "uuids": ["file-uuid-1", "file-uuid-2"],
  "deleteFromDisk": false
}
```

### Validation

`uuids` must be a non-empty array.

---

# Notes for Frontend Integration

## Locations

- Public reads do not require tokens.
- Admin create/update of countries-cities uses `multipart/form-data` if image is included.
- The image field name is `image`.
- Location names can be switched using `lang=ar` or `lang=en`.

## Doctors by Location

- Public endpoints are intended for discovery/search pages.
- Use `include_children=true` to search parent location and child locations.
- Nearby search requires doctors to have address latitude/longitude.

## Files Management

- Use `super_admin` token due current middleware chain.
- `GET /api/files/:uuid` has an access-count side effect.
- `DELETE` is soft delete by default, but `deleteFromDisk=true` can remove the physical file.
