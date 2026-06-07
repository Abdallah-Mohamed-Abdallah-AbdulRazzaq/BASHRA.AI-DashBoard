"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Shield, AlertTriangle, Activity, 
  RefreshCw, Loader2,
  Ban, Unlock, LogOut, Settings, X, CheckCircle,
  Clock, Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiErrorMessage, isForbiddenError } from "@/lib/error-utils";
import { getStoredAdmin } from "@/lib/api";
import type { AdminSession, AdminType } from "@/types/api";
import {
  getSecurityStats,
  getAdminSessions,
  getAdminLogs,
  getFailedLogins,
  getBlockedEntities,
  getSecurityAlerts,
  getSecurityLogs,
  blockEntity,
  unblockEntity,
  revokeEntitySessions,
  updateEntityStatus,
  endSession,
} from "@/lib/admin-security";
import type {
  SecurityStats,
  AdminSessionEntry,
  AdminLogEntry,
  FailedLoginEntry,
  BlockedEntityEntry,
  SecurityAlert,
  SecurityLogEntry,
  BlockEntityPayload,
  UnblockEntityPayload,
  RevokeSessionsPayload,
  UpdateEntityStatusPayload,
  EndSessionPayload,
} from "@/types/admin-security";

// ── Permission helpers ──────────────────────────────────────────────
function canPerformActions(adminType?: AdminType | string): boolean {
  return adminType === 'super_admin' || adminType === 'system_admin';
}

// ── Confirmation Modal ─────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  requireReason?: boolean;
  reasonLabel?: string;
  extraField?: React.ReactNode;
  loading: boolean;
  error: string | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

