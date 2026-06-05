-- Batch 9 SQL Verification
-- Admin AI Usage

-- =========================================================
-- 1. Policies
-- =========================================================

SELECT
  id,
  policy_name,
  scope_type,
  user_id,
  package_id,
  max_total_requests_per_month,
  max_chat_messages_per_month,
  max_image_analyses_per_month,
  max_document_analyses_per_month,
  max_files_per_session,
  max_tokens_per_request,
  is_active,
  priority,
  created_by_admin_id,
  updated_by_admin_id,
  created_at,
  updated_at
FROM ai_usage_policies
ORDER BY is_active DESC, priority ASC, created_at DESC, id DESC;

-- Latest policies only
SELECT
  id,
  policy_name,
  scope_type,
  user_id,
  package_id,
  is_active,
  priority,
  created_at,
  updated_at
FROM ai_usage_policies
ORDER BY id DESC
LIMIT 20;

-- Active policies by scope
SELECT
  scope_type,
  is_active,
  COUNT(*) AS count
FROM ai_usage_policies
GROUP BY scope_type, is_active
ORDER BY scope_type ASC, is_active DESC;

-- Effective active policy for a user according to current AIUsageService
-- Replace @user_id.
SET @user_id = 1;

SELECT *
FROM ai_usage_policies
WHERE is_active = 1
  AND (
    (scope_type = 'user' AND user_id = @user_id)
    OR scope_type = 'global'
  )
ORDER BY
  CASE
    WHEN scope_type = 'user' THEN 1
    WHEN scope_type = 'global' THEN 2
    ELSE 3
  END,
  priority ASC,
  id DESC
LIMIT 1;

-- Package policies exist but are not used by current AIUsageService lookup
SELECT *
FROM ai_usage_policies
WHERE scope_type = 'package'
ORDER BY is_active DESC, priority ASC, id DESC;

-- Detect multiple active global policies
SELECT
  scope_type,
  is_active,
  COUNT(*) AS count
FROM ai_usage_policies
WHERE scope_type = 'global'
  AND is_active = 1
GROUP BY scope_type, is_active;

-- =========================================================
-- 2. Counters
-- =========================================================

-- Current month counters
SELECT
  user_id,
  period_type,
  period_key,
  total_requests,
  chat_messages_count,
  image_analyses_count,
  document_analyses_count,
  tokens_used,
  last_request_at,
  created_at,
  updated_at
FROM ai_usage_counters
WHERE period_type = 'monthly'
  AND period_key = DATE_FORMAT(CURDATE(), '%Y-%m')
ORDER BY updated_at DESC, user_id ASC;

-- Counters for specific user
SELECT
  user_id,
  period_type,
  period_key,
  total_requests,
  chat_messages_count,
  image_analyses_count,
  document_analyses_count,
  tokens_used,
  last_request_at,
  created_at,
  updated_at
FROM ai_usage_counters
WHERE user_id = @user_id
ORDER BY period_key DESC, period_type ASC
LIMIT 24;

-- Overview counters for a period
SET @period_key = DATE_FORMAT(CURDATE(), '%Y-%m');

SELECT
  COUNT(DISTINCT user_id) AS active_users,
  COALESCE(SUM(total_requests), 0) AS total_requests,
  COALESCE(SUM(chat_messages_count), 0) AS chat_messages_count,
  COALESCE(SUM(image_analyses_count), 0) AS image_analyses_count,
  COALESCE(SUM(document_analyses_count), 0) AS document_analyses_count,
  COALESCE(SUM(tokens_used), 0) AS tokens_used
FROM ai_usage_counters
WHERE period_type = 'monthly'
  AND period_key = @period_key;

-- =========================================================
-- 3. Usage Events
-- =========================================================

-- Latest events
SELECT
  e.id,
  e.user_id,
  u.email,
  e.ai_session_id,
  s.uuid AS ai_session_uuid,
  e.ai_result_id,
  r.uuid AS ai_result_uuid,
  r.result_type,
  e.event_type,
  e.status,
  e.counted_units,
  e.prompt_tokens,
  e.completion_tokens,
  e.total_tokens,
  e.metadata,
  e.created_at
FROM ai_usage_events e
LEFT JOIN users u ON u.id = e.user_id
LEFT JOIN ai_sessions s ON s.id = e.ai_session_id
LEFT JOIN ai_analysis_results r ON r.id = e.ai_result_id
ORDER BY e.created_at DESC, e.id DESC
LIMIT 50;

-- Events by type/status this month
SELECT
  event_type,
  status,
  COUNT(*) AS events_count,
  COALESCE(SUM(counted_units), 0) AS counted_units,
  COALESCE(SUM(total_tokens), 0) AS total_tokens
FROM ai_usage_events
WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
GROUP BY event_type, status
ORDER BY event_type, status;

