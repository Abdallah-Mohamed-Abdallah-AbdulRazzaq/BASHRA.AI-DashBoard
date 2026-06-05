# Admin Batch 6 Manual Testing Guide
## Locations + Files Management

## 0. Required Postman variables

```text
base_url=http://localhost:3006

user_token=<USER_ACCESS_TOKEN>
doctor_token=<DOCTOR_ACCESS_TOKEN>
admin_token=<ADMIN_ACCESS_TOKEN>
super_admin_token=<SUPER_ADMIN_ACCESS_TOKEN>

country_id=<COUNTRY_ID>
city_id=<CITY_ID>
region_id=<REGION_ID>
district_id=<DISTRICT_ID>

address_id=<CREATED_ADDRESS_ID>
file_uuid=<EXISTING_FILE_UUID>
```

---

# Part A - Countries / Cities Public Read Tests

## 1. Get all locations

```http
GET {{base_url}}/api/countries-cities?lang=ar
```

Expected:

```text
200 OK
success = true
count exists
data array
```

## 2. Get countries

```http
GET {{base_url}}/api/countries-cities/countries?lang=ar
```

Expected:

```text
200 OK
all rows level_type = country
```

Save one country id as `country_id`.

## 3. Get cities by country

```http
GET {{base_url}}/api/countries-cities/cities/{{country_id}}?lang=ar
```

Expected:

```text
200 OK
all rows level_type = city
parent_id = country_id
```

Save one city id as `city_id`.

## 4. Get regions by city

```http
GET {{base_url}}/api/countries-cities/regions/{{city_id}}?lang=ar
```

Expected:

```text
200 OK
all rows level_type = region
parent_id = city_id
```

## 5. Get districts by region

```http
GET {{base_url}}/api/countries-cities/districts/{{region_id}}?lang=ar
```

Expected:

```text
200 OK
all rows level_type = district
parent_id = region_id
```

## 6. Search locations

```http
GET {{base_url}}/api/countries-cities/search?q=القاهرة&level_type=city&lang=ar
```

Expected:

```text
200 OK
success = true
```

Negative:

```http
GET {{base_url}}/api/countries-cities/search
```

Expected:

```text
400 because q is required
```

## 7. Get hierarchy

```http
GET {{base_url}}/api/countries-cities/hierarchy/{{district_id}}?lang=ar
```

Expected:

```text
200 OK
data.full_hierarchy exists
country/city/region/district keys exist
```

## 8. Get location by ID

```http
GET {{base_url}}/api/countries-cities/{{country_id}}?lang=ar
```

Expected:

```text
200 OK
data.countries_cities_id = country_id
```

---

# Part B - Countries / Cities Admin Write Tests

Use disposable test locations.

## 9. Create test country

```http
POST {{base_url}}/api/countries-cities
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data
```

Form-data:

```text
name_ar = دولة اختبار
name_en = Test Country
level_type = country
```

Expected:

```text
201 Created
success = true
data.countries_cities_id returned
```

Save id as `test_country_id`.

SQL:

```sql
SELECT * FROM countries_cities WHERE countries_cities_id = <test_country_id>;
```

## 10. Create test city under test country

```http
POST {{base_url}}/api/countries-cities
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data
```

Form-data:

```text
name_ar = مدينة اختبار
name_en = Test City
level_type = city
parent_id = {{test_country_id}}
```

Save id as `test_city_id`.

## 11. Negative create city without parent_id

```http
POST {{base_url}}/api/countries-cities
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data
```

Form-data:

```text
name_ar = مدينة بدون أب
name_en = City Without Parent
level_type = city
```

Expected:

```text
400
message = المعرف الأب مطلوب للمدن والمناطق والأحياء
```

## 12. Update test city

```http
PUT {{base_url}}/api/countries-cities/{{test_city_id}}
Authorization: Bearer {{admin_token}}
Content-Type: multipart/form-data
```

Form-data:

```text
name_ar = مدينة اختبار محدثة
name_en = Updated Test City
```

Expected:

```text
200 OK
data.name_ar updated
```

## 13. Delete test city

```http
DELETE {{base_url}}/api/countries-cities/{{test_city_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
row removed
```

## 14. Delete test country

```http
DELETE {{base_url}}/api/countries-cities/{{test_country_id}}
Authorization: Bearer {{admin_token}}
```

Expected:

```text
200 OK
row removed
```

---

# Part C - Addresses Tests

## 15. Create address as user

