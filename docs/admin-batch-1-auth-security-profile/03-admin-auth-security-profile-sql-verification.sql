-- =========================================================
-- Batch 1 SQL Verification
-- Admin Authentication + Security + Admin Profile
-- =========================================================
-- Replace placeholders before running:
--   <SUPER_ADMIN_ID>
--   <SYSTEM_ADMIN_ID>
--   <CLINIC_ADMIN_ID>
--   <TARGET_USER_ID>
--   <TARGET_DOCTOR_ID>
--   <TARGET_ASSISTANT_ID>
--   <TARGET_SESSION_ID>
--   <TEST_ADMIN_ID>
-- =========================================================

-- 1) Admin accounts overview
SELECT
  id,
  uuid,
  email,
  phone,
  admin_type,
  status,
  is_active,
  email_verified_at,
  phone_verified_at,
  last_login_at,
  last_activity_at,
  created_at,
  updated_at
FROM admins
ORDER BY id;

-- 2) Latest auth tokens for one admin
SELECT
  id,
  admin_id,
  token_type,
  is_revoked,
  revoked_at,
  revoked_by_admin_id,
  ip_address,
  created_at,
  expires_at
FROM auth_tokens
WHERE admin_id = <SUPER_ADMIN_ID>
ORDER BY id DESC
LIMIT 20;

-- 3) Latest login sessions for one admin
SELECT
  id,
  admin_id,
  session_token,
  ip_address,
  device_type,
  browser,
  operating_system,
  is_mobile,
  is_active,
  last_activity_at,
  created_at,
  expires_at,
  ended_at
FROM login_sessions
WHERE admin_id = <SUPER_ADMIN_ID>
ORDER BY id DESC
LIMIT 20;

-- 4) Failed admin logins
SELECT
  id,
  email,
  ip_address,
  entity_type,
  failure_reason,
  attempted_at
FROM failed_logins
WHERE entity_type = 'admin'
ORDER BY id DESC
LIMIT 50;

-- 5) Admin logs latest
SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  description,
  severity,
  old_values,
  new_values,
  ip_address,
  created_at
FROM admin_logs
ORDER BY id DESC
LIMIT 50;

-- 6) Admin logs by action for this batch
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
WHERE action IN (
  'BLOCK_ENTITY',
  'UNBLOCK_ENTITY',
  'REVOKE_ALL_SESSIONS',
  'UPDATE_ENTITY_STATUS',
  'END_SESSION',
  'CREATE_ADMIN',
  'MANUAL_CLEANUP',
  'MANUAL_SECURITY_CLEANUP'
)
ORDER BY id DESC
LIMIT 100;

-- 7) Active blocked entities
SELECT
  id,
  blocked_user_id,
  blocked_admin_id,
  blocked_doctor_id,
  blocked_assistant_id,
  blocked_by_admin_id,
  block_type,
  blocked_until,
  reason,
  is_active,
  created_at,
  removed_at,
  removed_by_admin_id
FROM blocked_entities
WHERE is_active = 1
ORDER BY id DESC
LIMIT 50;

-- 8) Block history for target user
SELECT
  id,
  blocked_user_id,
  blocked_by_admin_id,
  block_type,
  blocked_until,
  reason,
  is_active,
  created_at,
  removed_at,
  removed_by_admin_id
FROM blocked_entities
WHERE blocked_user_id = <TARGET_USER_ID>
ORDER BY id DESC
LIMIT 20;

-- 9) Target user status after update-entity-status tests
SELECT
  id,
  uuid,
  email,
  phone,
  status,
  is_active,
  last_activity_at,
  updated_at
FROM users
WHERE id = <TARGET_USER_ID>;

-- 10) Target user tokens after revoke-sessions
SELECT
  id,
  user_id,
  token_type,
  is_revoked,
  revoked_at,
  revoked_by_admin_id,
  created_at,
  expires_at
FROM auth_tokens
WHERE user_id = <TARGET_USER_ID>
ORDER BY id DESC
LIMIT 30;

-- 11) Target user sessions after revoke-sessions
SELECT
  id,
  user_id,
  is_active,
  last_activity_at,
  created_at,
  expires_at,
  ended_at
FROM login_sessions
WHERE user_id = <TARGET_USER_ID>
ORDER BY id DESC
LIMIT 30;

-- 12) Specific session after end-session
SELECT
  id,
  user_id,
  admin_id,
  doctor_id,
  assistant_id,
  is_active,
  last_activity_at,
  created_at,
  expires_at,
  ended_at
FROM login_sessions
WHERE id = <TARGET_SESSION_ID>;

-- 13) Newly created admin by email
SELECT
  id,
  uuid,
  email,
  phone,
  admin_type,
  status,
  is_active,
  email_otp,
  email_otp_expiry,
  is_email_otp,
  created_at,
  updated_at
FROM admins
WHERE email = 'batch1.clinic.admin@example.com';

-- 14) Admin profile for current admin
SELECT
  ap.id,
  ap.admin_id,
  a.email,
  a.admin_type,
  ap.date_of_birth,
  ap.gender,
  ap.nationality,
  ap.profile_picture_url,
  ap.emergency_contact_phone,
  ap.timezone,
  ap.language_preference,
  ap.employment_status,
  ap.created_at,
  ap.updated_at
FROM admin_profiles ap
JOIN admins a ON a.id = ap.admin_id
WHERE ap.admin_id = <SUPER_ADMIN_ID>;

-- 15) Admin profile translations
SELECT
  apt.id,
  apt.profile_id,
  ap.admin_id,
  apt.language_code,
  apt.full_name,
  apt.job_title,
  apt.department,
  apt.emergency_contact_name,
  apt.emergency_contact_relationship
FROM admin_profile_translations apt
JOIN admin_profiles ap ON ap.id = apt.profile_id
WHERE ap.admin_id = <SUPER_ADMIN_ID>
ORDER BY apt.language_code;

-- 16) Profile picture file records uploaded by admin
SELECT
  id,
  uuid,
  uploaded_by_admin_id,
  related_to_type,
  related_to_id,
  file_category,
  original_filename,
  stored_filename,
  file_path,
  file_url,
  mime_type,
  file_size,
  is_public,
  is_deleted,
  created_at
FROM files
WHERE uploaded_by_admin_id = <SUPER_ADMIN_ID>
ORDER BY id DESC
LIMIT 20;

-- 17) Test admin active/deactivation status
SELECT
  id,
  uuid,
  email,
  admin_type,
  status,
  is_active,
  updated_at
FROM admins
WHERE id = <TEST_ADMIN_ID>;

-- 18) Dashboard sanity counts
SELECT COUNT(*) AS total_admins FROM admins;
SELECT COUNT(*) AS active_admin_tokens FROM auth_tokens WHERE admin_id IS NOT NULL AND is_revoked = 0 AND expires_at > NOW();
SELECT COUNT(*) AS active_admin_sessions FROM login_sessions WHERE admin_id IS NOT NULL AND is_active = 1 AND expires_at > NOW();
SELECT COUNT(*) AS active_blocks FROM blocked_entities WHERE is_active = 1;
SELECT COUNT(*) AS failed_admin_logins_24h FROM failed_logins WHERE entity_type = 'admin' AND attempted_at > DATE_SUB(NOW(), INTERVAL 24 HOUR);
