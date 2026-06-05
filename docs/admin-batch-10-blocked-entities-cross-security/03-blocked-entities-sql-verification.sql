-- Batch 10 SQL Verification
-- Blocked Entities + Cross-Security Testing

-- =========================================================
-- 0. Test variables
-- =========================================================
SET @target_user_id = 1;
SET @target_doctor_id = 1;
SET @target_assistant_id = 1;
SET @target_admin_id = 2;
SET @block_id = 1;

-- =========================================================
-- 1. Find safe test entities
-- =========================================================

SELECT
  id,
  uuid,
  email,
  phone,
  status,
  is_active,
  last_login_at,
  last_activity_at,
  created_at,
  updated_at
FROM users
ORDER BY id DESC
LIMIT 50;

SELECT
  id,
  uuid,
  email,
  phone,
  status,
  is_active,
  last_login_at,
  last_activity_at,
  created_at,
  updated_at
FROM doctors
ORDER BY id DESC
LIMIT 50;

SELECT
  id,
  uuid,
  email,
  phone,
  status,
  is_active,
  last_login_at,
  last_activity_at,
  created_at,
  updated_at
FROM assistants
ORDER BY id DESC
LIMIT 50;

SELECT
  id,
  uuid,
  email,
  phone,
  admin_type,
  status,
  is_active,
  last_login_at,
  last_activity_at,
  created_at,
  updated_at
FROM admins
ORDER BY id DESC
LIMIT 50;

-- =========================================================
-- 2. Blocked entities raw view
-- =========================================================

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
ORDER BY id DESC
LIMIT 100;

-- Active blocks only
SELECT
  id,
  CASE
    WHEN blocked_user_id IS NOT NULL THEN 'user'
    WHEN blocked_doctor_id IS NOT NULL THEN 'doctor'
    WHEN blocked_assistant_id IS NOT NULL THEN 'assistant'
    WHEN blocked_admin_id IS NOT NULL THEN 'admin'
  END AS entity_type,
  COALESCE(blocked_user_id, blocked_doctor_id, blocked_assistant_id, blocked_admin_id) AS entity_id,
  blocked_by_admin_id,
  block_type,
  blocked_until,
  reason,
  is_active,
  created_at
FROM blocked_entities
WHERE is_active = 1
ORDER BY created_at DESC;

-- Specific user block history
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
WHERE blocked_user_id = @target_user_id
ORDER BY created_at DESC;

-- Specific doctor block history
SELECT
  id,
  blocked_doctor_id,
  blocked_by_admin_id,
  block_type,
  blocked_until,
  reason,
  is_active,
  created_at,
  removed_at,
  removed_by_admin_id
FROM blocked_entities
WHERE blocked_doctor_id = @target_doctor_id
ORDER BY created_at DESC;

-- Specific admin block history
SELECT
  id,
  blocked_admin_id,
  blocked_by_admin_id,
  block_type,
  blocked_until,
  reason,
  is_active,
  created_at,
  removed_at,
  removed_by_admin_id
FROM blocked_entities
WHERE blocked_admin_id = @target_admin_id
ORDER BY created_at DESC;

-- =========================================================
-- 3. Statistics matching API
-- =========================================================

