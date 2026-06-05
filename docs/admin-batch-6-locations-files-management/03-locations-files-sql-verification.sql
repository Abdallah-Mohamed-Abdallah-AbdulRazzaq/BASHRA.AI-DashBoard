-- Admin Batch 6 SQL Verification
-- Locations + Files Management

-- =========================================================
-- 1. Location hierarchy overview
-- =========================================================

SELECT
  level_type,
  COUNT(*) AS total
FROM countries_cities
GROUP BY level_type
ORDER BY FIELD(level_type, 'country', 'city', 'region', 'district');

-- Recent locations
SELECT
  countries_cities_id,
  name_ar,
  name_en,
  parent_id,
  level_type,
  image,
  created_at,
  updated_at
FROM countries_cities
ORDER BY countries_cities_id DESC
LIMIT 50;

-- Country -> City -> Region -> District tree sample
SELECT
  country.countries_cities_id AS country_id,
  country.name_ar AS country_name_ar,
  city.countries_cities_id AS city_id,
  city.name_ar AS city_name_ar,
  region.countries_cities_id AS region_id,
  region.name_ar AS region_name_ar,
  district.countries_cities_id AS district_id,
  district.name_ar AS district_name_ar
FROM countries_cities country
LEFT JOIN countries_cities city
  ON city.parent_id = country.countries_cities_id
  AND city.level_type = 'city'
LEFT JOIN countries_cities region
  ON region.parent_id = city.countries_cities_id
  AND region.level_type = 'region'
LEFT JOIN countries_cities district
  ON district.parent_id = region.countries_cities_id
  AND district.level_type = 'district'
WHERE country.level_type = 'country'
ORDER BY country.name_ar, city.name_ar, region.name_ar, district.name_ar
LIMIT 100;

-- Search check
SET @location_search = '%القاهرة%';

SELECT
  countries_cities_id,
  name_ar,
  name_en,
  parent_id,
  level_type
FROM countries_cities
WHERE name_ar LIKE @location_search
   OR name_en LIKE @location_search
ORDER BY level_type, name_ar
LIMIT 50;

-- =========================================================
-- 2. Addresses verification
-- =========================================================

-- Recent addresses with owners
SELECT
  a.id AS address_id,
  a.address_line1,
  a.address_line2,
  a.postal_code,
  a.countries_cities_id,
  cc.name_ar AS location_name_ar,
  cc.name_en AS location_name_en,
  cc.level_type AS location_level_type,
  a.latitude,
  a.longitude,
  a.type,
  a.is_primary,
  ad.addressable_type,
  ad.addressable_id,
  ad.creator_id,
  ad.creator_type,
  a.created_at,
  a.updated_at
FROM addresses a
LEFT JOIN addressable ad ON ad.address_id = a.id
LEFT JOIN countries_cities cc ON cc.countries_cities_id = a.countries_cities_id
ORDER BY a.id DESC
LIMIT 50;

-- Primary addresses by owner
SELECT
  ad.addressable_type,
  ad.addressable_id,
  COUNT(*) AS primary_count
FROM addresses a
INNER JOIN addressable ad ON ad.address_id = a.id
WHERE a.is_primary = 1
GROUP BY ad.addressable_type, ad.addressable_id
ORDER BY primary_count DESC;

-- Check one address
-- SET @address_id = 1;
-- SELECT * FROM addresses WHERE id = @address_id;
-- SELECT * FROM addressable WHERE address_id = @address_id;

-- =========================================================
-- 3. Doctors by location verification
-- =========================================================

-- Active doctors with address/location
SELECT
  d.id AS doctor_id,
  d.uuid AS doctor_uuid,
  d.email,
  d.status,
  d.is_active,
  dp.id AS profile_id,
  dp.approval_status,
  dp.is_verified,
  dp.is_available,
  dp.years_of_experience,
  dp.rating_average,
  dpt.full_name,
  dpt.specialty,
  a.id AS address_id,
  a.address_line1,
  a.is_primary,
  a.latitude,
  a.longitude,
  cc.countries_cities_id,
  cc.name_ar AS location_name_ar,
  cc.name_en AS location_name_en,
  cc.level_type
FROM doctors d
INNER JOIN doctor_profiles dp ON dp.doctor_id = d.id
LEFT JOIN doctor_profile_translations dpt ON dpt.doctor_profile_id = dp.id
INNER JOIN addressable ad ON ad.addressable_id = d.id AND ad.addressable_type = 'Doctor'
INNER JOIN addresses a ON a.id = ad.address_id
LEFT JOIN countries_cities cc ON cc.countries_cities_id = a.countries_cities_id
WHERE d.is_active = 1
  AND d.status = 'active'
