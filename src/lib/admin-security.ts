// ============================================================
// Admin Security Service — Batch 1
// Covers all /api/auth-admin/security/* and related endpoints.
// Source of truth: docs/admin-batch-1-auth-security-profile/01-admin-auth-security-profile-api-docs.md
//
// UI status per endpoint:
// - getAdminSessions       → Integrated in security settings page
// - getSecurityLogs        → Integrated in security settings page (separate from admin-logs)
// - getSecurityStats       → Integrated in security settings page (stats cards)
// - getSecurityAlerts      → Integrated in security settings page (alerts section)
// - getSystemSessions      → Service-only (deferred UI — any-admin, lower priority view)
// - getAdminLogs           → Integrated in security settings page
// - getFailedLogins        → Integrated in security settings page
// - getBlockedEntities     → Integrated in security settings page
// - blockEntity            → Integrated with confirmation modal (system_admin+)
// - unblockEntity          → Integrated with confirmation modal (system_admin+)
// - revokeEntitySessions   → Integrated with confirmation modal (system_admin+)
// - updateEntityStatus     → Integrated with confirmation modal (system_admin+)
// - endSession             → Integrated with confirmation modal (system_admin+)
// - registerAdmin          → Service-only (super_admin only — no safe public UI)
// - manualCleanup          → Service-only (super_admin only — destructive)
// ============================================================

import {
  apiGet,
  apiPost,
  buildQueryString,
} from './api';

import type {
  GetSessionsResponse,
  GetSecurityLogsResponse,
  GetSecurityStatsResponse,
  GetSecurityAlertsResponse,
  GetSystemSessionsResponse,
  AdminLogsParams,
  GetAdminLogsResponse,
  FailedLoginsParams,
  GetFailedLoginsResponse,
  BlockedEntitiesParams,
  GetBlockedEntitiesResponse,
  BlockEntityPayload,
  UnblockEntityPayload,
  RevokeSessionsPayload,
  UpdateEntityStatusPayload,
  EndSessionPayload,
  SecurityActionResponse,
  RegisterAdminPayload,
  RegisterAdminResponse,
  ManualCleanupResponse,
} from '@/types/admin-security';

// ---- Read-only: Any Admin ----

/**
 * GET /api/auth-admin/sessions
 * Returns active sessions for the currently authenticated admin.
 * Permission: Any Admin
 * UI: Integrated — Active Sessions table in security settings page
 */
export async function getAdminSessions(): Promise<GetSessionsResponse> {
  return apiGet<GetSessionsResponse>('/api/auth-admin/sessions');
}

/**
 * GET /api/auth-admin/security-logs
 * Returns security logs for the current admin.
 * NOTE: This is a separate endpoint from /security/admin-logs.
 * /security-logs is scoped to the current admin's own activity log,
 * while /security/admin-logs covers all admin actions with full filtering.
 * Permission: Any Admin
 * UI: Integrated — Security Logs tab in security settings page
 */
export async function getSecurityLogs(params?: { limit?: number }): Promise<GetSecurityLogsResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined | null>);
  return apiGet<GetSecurityLogsResponse>(`/api/auth-admin/security-logs${qs}`);
}

/**
 * GET /api/auth-admin/security/stats
 * Returns aggregated security statistics.
 * Permission: Any Admin
 * UI: Integrated — Stats cards in security settings page
 */
export async function getSecurityStats(): Promise<GetSecurityStatsResponse> {
  return apiGet<GetSecurityStatsResponse>('/api/auth-admin/security/stats');
}

/**
 * GET /api/auth-admin/security/alerts
 * Returns security alerts.
 * Permission: Any Admin
 * UI: Integrated — Alerts section in security settings page
 */
export async function getSecurityAlerts(): Promise<GetSecurityAlertsResponse> {
  return apiGet<GetSecurityAlertsResponse>('/api/auth-admin/security/alerts');
}

/**
 * GET /api/auth-admin/security/system-sessions
 * Returns system-wide sessions (all entities).
 * Permission: Any Admin
 * UI: Service-only — Lower-priority view. The primary sessions view uses
 *     /api/auth-admin/sessions. System sessions deferred to avoid redundancy.
 *     Can be integrated later as a separate "System Sessions" tab.
 */
export async function getSystemSessions(params?: {
  limit?: number;
  offset?: number;
  entityType?: string;
}): Promise<GetSystemSessionsResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined | null>);
  return apiGet<GetSystemSessionsResponse>(`/api/auth-admin/security/system-sessions${qs}`);
}