```http
POST {{base_url}}/api/addresses
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

Body:

```json
{
  "address_line1": "شارع اختبار 10",
  "address_line2": "الدور الثاني",
  "postal_code": "11765",
  "countries_cities_id": 1,
  "latitude": 30.0444,
  "longitude": 31.2357,
  "type": "home",
  "is_primary": true
}
```

Expected:

```text
201 Created
success = true
data.id returned
addressable row created
```

Save `data.id` as `address_id`.

## 16. Get my addresses

```http
GET {{base_url}}/api/addresses
Authorization: Bearer {{user_token}}
Accept-Language: ar
```

Expected:

```text
200 OK
created address returned
```

## 17. Get primary address

```http
GET {{base_url}}/api/addresses/primary
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
data.is_primary = 1
```

## 18. Get address by ID

```http
GET {{base_url}}/api/addresses/{{address_id}}
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
```

## 19. Update address

```http
PUT {{base_url}}/api/addresses/{{address_id}}
Authorization: Bearer {{user_token}}
Content-Type: application/json
```

Body:

```json
{
  "address_line1": "شارع اختبار محدث",
  "latitude": 30.0500,
  "longitude": 31.2400,
  "is_primary": true
}
```

Expected:

```text
200 OK
data.address_line1 updated
```

## 20. Set primary

```http
PATCH {{base_url}}/api/addresses/{{address_id}}/set-primary
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
only this address is primary for the user
```

## 21. Negative access with another user/doctor token

```http
GET {{base_url}}/api/addresses/{{address_id}}
Authorization: Bearer {{doctor_token}}
```

Expected:

```text
404 because address does not belong to the doctor
```

## 22. Delete address

```http
DELETE {{base_url}}/api/addresses/{{address_id}}
Authorization: Bearer {{user_token}}
```

Expected:

```text
200 OK
row removed from addresses and addressable by cascade
```

---

# Part D - Doctors by Location Public Tests

These tests require at least one active doctor with doctor profile and address linked through `addressable`.

## 23. Get doctors by location

```http
GET {{base_url}}/api/doctors-by-location?countries_cities_id={{city_id}}&include_children=true&page=1&limit=20&lang=ar
```

Expected:

```text
200 OK
data.doctors array
data.pagination exists
data.hierarchy_info.included_location_ids exists
```

Negative:

```http
GET {{base_url}}/api/doctors-by-location
```

Expected:

```text
400 because countries_cities_id is required
```

## 24. Get doctors count

```http
GET {{base_url}}/api/doctors-by-location/count?countries_cities_id={{city_id}}&include_children=true
```

Expected:

```text
200 OK
data.total_doctors exists
```

## 25. Group doctors by location

```http
GET {{base_url}}/api/doctors-by-location/grouped?level_type=city&parent_id={{country_id}}&lang=ar
```

Expected:

```text
200 OK
data.locations array
```

Negative:

```http
GET {{base_url}}/api/doctors-by-location/grouped
```

Expected:

```text
400 because level_type is required
```

## 26. Search doctors by location

```http
GET {{base_url}}/api/doctors-by-location/search?countries_cities_id={{city_id}}&specialization=جلدية&min_experience=1&sort_by=rating&order=desc&page=1&limit=20&lang=ar
```

Expected:

```text
200 OK
data.doctors array
data.filters returned
```

## 27. Nearby doctors

```http
GET {{base_url}}/api/doctors-by-location/nearby?latitude=30.0444&longitude=31.2357&radius=10&page=1&limit=20&lang=ar
```

Expected:

```text
200 OK
data.search_location exists
distance_km present for returned doctors
```

Negative:

```http
GET {{base_url}}/api/doctors-by-location/nearby?latitude=999&longitude=31.2357
```

Expected:

```text
400 invalid coordinates
```

---

# Part E - Files Management Tests

Use a `super_admin` token for all `/api/files` tests.

## 28. Get all files

```http
GET {{base_url}}/api/files?page=1&limit=50
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
data.files array
data.pagination exists
```

## 29. Get files with filters

```http
GET {{base_url}}/api/files?fileCategory=medical_image&isPublic=false&page=1&limit=20
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
filtered files returned
```

## 30. Get file statistics

```http
GET {{base_url}}/api/files/statistics
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
data.overall
data.byCategory
data.byVirusScan
data.byStorageProvider
```

## 31. Get file by UUID

```http
GET {{base_url}}/api/files/{{file_uuid}}
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
access_count increments by 1
last_accessed_at updated
```

## 32. Get files by uploader

```http
GET {{base_url}}/api/files/uploader/user/1?limit=50&offset=0
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
data array
```

## 33. Get files by related entity

```http
GET {{base_url}}/api/files/related/ai_session/1?limit=50&offset=0
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
data array
```

## 34. Update file metadata

```http
PUT {{base_url}}/api/files/{{file_uuid}}
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "is_public": false,
  "metadata": {
    "manual_test": true,
    "reviewed_by": "super_admin"
  },
  "virus_scan_status": "clean",
  "virus_scan_date": "2026-06-05 12:00:00"
}
```

Expected:

```text
200 OK
files row updated
admin_logs row created for UPDATE_FILE_METADATA
```

Negative:

```json
{
  "unknown_field": "x"
}
```

Expected:

```text
500 from service because no valid fields to update
```

## 35. Delete file - soft delete

Use a disposable test file if possible.

```http
DELETE {{base_url}}/api/files/{{file_uuid}}?deleteFromDisk=false
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
is_deleted = 1
deleted_at not null
admin_logs row created for DELETE_FILE
```

## 36. Restore file

```http
POST {{base_url}}/api/files/{{file_uuid}}/restore
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
is_deleted = 0
deleted_at = null
admin_logs row created for RESTORE_FILE
```

## 37. Bulk delete files

Use disposable files only.

```http
POST {{base_url}}/api/files/bulk-delete
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

Body:

```json
{
  "uuids": ["uuid-1", "uuid-2"],
  "deleteFromDisk": false
}
```

Expected:

```text
200 OK
data.success and data.failed arrays
admin_logs row created for BULK_DELETE_FILES
```

Negative:

```json
{
  "uuids": [],
  "deleteFromDisk": false
}
```

Expected:

```text
400 Please provide an array of UUIDs
```

## 38. Cleanup expired files

Use caution.

```http
POST {{base_url}}/api/files/cleanup/expired
Authorization: Bearer {{super_admin_token}}
```

Expected:

```text
200 OK
data.deletedCount returned
expired files soft-deleted
admin_logs row created for CLEANUP_EXPIRED_FILES
```

---

# Final SQL checks

Run the SQL verification file after API tests.