SELECT
  COUNT(*) AS total_blocks,
  COUNT(CASE WHEN is_active = 1 THEN 1 END) AS active_blocks,
  COUNT(CASE WHEN is_active = 0 THEN 1 END) AS removed_blocks,
  COUNT(CASE WHEN blocked_user_id IS NOT NULL AND is_active = 1 THEN 1 END) AS blocked_users,
  COUNT(CASE WHEN blocked_doctor_id IS NOT NULL AND is_active = 1 THEN 1 END) AS blocked_doctors,
  COUNT(CASE WHEN blocked_assistant_id IS NOT NULL AND is_active = 1 THEN 1 END) AS blocked_assistants,
  COUNT(CASE WHEN blocked_admin_id IS NOT NULL AND is_active = 1 THEN 1 END) AS blocked_admins,
  COUNT(CASE WHEN block_type = 'temporary' AND is_active = 1 THEN 1 END) AS temporary_blocks,
  COUNT(CASE WHEN block_type = 'permanent' AND is_active = 1 THEN 1 END) AS permanent_blocks,
  COUNT(CASE WHEN block_type = 'warning' AND is_active = 1 THEN 1 END) AS warning_blocks,
  COUNT(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) AS blocks_last_week,
  COUNT(CASE WHEN created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) AS blocks_last_month,
  COUNT(CASE WHEN removed_at > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) AS unblocks_last_week,
  COUNT(CASE WHEN block_type = 'temporary'
              AND is_active = 1
              AND blocked_until BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
       THEN 1 END) AS expiring_soon
FROM blocked_entities;

SELECT
  a.id,
  a.email,
  a.admin_type,
  COUNT(be.id) AS block_count
FROM blocked_entities be
JOIN admins a ON be.blocked_by_admin_id = a.id
WHERE be.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY a.id, a.email, a.admin_type
ORDER BY block_count DESC
LIMIT 5;

-- =========================================================
-- 4. Check block status query equivalent
-- =========================================================

SELECT
  be.*,
  a.email AS blocked_by_email
FROM blocked_entities be
LEFT JOIN admins a ON be.blocked_by_admin_id = a.id
WHERE be.blocked_user_id = @target_user_id
  AND be.is_active = 1;

SELECT
  be.*,
  a.email AS blocked_by_email
FROM blocked_entities be
LEFT JOIN admins a ON be.blocked_by_admin_id = a.id
WHERE be.blocked_doctor_id = @target_doctor_id
  AND be.is_active = 1;

-- =========================================================
-- 5. Cross-security status verification
-- =========================================================

-- User account status
SELECT
  id,
  email,
  status,
  is_active,
  last_login_at,
  last_activity_at,
  updated_at
FROM users
WHERE id = @target_user_id;

-- Doctor account status
SELECT
  id,
  email,
  status,
  is_active,
  last_login_at,
  last_activity_at,
  updated_at
FROM doctors
WHERE id = @target_doctor_id;

-- Admin account status
SELECT
  id,
  email,
  admin_type,
  status,
  is_active,
  last_login_at,
  last_activity_at,
  updated_at
FROM admins
WHERE id = @target_admin_id;

-- Auth tokens for target user
SELECT
  id,
  user_id,
  token_type,
  expires_at,
  is_revoked,
  revoked_at,
  revoked_by_admin_id,
  ip_address,
  created_at
FROM auth_tokens
WHERE user_id = @target_user_id
ORDER BY id DESC
LIMIT 50;

-- Auth tokens for target doctor
SELECT
  id,
  doctor_id,
  token_type,
  expires_at,
  is_revoked,
  revoked_at,
  revoked_by_admin_id,
  ip_address,
  created_at
FROM auth_tokens
WHERE doctor_id = @target_doctor_id
ORDER BY id DESC
LIMIT 50;

-- Auth tokens for target admin
SELECT
  id,
  admin_id,
  token_type,
  expires_at,
  is_revoked,
  revoked_at,
  revoked_by_admin_id,
  ip_address,
  created_at
FROM auth_tokens
WHERE admin_id = @target_admin_id
ORDER BY id DESC
LIMIT 50;

-- Login sessions for target user
SELECT
  id,
  user_id,
  session_token,
  ip_address,
  device_type,
  browser,
  operating_system,
  is_active,
  expires_at,
  last_activity_at,
  ended_at,
  created_at
FROM login_sessions
WHERE user_id = @target_user_id
ORDER BY id DESC
LIMIT 50;

-- Login sessions for target doctor
SELECT
  id,
  doctor_id,
  session_token,
  ip_address,
  device_type,
  browser,
  operating_system,
  is_active,
  expires_at,
  last_activity_at,
  ended_at,
  created_at
