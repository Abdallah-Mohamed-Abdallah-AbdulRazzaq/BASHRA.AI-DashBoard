-- Admin Batch 2 SQL Verification
-- User Management + Patient Profiles

-- 1. Confirm available admins and roles
SELECT 
  id,
  uuid,
  email,
  admin_type,
  status,
  is_active,
  last_login_at,
  created_at
FROM admins
ORDER BY id DESC
LIMIT 20;

-- 2. Confirm test user
SET @test_user_id = 1;

SELECT 
  id,
  uuid,
  email,
  phone,
  status,
  is_active,
  email_verified_at,
  phone_verified_at,
  is_id_verified,
  last_login_at,
  last_activity_at,
  created_at,
  updated_at
FROM users
WHERE id = @test_user_id;

-- 3. User profile and translation
SELECT 
  up.id AS user_profile_id,
  up.user_id,
  up.date_of_birth,
  up.gender,
  up.nationality,
  up.profile_picture_url,
  up.language_preference,
  up.created_at,
  up.updated_at
FROM user_profiles up
WHERE up.user_id = @test_user_id;

SELECT 
  upt.id,
  upt.profile_id,
  upt.language_code,
  upt.full_name,
  upt.emergency_contact_name,
  upt.emergency_contact_relationship,
  upt.created_at,
  upt.updated_at
FROM user_profile_translations upt
WHERE upt.profile_id IN (
  SELECT id FROM user_profiles WHERE user_id = @test_user_id
)
ORDER BY upt.language_code;

-- 4. Users count by status
SELECT 
  status,
  COUNT(*) AS users_count
FROM users
GROUP BY status
ORDER BY users_count DESC;

-- 5. Users verification summary
SELECT
  COUNT(*) AS total_users,
  SUM(CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END) AS email_verified_users,
  SUM(CASE WHEN phone_verified_at IS NOT NULL THEN 1 ELSE 0 END) AS phone_verified_users,
  SUM(CASE WHEN is_id_verified = 1 THEN 1 ELSE 0 END) AS id_verified_users
FROM users;

-- 6. Search-like check by email/name/phone
SELECT 
  u.id,
  u.uuid,
  u.email,
  u.phone,
  u.status,
  upt.full_name
FROM users u
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN user_profile_translations upt ON upt.profile_id = up.id AND upt.language_code = 'ar'
WHERE 
  u.email LIKE '%test%'
  OR u.phone LIKE '%test%'
  OR upt.full_name LIKE '%test%'
ORDER BY u.created_at DESC
LIMIT 20;

-- 7. Patient profile for test user
SELECT 
  pp.id AS patient_profile_id,
  pp.user_id,
  u.email,
  pp.blood_type,
  pp.height,
  pp.weight,
  pp.smoking_status,
  pp.alcohol_consumption,
  pp.exercise_frequency,
  pp.insurance_provider,
  pp.insurance_policy_number,
  pp.preferred_doctor_id,
  pp.created_at,
  pp.updated_at
FROM patient_profiles pp
JOIN users u ON u.id = pp.user_id
WHERE pp.user_id = @test_user_id;

-- 8. Patient profile translations for test user
SELECT 
  ppt.id,
  ppt.patient_profile_id,
  ppt.language_code,
  ppt.medical_history,
  ppt.current_medications,
  ppt.allergies,
  ppt.chronic_conditions,
  ppt.family_medical_history,
  ppt.created_at,
  ppt.updated_at
FROM patient_profile_translations ppt
WHERE ppt.patient_profile_id IN (
  SELECT id FROM patient_profiles WHERE user_id = @test_user_id
)
ORDER BY ppt.language_code;

-- 9. All patient profiles summary
SELECT 
  pp.id,
  pp.user_id,
  u.uuid AS user_uuid,
  u.email,
  upt.full_name,
  pp.blood_type,
  pp.height,
  pp.weight,
  pp.updated_at
FROM patient_profiles pp
JOIN users u ON u.id = pp.user_id
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN user_profile_translations upt ON upt.profile_id = up.id AND upt.language_code = 'ar'
ORDER BY pp.id DESC
LIMIT 30;

-- 10. Admin logs related to user management
-- Note: target_type/action values depend on logAdminAction usage in controller.
SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  description,
  severity,
  created_at
FROM admin_logs
WHERE 
  target_id = @test_user_id
  OR action LIKE '%USER%'
  OR target_type IN ('user', 'User', 'users', 'Users')
ORDER BY id DESC
LIMIT 50;

-- 11. Auth tokens for test user/admin checks
SELECT
  id,
  user_id,
  admin_id,
  doctor_id,
  assistant_id,
  token_type,
  is_revoked,
  expires_at,
  created_at
FROM auth_tokens
WHERE 
  user_id = @test_user_id
  OR admin_id IS NOT NULL
ORDER BY id DESC
LIMIT 30;

-- 12. Failed login attempts for security review
SELECT
  id,
  email,
  entity_type,
  failure_reason,
  ip_address,
  attempted_at
FROM failed_logins
ORDER BY attempted_at DESC
LIMIT 30;
