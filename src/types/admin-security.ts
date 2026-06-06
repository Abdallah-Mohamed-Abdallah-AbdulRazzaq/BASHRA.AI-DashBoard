// ============================================================
// Admin Security Types — Batch 1
// Based on: docs/admin-batch-1-auth-security-profile/01-admin-auth-security-profile-api-docs.md
// ============================================================

// ---- Pagination ----

export type SecurityPagination = {
  total?: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
};

// ---- Sessions ----

export type AdminSessionEntry = {
  id: number;
  admin_id?: number | null;
  user_id?: number | null;
  doctor_id?: number | null;
  assistant_id?: number | null;
  is_active: boolean | number;
  ip_address?: string | null;
  browser?: string | null;
  operating_system?: string | null;
  device_type?: string | null;
  created_at: string;
  expires_at?: string | null;
  ended_at?: string | null;
  last_activity_at?: string | null;
};

export type GetSessionsResponse = {
  success: true;
  sessions: AdminSessionEntry[];
};

export type GetSystemSessionsResponse = {
  success: true;
  sessions: AdminSessionEntry[];
  pagination?: SecurityPagination;
};

// ---- Security Logs ----

export type SecurityLogEntry = {
  id: number;
  admin_id?: number | null;
  action: string;
  description?: string | null;
  ip_address?: string | null;
  created_at: string;
  [key: string]: unknown;
};

export type GetSecurityLogsResponse = {
  success: true;
  logs: SecurityLogEntry[];
  pagination?: SecurityPagination;
};

// ---- Security Stats ----

export type AdminStats = {
  totalAdminActions: number;
  last24hActions: number;
  highSeverityActions: number;
  suspiciousIPs: number;
};

export type SecurityStats = {
  adminStats: AdminStats;
  [key: string]: unknown;
};

export type GetSecurityStatsResponse = {
  success: true;
  stats: SecurityStats;
};

// ---- Security Alerts ----

export type SecurityAlert = {
  id?: number;
  type?: string;
  severity?: string;
  message?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type GetSecurityAlertsResponse = {
  success: true;
  alerts: SecurityAlert[];
};

// ---- Admin Logs ----

export type AdminLogEntry = {
  id: number;
  admin_id: number;
  action: string;
  target_type?: string | null;
  target_id?: number | null;
  description?: string | null;
  severity?: string | null;
  ip_address?: string | null;
  created_at: string;
  [key: string]: unknown;
};

export type AdminLogsParams = {
  limit?: number;
  offset?: number;
  adminId?: number;
  action?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
};

export type GetAdminLogsResponse = {
  success: true;
  logs: AdminLogEntry[];
  pagination: SecurityPagination;
};

// ---- Failed Logins ----

export type FailedLoginEntry = {
  id: number;
  email?: string | null;
  entity_type?: string | null;
  failure_reason?: string | null;
  ip_address?: string | null;
  attempted_at: string;
  [key: string]: unknown;
};

export type FailedLoginStat = {
  email?: string;
  count?: number;
  [key: string]: unknown;
};

export type FailedLoginsParams = {
  limit?: number;
  offset?: number;
  email?: string;
  ipAddress?: string;
  entityType?: string;
  hours?: number;
};

export type GetFailedLoginsResponse = {
  success: true;
  attempts: FailedLoginEntry[];
  stats: FailedLoginStat[];
  pagination: Pick<SecurityPagination, 'limit' | 'offset'>;
};

// ---- Blocked Entities ----

export type BlockedEntityEntry = {
  id: number;
  blocked_user_id?: number | null;
  blocked_doctor_id?: number | null;
  blocked_assistant_id?: number | null;
  blocked_by_admin_id?: number | null;
  entity_type?: string | null;
  block_type?: 'temporary' | 'permanent' | string;
  blocked_until?: string | null;
  reason?: string | null;
  is_active: boolean | number;
  removed_at?: string | null;
  removed_by_admin_id?: number | null;
  created_at: string;
  [key: string]: unknown;
};

export type BlockedEntitiesParams = {
  limit?: number;
  offset?: number;
  entityType?: string;
  isActive?: boolean;
};

export type GetBlockedEntitiesResponse = {
  success: true;
  blockedEntities: BlockedEntityEntry[];
  pagination: Pick<SecurityPagination, 'limit' | 'offset'>;
};

// ---- Security Action Payloads ----

export type BlockEntityPayload = {
  targetId: number;
  entityType: 'user' | 'doctor' | 'assistant';
  blockType: 'temporary' | 'permanent';
  blockedUntil?: string;
  reason: string;
};

export type UnblockEntityPayload = {
  targetId: number;
  entityType: 'user' | 'doctor' | 'assistant';
  reason: string;
};

export type RevokeSessionsPayload = {
  targetId: number;
  entityType: 'user' | 'doctor' | 'assistant' | 'admin';
  reason: string;
};

export type UpdateEntityStatusPayload = {
  targetId: number;
  entityType: 'user' | 'doctor' | 'assistant' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  reason: string;
};

export type EndSessionPayload = {
  sessionId: number;
  reason: string;
};

export type SecurityActionResponse = {
  success: true;
  message?: string;
  message_ar?: string;
  message_en?: string;
};

// ---- Register Admin ----

export type RegisterAdminPayload = {
  email: string;
  phone?: string;
  password: string;
  adminType: 'super_admin' | 'system_admin' | 'clinic_admin';
  full_name: string;
  language_code?: string;
};

export type RegisterAdminResponse = {
  success: true;
  message_en?: string;
  message_ar?: string;
  userId: number;
  profileId?: number | null;
  uuid: string;
  requiresVerification?: {
    email: boolean;
    phone: boolean;
  };
};

// ---- Manual Cleanup ----

export type ManualCleanupResponse = {
  success: true;
  message?: string;
  stats?: Record<string, unknown>;
};