function ConfirmModal({
  isOpen, title, description, requireReason = true, reasonLabel = "Reason",
  extraField, loading, error, onConfirm, onCancel, confirmLabel = "Confirm", danger = true
}: ConfirmModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && reason.trim().length < 3) return;
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[480px] overflow-hidden">
        {/* Header */}
        <div className={cn("flex items-center justify-between px-6 py-4 border-b", danger ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100")}>
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className={danger ? "text-red-500" : "text-blue-500"} />
            <h3 className="text-[15px] font-bold text-[#0A1B39]">{title}</h3>
          </div>
          <button onClick={onCancel} disabled={loading} className="text-[#9DA4B0] hover:text-[#0A1B39] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-[13px] text-[#6C7688] leading-relaxed">{description}</p>

          {extraField && (
            <div className="flex flex-col gap-1.5">{extraField}</div>
          )}

          {requireReason && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">
                {reasonLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter a reason (required)..."
                rows={3}
                className="w-full px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] resize-none"
              />
              {reason.trim().length > 0 && reason.trim().length < 3 && (
                <p className="text-[11px] text-red-500">Reason must be at least 3 characters</p>
              )}
            </div>
          )}

          {error && (
            <div role="alert" className="w-full rounded-[6px] border border-red-300 bg-red-50 px-3 py-2">
              <p className="text-[12px] text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E7E8EB] bg-[#FAFBFC] flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-[13px] font-medium text-[#0A1B39] bg-[#F5F6F8] hover:bg-[#E7E8EB] rounded-[6px] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (requireReason && reason.trim().length < 3)}
            className={cn(
              "px-4 py-2 text-[13px] font-bold text-white rounded-[6px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
              danger ? "bg-red-600 hover:bg-red-700" : "bg-[#2E37A4] hover:bg-[#252D88]"
            )}
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0", color)}>
        {icon}
      </div>
      <div>
        <p className="text-[24px] font-bold text-[#0A1B39]">{value}</p>
        <p className="text-[12px] text-[#6C7688] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Section Wrapper ────────────────────────────────────────────────

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
}

function Section({ title, icon, loading, error, onRetry, empty, emptyText, children }: SectionProps) {
  return (
    <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E8EB]">
        <div className="flex items-center gap-2">
          <span className="text-[#2E37A4]">{icon}</span>
          <h3 className="text-[14px] font-bold text-[#0A1B39]">{title}</h3>
        </div>
        {!loading && (
          <button onClick={onRetry} className="p-1.5 rounded-[6px] text-[#9DA4B0] hover:text-[#2E37A4] hover:bg-[#F5F6F8] transition-colors" aria-label="Refresh">
            <RefreshCw size={14} />
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-[#2E37A4]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-10 px-5">
            <AlertTriangle size={24} className="text-red-400" />
            <p className="text-[13px] text-red-500 text-center">{error}</p>
            <button onClick={onRetry} className="text-[12px] text-[#2E37A4] font-medium hover:underline">Retry</button>
          </div>
        ) : empty ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <CheckCircle size={24} className="text-green-400" />
            <p className="text-[13px] text-[#6C7688]">{emptyText}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// ── Tab-based table headers ────────────────────────────────────────

type ActiveTab = 'sessions' | 'admin-logs' | 'failed-logins' | 'blocked' | 'alerts' | 'security-logs';

// ── Main Component ─────────────────────────────────────────────────

interface SecuritySettingsViewProps {
  t: Record<string, Record<string, string>>;
}

export default function SecuritySettingsView({ t }: SecuritySettingsViewProps) {
  const storedAdmin = getStoredAdmin<AdminSession>();
  const isSystemAdmin = canPerformActions(storedAdmin?.admin_type);

  const [activeTab, setActiveTab] = useState<ActiveTab>('sessions');

  // Stats
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Sessions
  const [sessions, setSessions] = useState<AdminSessionEntry[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  // Admin Logs
  const [adminLogs, setAdminLogs] = useState<AdminLogEntry[]>([]);
  const [adminLogsLoading, setAdminLogsLoading] = useState(false);
  const [adminLogsError, setAdminLogsError] = useState<string | null>(null);

  // Failed Logins
  const [failedLogins, setFailedLogins] = useState<FailedLoginEntry[]>([]);
  const [failedLoginsLoading, setFailedLoginsLoading] = useState(false);
  const [failedLoginsError, setFailedLoginsError] = useState<string | null>(null);

  // Blocked Entities
  const [blockedEntities, setBlockedEntities] = useState<BlockedEntityEntry[]>([]);
  const [blockedLoading, setBlockedLoading] = useState(false);
  const [blockedError, setBlockedError] = useState<string | null>(null);

  // Alerts
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  // Security Logs
  const [securityLogs, setSecurityLogs] = useState<SecurityLogEntry[]>([]);
  const [securityLogsLoading, setSecurityLogsLoading] = useState(false);
  const [securityLogsError, setSecurityLogsError] = useState<string | null>(null);

  // Action modal state
  type ModalType = 
    | { type: 'block' }
    | { type: 'unblock'; entity: BlockedEntityEntry }
    | { type: 'revoke'; targetId: number; entityType: string }
    | { type: 'end-session'; sessionId: number }
    | { type: 'update-status'; targetId: number; entityType: string }
    | null;

  const [modal, setModal] = useState<ModalType>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Block form
  const [blockForm, setBlockForm] = useState({
    targetId: '',
    entityType: 'user' as 'user' | 'doctor' | 'assistant',
    blockType: 'temporary' as 'temporary' | 'permanent',
    blockedUntil: '',
  });
  const [statusForm, setStatusForm] = useState<{ status: 'active' | 'inactive' | 'suspended' }>({ status: 'active' });

  // ── Loaders ────────────────────────────────────────────────────

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await getSecurityStats();
      setStats(res.stats);
    } catch (err) {
      setStatsError(getApiErrorMessage(err));
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const res = await getAdminSessions();
      setSessions(Array.isArray(res.sessions) ? res.sessions : []);
    } catch (err) {
      setSessionsError(isForbiddenError(err) ? 'Permission denied.' : getApiErrorMessage(err));
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const loadAdminLogs = useCallback(async () => {
    setAdminLogsLoading(true);
    setAdminLogsError(null);
    try {
      const res = await getAdminLogs({ limit: 50, offset: 0 });
      setAdminLogs(Array.isArray(res.logs) ? res.logs : []);
    } catch (err) {
      setAdminLogsError(isForbiddenError(err) ? 'Permission denied.' : getApiErrorMessage(err));
    } finally {
      setAdminLogsLoading(false);
    }
  }, []);

  const loadFailedLogins = useCallback(async () => {
    setFailedLoginsLoading(true);
    setFailedLoginsError(null);
    try {
      const res = await getFailedLogins({ limit: 50, offset: 0 });
      setFailedLogins(Array.isArray(res.attempts) ? res.attempts : []);
    } catch (err) {
      setFailedLoginsError(isForbiddenError(err) ? 'Permission denied.' : getApiErrorMessage(err));
    } finally {
      setFailedLoginsLoading(false);
    }
  }, []);

  const loadBlockedEntities = useCallback(async () => {
    setBlockedLoading(true);
    setBlockedError(null);
    try {
      const res = await getBlockedEntities({ limit: 50, offset: 0 });
      setBlockedEntities(Array.isArray(res.blockedEntities) ? res.blockedEntities : []);
    } catch (err) {
      setBlockedError(isForbiddenError(err) ? 'Permission denied.' : getApiErrorMessage(err));
    } finally {
      setBlockedLoading(false);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    setAlertsLoading(true);
    setAlertsError(null);
    try {
      const res = await getSecurityAlerts();
      setAlerts(Array.isArray(res.alerts) ? res.alerts : []);
    } catch (err) {
      setAlertsError(getApiErrorMessage(err));
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  const loadSecurityLogs = useCallback(async () => {
    setSecurityLogsLoading(true);
    setSecurityLogsError(null);
    try {
      const res = await getSecurityLogs({ limit: 50 });
      setSecurityLogs(Array.isArray(res.logs) ? res.logs : []);
    } catch (err) {
      setSecurityLogsError(getApiErrorMessage(err));
    } finally {
      setSecurityLogsLoading(false);
    }
  }, []);

  // Load stats on mount always
  useEffect(() => { loadStats(); }, [loadStats]);

  // Load tab data on tab switch
  useEffect(() => {
    if (activeTab === 'sessions') loadSessions();
    else if (activeTab === 'admin-logs') loadAdminLogs();
    else if (activeTab === 'failed-logins') loadFailedLogins();
    else if (activeTab === 'blocked') loadBlockedEntities();
    else if (activeTab === 'alerts') loadAlerts();
    else if (activeTab === 'security-logs') loadSecurityLogs();
  }, [activeTab, loadSessions, loadAdminLogs, loadFailedLogins, loadBlockedEntities, loadAlerts, loadSecurityLogs]);

  // ── Action Handlers ────────────────────────────────────────────

  const handleBlockConfirm = async (reason: string) => {
    if (!blockForm.targetId) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const payload: BlockEntityPayload = {
        targetId: parseInt(blockForm.targetId),
        entityType: blockForm.entityType,
        blockType: blockForm.blockType,
        reason,
      };
      if (blockForm.blockType === 'temporary' && blockForm.blockedUntil) {
        payload.blockedUntil = new Date(blockForm.blockedUntil).toISOString();
      }
      await blockEntity(payload);
      setModal(null);
      setBlockForm({ targetId: '', entityType: 'user', blockType: 'temporary', blockedUntil: '' });
      loadBlockedEntities();
      if (activeTab === 'blocked') setActiveTab('blocked');
    } catch (err) {
      setModalError(isForbiddenError(err) ? 'You do not have permission to block entities.' : getApiErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const handleUnblockConfirm = async (reason: string) => {
    if (modal?.type !== 'unblock') return;
    const { entity } = modal;
    const targetId = entity.blocked_user_id ?? entity.blocked_doctor_id ?? entity.blocked_assistant_id;
    const entityType = (entity.entity_type ?? 'user') as 'user' | 'doctor' | 'assistant';
    if (!targetId) return;
    setModalLoading(true);
    setModalError(null);
    try {
      const payload: UnblockEntityPayload = { targetId, entityType, reason };
      await unblockEntity(payload);
      setModal(null);
      loadBlockedEntities();
    } catch (err) {
      setModalError(isForbiddenError(err) ? 'You do not have permission to unblock entities.' : getApiErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const handleRevokeConfirm = async (reason: string) => {
    if (modal?.type !== 'revoke') return;
    setModalLoading(true);
    setModalError(null);
    try {
      const payload: RevokeSessionsPayload = {
        targetId: modal.targetId,
        entityType: modal.entityType as RevokeSessionsPayload['entityType'],
        reason,
      };
      await revokeEntitySessions(payload);
      setModal(null);
      loadSessions();
    } catch (err) {
      setModalError(isForbiddenError(err) ? 'You do not have permission to revoke sessions.' : getApiErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const handleEndSessionConfirm = async (reason: string) => {
    if (modal?.type !== 'end-session') return;
    setModalLoading(true);
    setModalError(null);
    try {
      const payload: EndSessionPayload = { sessionId: modal.sessionId, reason };
      await endSession(payload);
      setModal(null);
      loadSessions();
    } catch (err) {
      setModalError(isForbiddenError(err) ? 'You do not have permission to end sessions.' : getApiErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStatusConfirm = async (reason: string) => {
    if (modal?.type !== 'update-status') return;
    setModalLoading(true);
    setModalError(null);
    try {
      const payload: UpdateEntityStatusPayload = {
        targetId: modal.targetId,
        entityType: modal.entityType as UpdateEntityStatusPayload['entityType'],
        status: statusForm.status,
        reason,
      };
      await updateEntityStatus(payload);
      setModal(null);
      loadBlockedEntities();
    } catch (err) {
      setModalError(isForbiddenError(err) ? 'You do not have permission to update entity status.' : getApiErrorMessage(err));
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalConfirm = (reason: string) => {
    if (modal?.type === 'block') handleBlockConfirm(reason);
    else if (modal?.type === 'unblock') handleUnblockConfirm(reason);
    else if (modal?.type === 'revoke') handleRevokeConfirm(reason);
    else if (modal?.type === 'end-session') handleEndSessionConfirm(reason);
    else if (modal?.type === 'update-status') handleUpdateStatusConfirm(reason);
  };

  const closeModal = () => {
    if (modalLoading) return;
    setModal(null);
    setModalError(null);
  };

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleString() : '—';

  const severityBadge = (s?: string | null) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    const c = colors[s ?? ''] ?? 'bg-gray-100 text-gray-600';
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase", c)}>
        {s ?? 'N/A'}
      </span>
    );
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'sessions', label: t.security?.active_sessions || 'Active Sessions', icon: <Activity size={14} /> },
    { id: 'admin-logs', label: t.security?.admin_logs || 'Admin Logs', icon: <Server size={14} /> },
    { id: 'failed-logins', label: t.security?.failed_logins || 'Failed Logins', icon: <AlertTriangle size={14} /> },
    { id: 'alerts', label: t.security?.security_alerts || 'Alerts', icon: <Shield size={14} /> },
    { id: 'security-logs', label: t.security?.security_logs || 'Security Logs', icon: <Clock size={14} /> },
  ];

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-[#0A1B39]">
            {t.security?.security_overview || 'Security Overview'}
          </h2>
          <p className="text-[13px] text-[#6C7688] mt-1">
            {t.security?.security_desc || 'Monitor and manage system security, sessions, and access controls.'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 h-[88px] animate-pulse bg-gray-50" />
          ))
        ) : statsError ? (
          <div className="col-span-4 text-center py-6">
            <p className="text-[13px] text-red-500">{statsError}</p>
            <button onClick={loadStats} className="text-[12px] text-[#2E37A4] mt-2 hover:underline">Retry</button>
          </div>
        ) : (
          <>
            <StatCard
              label={t.security?.total_actions || 'Total Admin Actions'}
              value={stats?.adminStats?.totalAdminActions ?? 0}
              icon={<Activity size={22} className="text-blue-600" />}
              color="bg-blue-50"
            />
            <StatCard
              label={t.security?.last_24h || 'Last 24h Actions'}
              value={stats?.adminStats?.last24hActions ?? 0}
              icon={<Clock size={22} className="text-green-600" />}
              color="bg-green-50"
            />
            <StatCard
              label={t.security?.high_severity || 'High Severity'}
              value={stats?.adminStats?.highSeverityActions ?? 0}
              icon={<AlertTriangle size={22} className="text-orange-500" />}
              color="bg-orange-50"
            />
            <StatCard
              label={t.security?.suspicious_ips || 'Suspicious IPs'}
              value={stats?.adminStats?.suspiciousIPs ?? 0}
              icon={<Shield size={22} className="text-red-500" />}
              color="bg-red-50"
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap bg-white border border-[#E7E8EB] rounded-[10px] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`security-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-[7px] text-[12px] font-semibold transition-all",
              activeTab === tab.id
                ? "bg-[#2E37A4] text-white shadow-sm"
                : "text-[#6C7688] hover:text-[#0A1B39] hover:bg-[#F5F6F8]"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}

      {activeTab === 'sessions' && (
        <Section
          title={t.security?.active_sessions || 'Active Sessions'}
          icon={<Activity size={16} />}
          loading={sessionsLoading}
          error={sessionsError}
          onRetry={loadSessions}
          empty={sessions.length === 0}
          emptyText="No active sessions found."
        >
          <table className="w-full text-[12px]">
            <thead className="bg-[#F5F6F8]">
              <tr>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">ID</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">IP Address</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Browser / OS</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Created</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Expires</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Status</th>
                {isSystemAdmin && <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F6F8]">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-4 py-3 font-mono text-[#0A1B39]">#{s.id}</td>
                  <td className="px-4 py-3 text-[#0A1B39]">{s.ip_address ?? '—'}</td>
                  <td className="px-4 py-3 text-[#6C7688]">
                    {[s.browser, s.operating_system].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-[#6C7688]">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3 text-[#6C7688]">{formatDate(s.expires_at)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {s.is_active ? 'Active' : 'Ended'}
                    </span>
                  </td>
                  {isSystemAdmin && (
                    <td className="px-4 py-3">
                      {s.is_active && (
                        <button
                          onClick={() => setModal({ type: 'end-session', sessionId: s.id })}
                          id={`end-session-${s.id}`}
                          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-red-600 bg-red-50 rounded-[5px] hover:bg-red-100 transition-colors"
                        >
                          <LogOut size={11} /> End
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {activeTab === 'admin-logs' && (
        <Section
          title={t.security?.admin_logs || 'Admin Logs'}
          icon={<Server size={16} />}
          loading={adminLogsLoading}
          error={adminLogsError}
          onRetry={loadAdminLogs}
          empty={adminLogs.length === 0}
          emptyText="No admin logs found."
        >
          <table className="w-full text-[12px]">
            <thead className="bg-[#F5F6F8]">
              <tr>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Action</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Admin</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Target</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Severity</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F6F8]">
              {adminLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-[#2E37A4] text-[11px]">{log.action}</td>
                  <td className="px-4 py-3 text-[#0A1B39]">#{log.admin_id}</td>
                  <td className="px-4 py-3 text-[#6C7688]">
                    {log.target_type ? `${log.target_type} #${log.target_id}` : '—'}
                  </td>
                  <td className="px-4 py-3">{severityBadge(log.severity)}</td>
                  <td className="px-4 py-3 text-[#6C7688]">{formatDate(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {activeTab === 'failed-logins' && (
        <Section
          title={t.security?.failed_logins || 'Failed Logins'}
          icon={<AlertTriangle size={16} />}
          loading={failedLoginsLoading}
          error={failedLoginsError}
          onRetry={loadFailedLogins}
          empty={failedLogins.length === 0}
          emptyText="No failed login attempts found."
        >
          <table className="w-full text-[12px]">
            <thead className="bg-[#F5F6F8]">
              <tr>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Email</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Entity Type</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Reason</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">IP Address</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Attempted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F6F8]">
              {failedLogins.map((f) => (
                <tr key={f.id} className="hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-4 py-3 text-[#0A1B39]">{f.email ?? '—'}</td>
                  <td className="px-4 py-3 text-[#6C7688] capitalize">{f.entity_type ?? '—'}</td>
                  <td className="px-4 py-3 text-[#6C7688]">{f.failure_reason ?? '—'}</td>
                  <td className="px-4 py-3 text-[#6C7688]">{f.ip_address ?? '—'}</td>
                  <td className="px-4 py-3 text-[#6C7688]">{formatDate(f.attempted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}



      {activeTab === 'alerts' && (
        <Section
          title={t.security?.security_alerts || 'Security Alerts'}
          icon={<Shield size={16} />}
          loading={alertsLoading}
          error={alertsError}
          onRetry={loadAlerts}
          empty={alerts.length === 0}
          emptyText="No security alerts at this time."
        >
          <div className="flex flex-col divide-y divide-[#F5F6F8]">
            {alerts.map((a, i) => (
              <div key={a.id ?? i} className="flex items-start gap-3 px-5 py-4 hover:bg-[#FAFBFC]">
                <AlertTriangle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[#0A1B39]">{a.type ?? 'Alert'}</p>
                  <p className="text-[12px] text-[#6C7688] mt-0.5">{a.message ?? '—'}</p>
                  <p className="text-[11px] text-[#9DA4B0] mt-1">{formatDate(a.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeTab === 'security-logs' && (
        <Section
          title={t.security?.security_logs || 'Security Logs (My Account)'}
          icon={<Clock size={16} />}
          loading={securityLogsLoading}
          error={securityLogsError}
          onRetry={loadSecurityLogs}
          empty={securityLogs.length === 0}
          emptyText="No security logs found for your account."
        >
          <table className="w-full text-[12px]">
            <thead className="bg-[#F5F6F8]">
              <tr>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Action</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Description</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">IP Address</th>
                <th className="px-4 py-3 text-start text-[#6C7688] font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F6F8]">
              {securityLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#FAFBFC] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-[#2E37A4] text-[11px]">{l.action}</td>
                  <td className="px-4 py-3 text-[#6C7688] max-w-[300px] truncate">{l.description ?? '—'}</td>
                  <td className="px-4 py-3 text-[#6C7688]">{l.ip_address ?? '—'}</td>
                  <td className="px-4 py-3 text-[#6C7688]">{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* ── Modals ──────────────────────────────────────────────── */}

      {/* Block Entity Modal */}
      <ConfirmModal
        isOpen={modal?.type === 'block'}
        title={t.security?.block_entity || 'Block Entity'}
        description="This will block the entity from accessing the system. Provide a reason and entity details."
        loading={modalLoading}
        error={modalError}
        onConfirm={handleBlockConfirm}
        onCancel={closeModal}
        confirmLabel={t.security?.block_entity || 'Block Entity'}
        reasonLabel={t.security?.reason_required || 'Reason'}
        extraField={
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#0A1B39]">Target ID *</label>
              <input
                type="number"
                value={blockForm.targetId}
                onChange={(e) => setBlockForm(p => ({ ...p, targetId: e.target.value }))}
                placeholder="Entity numeric ID"
                className="w-full h-[36px] px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-semibold text-[#0A1B39]">Entity Type</label>
                <select
                  value={blockForm.entityType}
                  onChange={(e) => setBlockForm(p => ({ ...p, entityType: e.target.value as 'user' | 'doctor' | 'assistant' }))}
                  className="w-full h-[36px] px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="doctor">Doctor</option>
                  <option value="assistant">Assistant</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[12px] font-semibold text-[#0A1B39]">Block Type</label>
                <select
                  value={blockForm.blockType}
                  onChange={(e) => setBlockForm(p => ({ ...p, blockType: e.target.value as 'temporary' | 'permanent' }))}
                  className="w-full h-[36px] px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] focus:outline-none"
                >
                  <option value="temporary">Temporary</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>
            </div>
            {blockForm.blockType === 'temporary' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#0A1B39]">Blocked Until (optional)</label>
                <input
                  type="datetime-local"
                  value={blockForm.blockedUntil}
                  onChange={(e) => setBlockForm(p => ({ ...p, blockedUntil: e.target.value }))}
                  className="w-full h-[36px] px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] focus:outline-none"
                />
              </div>
            )}
          </div>
        }
      />

      {/* Unblock Entity Modal */}
      <ConfirmModal
        isOpen={modal?.type === 'unblock'}
        title={t.security?.unblock_entity || 'Unblock Entity'}
        description={`This will unblock the entity. This action is logged.`}
        loading={modalLoading}
        error={modalError}
        onConfirm={handleUnblockConfirm}
        onCancel={closeModal}
        confirmLabel={t.security?.unblock_entity || 'Unblock Entity'}
        reasonLabel={t.security?.reason_required || 'Reason'}
        danger={false}
      />

      {/* End Session Modal */}
      <ConfirmModal
        isOpen={modal?.type === 'end-session'}
        title={t.security?.end_session || 'End Session'}
        description={`This will immediately terminate session #${modal?.type === 'end-session' ? modal.sessionId : ''}. The user will be logged out.`}
        loading={modalLoading}
        error={modalError}
        onConfirm={handleEndSessionConfirm}
        onCancel={closeModal}
        confirmLabel={t.security?.end_session || 'End Session'}
        reasonLabel={t.security?.reason_required || 'Reason'}
      />

      {/* Update Entity Status Modal */}
      <ConfirmModal
        isOpen={modal?.type === 'update-status'}
        title={t.security?.update_entity_status || 'Update Entity Status'}
        description={`Update the status of entity #${modal?.type === 'update-status' ? modal.targetId : ''} (${modal?.type === 'update-status' ? modal.entityType : ''}).`}
        loading={modalLoading}
        error={modalError}
        onConfirm={handleUpdateStatusConfirm}
        onCancel={closeModal}
        confirmLabel={t.security?.update_entity_status || 'Update Status'}
        reasonLabel={t.security?.reason_required || 'Reason'}
        danger={false}
        extraField={
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#0A1B39]">New Status</label>
            <select
              value={statusForm.status}
              onChange={(e) => setStatusForm({ status: e.target.value as 'active' | 'inactive' | 'suspended' })}
              className="w-full h-[36px] px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        }
      />

    </div>
  );
}