FROM login_sessions
WHERE doctor_id = @target_doctor_id
ORDER BY id DESC
LIMIT 50;

-- Login sessions for target admin
SELECT
  id,
  admin_id,
  session_token,
  ip_address,
  device_type,
  browser,
  operating_system,
  is_active,
  expires_at,
  last_activity_at,
  ended_at,
  created_at
FROM login_sessions
WHERE admin_id = @target_admin_id
ORDER BY id DESC
LIMIT 50;

-- =========================================================
-- 6. Admin logs
-- =========================================================

SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  description,
  old_values,
  new_values,
  ip_address,
  user_agent,
  severity,
  created_at
FROM admin_logs
WHERE action IN (
  'BLOCK_ENTITY',
  'UNBLOCK_ENTITY',
  'UPDATE_BLOCK',
  'BULK_BLOCK_ENTITIES',
  'BULK_UNBLOCK_ENTITIES',
  'AUTO_UNBLOCK_EXPIRED'
)
ORDER BY id DESC
LIMIT 100;

-- Logs for a target user
SELECT
  id,
  admin_id,
  action,
  target_type,
  target_id,
  old_values,
  new_values,
  created_at
FROM admin_logs
WHERE target_type = 'user'
  AND target_id = @target_user_id
ORDER BY id DESC
LIMIT 50;

-- =========================================================
-- 7. Failed logins after blocking
-- =========================================================

SELECT
  id,
  email,
  ip_address,
  user_agent,
  entity_type,
  failure_reason,
  created_at
FROM failed_logins
ORDER BY id DESC
LIMIT 100;

-- Failed logins for target email
-- Replace email.
SELECT
  id,
  email,
  entity_type,
  failure_reason,
  ip_address,
  created_at
FROM failed_logins
WHERE email = 'target@example.com'
ORDER BY id DESC
LIMIT 50;

-- =========================================================
-- 8. Expired temporary blocks
-- =========================================================

SELECT
  id,
  CASE
    WHEN blocked_user_id IS NOT NULL THEN 'user'
    WHEN blocked_doctor_id IS NOT NULL THEN 'doctor'
    WHEN blocked_assistant_id IS NOT NULL THEN 'assistant'
    WHEN blocked_admin_id IS NOT NULL THEN 'admin'
  END AS entity_type,
  COALESCE(blocked_user_id, blocked_doctor_id, blocked_assistant_id, blocked_admin_id) AS entity_id,
  block_type,
  blocked_until,
  is_active,
  created_at
FROM blocked_entities
WHERE block_type = 'temporary'
  AND is_active = 1
  AND blocked_until IS NOT NULL
  AND blocked_until < NOW()
ORDER BY blocked_until ASC;

-- Dev-only helper: expire a temporary block for testing auto-unblock
-- WARNING: use only in local/dev test DB.
-- UPDATE blocked_entities
-- SET blocked_until = DATE_SUB(NOW(), INTERVAL 1 HOUR)
-- WHERE id = @block_id
--   AND block_type = 'temporary'
--   AND is_active = 1;

-- =========================================================
-- 9. Cleanup / restore helpers for local development only
-- =========================================================

-- Restore test user manually if a test got interrupted.
-- WARNING: local/dev only.
-- UPDATE blocked_entities
-- SET is_active = 0,
--     removed_at = NOW(),
--     removed_by_admin_id = 1
-- WHERE blocked_user_id = @target_user_id
--   AND is_active = 1;
--
-- UPDATE users
-- SET status = 'active',
--     updated_at = NOW()
-- WHERE id = @target_user_id;

-- Restore test doctor manually if needed.
-- UPDATE blocked_entities
-- SET is_active = 0,
--     removed_at = NOW(),
--     removed_by_admin_id = 1
-- WHERE blocked_doctor_id = @target_doctor_id
--   AND is_active = 1;
--
-- UPDATE doctors
-- SET status = 'active',
--     updated_at = NOW()
-- WHERE id = @target_doctor_id;