/**
 * GET /api/auth-admin/security/admin-logs
 * Returns admin action logs with full filtering and pagination.
 * Distinct from /security-logs: covers all admins, fully filterable.
 * Permission: Any Admin
 * UI: Integrated — Admin Logs table in security settings page
 */
export async function getAdminLogs(params?: AdminLogsParams): Promise<GetAdminLogsResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined | null>);
  return apiGet<GetAdminLogsResponse>(`/api/auth-admin/security/admin-logs${qs}`);
}

/**
 * GET /api/auth-admin/security/failed-logins
 * Returns failed login attempts.
 * Permission: Any Admin
 * UI: Integrated — Failed Logins table in security settings page
 */
export async function getFailedLogins(params?: FailedLoginsParams): Promise<GetFailedLoginsResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined | null>);
  return apiGet<GetFailedLoginsResponse>(`/api/auth-admin/security/failed-logins${qs}`);
}

/**
 * GET /api/auth-admin/security/blocked-entities
 * Returns currently or historically blocked entities.
 * Permission: Any Admin
 * UI: Integrated — Blocked Entities table in security settings page
 */
export async function getBlockedEntities(params?: BlockedEntitiesParams): Promise<GetBlockedEntitiesResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined | null>);
  return apiGet<GetBlockedEntitiesResponse>(`/api/auth-admin/security/blocked-entities${qs}`);
}

// ---- Actions: system_admin or super_admin ----

/**
 * POST /api/auth-admin/security/block-entity
 * Blocks a user, doctor, or assistant. entityType 'admin' is NOT accepted here.
 * Permission: system_admin or super_admin
 * UI: Integrated — confirmation modal with reason field in security settings page
 */
export async function blockEntity(payload: BlockEntityPayload): Promise<SecurityActionResponse> {
  return apiPost<SecurityActionResponse>('/api/auth-admin/security/block-entity', payload);
}

/**
 * POST /api/auth-admin/security/unblock-entity
 * Removes a block from a user, doctor, or assistant.
 * Permission: system_admin or super_admin
 * UI: Integrated — confirmation modal with reason field in security settings page
 */
export async function unblockEntity(payload: UnblockEntityPayload): Promise<SecurityActionResponse> {
  return apiPost<SecurityActionResponse>('/api/auth-admin/security/unblock-entity', payload);
}

/**
 * POST /api/auth-admin/security/revoke-sessions
 * Revokes all active sessions and tokens for a target entity.
 * Permission: system_admin or super_admin
 * UI: Integrated — confirmation modal with reason field in security settings page
 */
export async function revokeEntitySessions(payload: RevokeSessionsPayload): Promise<SecurityActionResponse> {
  return apiPost<SecurityActionResponse>('/api/auth-admin/security/revoke-sessions', payload);
}

/**
 * POST /api/auth-admin/security/update-entity-status
 * Updates an entity's account status (active/inactive/suspended).
 * Permission: system_admin or super_admin
 * UI: Integrated — confirmation modal with reason + status select in security settings page
 */
export async function updateEntityStatus(payload: UpdateEntityStatusPayload): Promise<SecurityActionResponse> {
  return apiPost<SecurityActionResponse>('/api/auth-admin/security/update-entity-status', payload);
}

/**
 * POST /api/auth-admin/security/end-session
 * Ends a single session by sessionId.
 * Permission: system_admin or super_admin
 * UI: Integrated — end-session action on session row in security settings page
 * Note: field name is 'sessionId' per docs. If backend returns validation error,
 * try 'sessionToken' — see API docs section 5.
 */
export async function endSession(payload: EndSessionPayload): Promise<SecurityActionResponse> {
  return apiPost<SecurityActionResponse>('/api/auth-admin/security/end-session', payload);
}

// ---- Super Admin Only ----

/**
 * POST /api/auth-admin/register
 * Creates a new admin account. super_admin only.
 * UI: Service-only — No direct UI exposed. Too sensitive to surface without
 *     a dedicated admin management page. Backend enforces 403 for non-super_admin.
 */
export async function registerAdmin(payload: RegisterAdminPayload): Promise<RegisterAdminResponse> {
  return apiPost<RegisterAdminResponse>('/api/auth-admin/register', payload);
}

/**
 * POST /api/auth-admin/security/manual-cleanup
 * Triggers manual security cleanup (expired tokens, sessions, failed attempts).
 * super_admin only. Destructive operation.
 * UI: Service-only — No direct UI. Exposed only programmatically.
 *     Backend enforces 403 for non-super_admin.
 */
export async function manualCleanup(): Promise<ManualCleanupResponse> {
  return apiPost<ManualCleanupResponse>('/api/auth-admin/security/manual-cleanup', {});
}