-- Blocked events
SELECT
  id,
  user_id,
  event_type,
  status,
  metadata,
  created_at
FROM ai_usage_events
WHERE status IN ('blocked_limit', 'blocked_safety')
ORDER BY id DESC
LIMIT 50;

-- Events for specific user
SELECT
  id,
  ai_session_id,
  ai_result_id,
  event_type,
  status,
  counted_units,
  prompt_tokens,
  completion_tokens,
  total_tokens,
  metadata,
  created_at
FROM ai_usage_events
WHERE user_id = @user_id
ORDER BY created_at DESC, id DESC
LIMIT 50;

-- =========================================================
-- 4. Provider Logs
-- =========================================================

-- Same query shape as Admin overview provider_summary
SELECT
  provider,
  model,
  request_type,
  status,
  COUNT(*) AS requests_count,
  COALESCE(SUM(total_tokens), 0) AS total_tokens,
  ROUND(AVG(latency_ms), 2) AS avg_latency_ms
FROM ai_provider_logs
GROUP BY provider, model, request_type, status
ORDER BY requests_count DESC
LIMIT 20;

-- Provider logs for current month
SELECT
  provider,
  model,
  request_type,
  status,
  COUNT(*) AS requests_count,
  COALESCE(SUM(total_tokens), 0) AS total_tokens,
  ROUND(AVG(latency_ms), 2) AS avg_latency_ms
FROM ai_provider_logs
WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
GROUP BY provider, model, request_type, status
ORDER BY requests_count DESC;

-- Latest provider logs
SELECT
  id,
  ai_session_id,
  user_id,
  provider,
  model,
  request_type,
  prompt_tokens,
  completion_tokens,
  total_tokens,
  latency_ms,
  status,
  error_message,
  created_at
FROM ai_provider_logs
ORDER BY id DESC
LIMIT 50;

-- =========================================================
-- 5. Admin Logs for AI Usage Policies
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
WHERE target_type = 'AIUsagePolicy'
ORDER BY id DESC
LIMIT 50;

-- Action counts
SELECT
  action,
  severity,
  COUNT(*) AS count
FROM admin_logs
WHERE target_type = 'AIUsagePolicy'
GROUP BY action, severity
ORDER BY count DESC;

-- =========================================================
-- 6. User-facing usage calculation helper
-- =========================================================

-- Replace @user_id if needed.
SELECT
  c.user_id,
  c.period_type,
  c.period_key,
  p.id AS policy_id,
  p.policy_name,
  p.scope_type,
  p.max_total_requests_per_month,
  p.max_chat_messages_per_month,
  p.max_image_analyses_per_month,
  p.max_document_analyses_per_month,
  p.max_files_per_session,
  p.max_tokens_per_request,
  c.total_requests,
  c.chat_messages_count,
  c.image_analyses_count,
  c.document_analyses_count,
  c.tokens_used,
  GREATEST(p.max_total_requests_per_month - c.total_requests, 0) AS remaining_total_requests,
  GREATEST(p.max_chat_messages_per_month - c.chat_messages_count, 0) AS remaining_chat_messages,
  GREATEST(p.max_image_analyses_per_month - c.image_analyses_count, 0) AS remaining_image_analyses,
  GREATEST(p.max_document_analyses_per_month - c.document_analyses_count, 0) AS remaining_document_analyses
FROM ai_usage_counters c
JOIN (
  SELECT *
  FROM ai_usage_policies
  WHERE is_active = 1
    AND (
      (scope_type = 'user' AND user_id = @user_id)
      OR scope_type = 'global'
    )
  ORDER BY
    CASE
      WHEN scope_type = 'user' THEN 1
      WHEN scope_type = 'global' THEN 2
      ELSE 3
    END,
    priority ASC,
    id DESC
  LIMIT 1
) p
WHERE c.user_id = @user_id
  AND c.period_type = 'monthly'
  AND c.period_key = DATE_FORMAT(CURDATE(), '%Y-%m');

-- =========================================================
-- 7. Support queries
-- =========================================================

-- Find admins
SELECT
  id,
  uuid,
  email,
  admin_type,
  status,
  is_active,
  created_at
FROM admins
ORDER BY id DESC
LIMIT 20;

-- Find users
SELECT
  u.id,
  u.uuid,
  u.email,
  u.phone,
  u.status,
  u.is_active,
  ucp.full_name,
  ucp.profile_picture_url
FROM users u
LEFT JOIN user_complete_profiles ucp
  ON ucp.id = u.id
ORDER BY u.id DESC
LIMIT 50;

-- Find packages if package policies are being tested
SELECT
  id,
  uuid,
  name,
  price,
  duration_days,
  is_active,
  created_at
FROM packages
ORDER BY id DESC
LIMIT 50;
