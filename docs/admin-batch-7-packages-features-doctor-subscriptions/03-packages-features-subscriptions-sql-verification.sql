-- Admin Batch 7 SQL Verification
-- Packages / Features / Doctor Subscriptions

-- =========================================================
-- 1. Features
-- =========================================================

SELECT
  id,
  name_ar,
  name_en,
  unit_ar,
  unit_en,
  is_active,
  created_at,
  updated_at
FROM features
ORDER BY id DESC
LIMIT 50;

-- Check duplicate names
SELECT
  name_ar,
  COUNT(*) AS count
FROM features
GROUP BY name_ar
HAVING COUNT(*) > 1;

-- Check one feature
-- SET @feature_id = 1;
-- SELECT * FROM features WHERE id = @feature_id;

-- =========================================================
-- 2. Packages
-- =========================================================

SELECT
  id,
  name_ar,
  name_en,
  secondary_name_ar,
  secondary_name_en,
  duration_days,
  price,
  currency_code,
  is_active,
  created_at,
  updated_at
FROM packages
ORDER BY price ASC;

-- Check one package
-- SET @package_id = 1;
-- SELECT * FROM packages WHERE id = @package_id;

-- =========================================================
-- 3. Package Features
-- =========================================================

SELECT
  pf.id AS package_feature_id,
  pf.package_id,
  p.name_ar AS package_name_ar,
  p.name_en AS package_name_en,
  pf.feature_id,
  f.name_ar AS feature_name_ar,
  f.name_en AS feature_name_en,
  f.unit_ar,
  f.unit_en,
  pf.feature_value,
  pf.is_included,
  pf.created_at,
  pf.updated_at
FROM package_features pf
INNER JOIN packages p ON p.id = pf.package_id
INNER JOIN features f ON f.id = pf.feature_id
ORDER BY pf.package_id, f.id;

-- Detect duplicate links - should return zero rows because uq_package_feature prevents duplicates
SELECT
  package_id,
  feature_id,
  COUNT(*) AS count
FROM package_features
GROUP BY package_id, feature_id
HAVING COUNT(*) > 1;

-- Public visible package features
SELECT
  p.id AS package_id,
  p.name_ar AS package_name_ar,
  p.is_active AS package_active,
  f.id AS feature_id,
  f.name_ar AS feature_name_ar,
  f.is_active AS feature_active,
  pf.feature_value,
  pf.is_included
FROM packages p
INNER JOIN package_features pf ON pf.package_id = p.id
INNER JOIN features f ON f.id = pf.feature_id
WHERE p.is_active = 1
  AND f.is_active = 1
  AND pf.is_included = 1
ORDER BY p.price ASC, f.id ASC;

-- =========================================================
-- 4. Doctor Subscriptions
-- =========================================================

SELECT
  ds.id,
  ds.doctor_id,
  d.uuid AS doctor_uuid,
  d.email AS doctor_email,
  COALESCE(dpt_ar.full_name, dpt_en.full_name, dpt_any.full_name) AS doctor_name,
  ds.package_id,
  p.name_ar AS package_name_ar,
  p.price,
  p.duration_days,
  ds.start_date,
  ds.end_date,
  ds.subscription_status,
  ds.is_trial,
  ds.approved_by_admin_id,
  ds.last_modified_by_admin_id,
  ds.created_at,
  ds.updated_at
FROM doctor_subscriptions ds
INNER JOIN doctors d ON d.id = ds.doctor_id
INNER JOIN packages p ON p.id = ds.package_id
LEFT JOIN doctor_profiles dp ON dp.doctor_id = d.id
LEFT JOIN doctor_profile_translations dpt_ar
  ON dpt_ar.doctor_profile_id = dp.id AND dpt_ar.language_code = 'ar'
LEFT JOIN doctor_profile_translations dpt_en
  ON dpt_en.doctor_profile_id = dp.id AND dpt_en.language_code = 'en'
LEFT JOIN doctor_profile_translations dpt_any
  ON dpt_any.doctor_profile_id = dp.id
  AND dpt_any.id = (
    SELECT MIN(id)
    FROM doctor_profile_translations
    WHERE doctor_profile_id = dp.id
  )
ORDER BY ds.id DESC
LIMIT 50;

-- Subscription counts by status
SELECT
  subscription_status,
  COUNT(*) AS count
FROM doctor_subscriptions
GROUP BY subscription_status;

-- Current subscription consistency
SELECT
  d.id AS doctor_id,
  d.email,
  d.current_subscription_id,
  ds.subscription_status,
  ds.package_id,
  p.name_ar AS package_name_ar,
  ds.start_date,
  ds.end_date
FROM doctors d
LEFT JOIN doctor_subscriptions ds ON ds.id = d.current_subscription_id
LEFT JOIN packages p ON p.id = ds.package_id
WHERE d.current_subscription_id IS NOT NULL
ORDER BY d.id DESC;

-- Doctors with active or pending subscriptions
SELECT
  doctor_id,
  SUM(subscription_status = 'active') AS active_count,
  SUM(subscription_status = 'pending') AS pending_count
FROM doctor_subscriptions
WHERE subscription_status IN ('active', 'pending')
GROUP BY doctor_id
ORDER BY active_count DESC, pending_count DESC;

-- Verify one subscription
-- SET @subscription_id = 1;
-- SELECT * FROM doctor_subscriptions WHERE id = @subscription_id;

-- Verify package cannot be deleted if used
-- SET @package_id = 1;
-- SELECT COUNT(*) AS subscriptions_count
-- FROM doctor_subscriptions
-- WHERE package_id = @package_id;

-- =========================================================
-- 5. Useful cleanup checks
-- =========================================================

-- Disposable test records by name
SELECT * FROM features
WHERE name_ar LIKE '%اختبار%' OR name_en LIKE '%Test%'
ORDER BY id DESC;

SELECT * FROM packages
WHERE name_ar LIKE '%اختبار%' OR name_en LIKE '%Test%'
ORDER BY id DESC;

-- Package feature rows for disposable packages/features
SELECT
  pf.*
FROM package_features pf
LEFT JOIN packages p ON p.id = pf.package_id
LEFT JOIN features f ON f.id = pf.feature_id
WHERE p.name_ar LIKE '%اختبار%'
   OR p.name_en LIKE '%Test%'
   OR f.name_ar LIKE '%اختبار%'
   OR f.name_en LIKE '%Test%';

-- Admin tokens/auth sanity can be checked from existing auth tables if needed.