ORDER BY d.id DESC
LIMIT 50;

-- Doctors count by location
SELECT
  cc.countries_cities_id,
  cc.name_ar,
  cc.name_en,
  cc.level_type,
  COUNT(DISTINCT d.id) AS doctors_count
FROM countries_cities cc
INNER JOIN addresses a ON a.countries_cities_id = cc.countries_cities_id
INNER JOIN addressable ad ON ad.address_id = a.id AND ad.addressable_type = 'Doctor'
INNER JOIN doctors d ON d.id = ad.addressable_id
INNER JOIN doctor_profiles dp ON dp.doctor_id = d.id
WHERE d.is_active = 1
  AND d.status = 'active'
GROUP BY cc.countries_cities_id, cc.name_ar, cc.name_en, cc.level_type
ORDER BY doctors_count DESC, cc.name_ar ASC;

-- Nearby doctor readiness: doctors with coordinates
SELECT
  d.id AS doctor_id,
  d.email,
  dpt.full_name,
  a.latitude,
  a.longitude,
  cc.name_ar AS location_name_ar
FROM doctors d
INNER JOIN doctor_profiles dp ON dp.doctor_id = d.id
LEFT JOIN doctor_profile_translations dpt ON dpt.doctor_profile_id = dp.id
INNER JOIN addressable ad ON ad.addressable_id = d.id AND ad.addressable_type = 'Doctor'
INNER JOIN addresses a ON a.id = ad.address_id
LEFT JOIN countries_cities cc ON cc.countries_cities_id = a.countries_cities_id
WHERE d.is_active = 1
  AND d.status = 'active'
  AND a.latitude IS NOT NULL
  AND a.longitude IS NOT NULL
ORDER BY d.id DESC
LIMIT 50;

-- =========================================================
-- 4. Files verification
-- =========================================================

-- Files overview
SELECT
  COUNT(*) AS total_files,
  SUM(CASE WHEN is_deleted = 0 THEN 1 ELSE 0 END) AS active_files,
  SUM(CASE WHEN is_deleted = 1 THEN 1 ELSE 0 END) AS deleted_files,
  SUM(file_size) AS total_size
FROM files;

-- Files by category
SELECT
  file_category,
  COUNT(*) AS count,
  SUM(file_size) AS total_size,
  AVG(file_size) AS avg_size
FROM files
WHERE is_deleted = 0
GROUP BY file_category
ORDER BY count DESC;

-- Files by virus scan status
SELECT
  virus_scan_status,
  COUNT(*) AS count
FROM files
WHERE is_deleted = 0
GROUP BY virus_scan_status;

-- Recent files
SELECT
  id,
  uuid,
  uploaded_by_user_id,
  uploaded_by_admin_id,
  uploaded_by_doctor_id,
  uploaded_by_assistant_id,
  related_to_type,
  related_to_id,
  file_category,
  original_filename,
  stored_filename,
  file_path,
  file_url,
  mime_type,
  file_size,
  file_extension,
  is_public,
  is_deleted,
  deleted_at,
  storage_provider,
  virus_scan_status,
  access_count,
  last_accessed_at,
  expires_at,
  created_at,
  updated_at
FROM files
ORDER BY id DESC
LIMIT 50;

-- Check one file by UUID
-- SET @file_uuid = 'PUT_FILE_UUID_HERE';
-- SELECT * FROM files WHERE uuid = @file_uuid;

-- Verify access count before/after GET /api/files/:uuid
-- SELECT uuid, access_count, last_accessed_at FROM files WHERE uuid = @file_uuid;

-- Verify soft delete
-- SELECT uuid, is_deleted, deleted_at FROM files WHERE uuid = @file_uuid;

-- Expired files that cleanup endpoint would affect
SELECT
  id,
  uuid,
  original_filename,
  expires_at,
  is_deleted
FROM files
WHERE expires_at IS NOT NULL
  AND expires_at < NOW()
ORDER BY expires_at ASC;

-- Admin logs for Files Management actions
SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  new_values,
  ip_address,
  user_agent,
  created_at
FROM admin_logs
WHERE action IN (
  'UPDATE_FILE_METADATA',
  'DELETE_FILE',
  'RESTORE_FILE',
  'CLEANUP_EXPIRED_FILES',
  'BULK_DELETE_FILES'
)
ORDER BY id DESC
LIMIT 50;
