"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Ban, ShieldAlert, AlertTriangle, RefreshCw, Loader2, Search,
  Unlock, Edit, Filter, FileText, CheckCircle, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/error-utils";

import {
  getBlockedEntitiesList,
  getBlockedEntitiesStats,
  createBlockEntity,
  unblockEntity,
  updateBlockRecord,
  autoUnblockExpired
} from "@/lib/admin-blocked-entities";

import type {
  BlockedEntity,
  BlockedStatsSummary,
  GetBlockedEntitiesParams
} from "@/types/admin-blocked-entities";

import { BlockEntityModal } from "./block-entity-modal";
import { UpdateBlockModal } from "./update-block-modal";
import { BlockDetailsModal } from "./block-details-modal";

// -- Shared Confirm Modal (similar to existing patterns) --
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  loading: boolean;
  error: string | null;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  confirmLabel?: string;
  requireReason?: boolean;
}

function ConfirmModal({ isOpen, title, description, loading, error, onConfirm, onCancel, confirmLabel, requireReason }: ConfirmModalProps) {
  const [reason, setReason] = useState("");
  useEffect(() => { if (isOpen) setReason(""); }, [isOpen]);

  if (!isOpen) return null;
  
  const handleConfirm = () => {
    if (requireReason && reason.trim().length < 3) return;
    onConfirm(requireReason ? reason.trim() : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[400px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3 text-[#2E37A4]">
            <AlertTriangle size={20} />
            <h3 className="text-[15px] font-bold">{title}</h3>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p className="text-[13px] text-[#6C7688]">{description}</p>
          {requireReason && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (required)..."
              rows={3}
              className="w-full px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] resize-none focus:outline-none focus:border-[#2E37A4]"
            />
          )}
          {error && <p className="text-[12px] text-red-500 bg-red-50 p-2 rounded">{error}</p>}
          <div className="flex justify-end gap-3 mt-2">
            <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-[13px] bg-[#F5F6F8] rounded-[6px]">Cancel</button>
            <button
              onClick={handleConfirm}
              disabled={loading || (requireReason && reason.trim().length < 3)}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-[#2E37A4] rounded-[6px]"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {confirmLabel || "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Stat Card --
function StatCard({ label, value, icon, colorClass }: any) {
  return (
    <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0", colorClass)}>
        {icon}
      </div>
      <div>
        <p className="text-[24px] font-bold text-[#0A1B39]">{value}</p>
        <p className="text-[12px] text-[#6C7688] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

interface BlockedEntitiesViewProps {
  t: any;
}

export default function BlockedEntitiesView({ t }: BlockedEntitiesViewProps) {
  const [stats, setStats] = useState<BlockedStatsSummary | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [entities, setEntities] = useState<BlockedEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filters, setFilters] = useState<GetBlockedEntitiesParams>({
    page: 1,
    limit: 20,
    entity_type: "",
    block_type: "",
    is_active: true,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  
  const [unblockModalData, setUnblockModalData] = useState<{ entityId: number, entityType: string } | null>(null);
  
  const [updateModalData, setUpdateModalData] = useState<BlockedEntity | null>(null);
  
  const [detailsModalData, setDetailsModalData] = useState<{ blockId: number, entityId: number, entityType: string } | null>(null);
  
  const [isAutoUnblockOpen, setIsAutoUnblockOpen] = useState(false);

  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const res = await getBlockedEntitiesStats();
      setStats(res.data?.summary || null);
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadEntities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanFilters: GetBlockedEntitiesParams = { ...filters };
      if (searchTerm.trim()) cleanFilters.search = searchTerm.trim();
      if (!cleanFilters.entity_type) delete cleanFilters.entity_type;
      if (!cleanFilters.block_type) delete cleanFilters.block_type;
      
      const res = await getBlockedEntitiesList(cleanFilters);
      setEntities(res.data || []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  const handleFilterChange = (key: keyof GetBlockedEntitiesParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleBlockConfirm = async (data: any) => {
    setMutationLoading(true);
    setMutationError(null);
    try {
      await createBlockEntity(data);
      setIsBlockModalOpen(false);
      loadEntities();
      loadStats();
    } catch (err) {
      setMutationError(getApiErrorMessage(err));
    } finally {
      setMutationLoading(false);
    }
  };

  const handleUnblockConfirm = async (reason?: string) => {
    if (!unblockModalData) return;
    setMutationLoading(true);
    setMutationError(null);
    try {
      await unblockEntity({
        entity_id: unblockModalData.entityId,
        entity_type: unblockModalData.entityType,
        reason
      });
      setUnblockModalData(null);
      loadEntities();
      loadStats();
    } catch (err) {
      setMutationError(getApiErrorMessage(err));
    } finally {
      setMutationLoading(false);
    }
  };

  const handleUpdateConfirm = async (data: any) => {
    if (!updateModalData) return;
    setMutationLoading(true);
    setMutationError(null);
    try {
      await updateBlockRecord(updateModalData.id, data);
      setUpdateModalData(null);
      loadEntities();
      loadStats();
    } catch (err) {
      setMutationError(getApiErrorMessage(err));
    } finally {
      setMutationLoading(false);
    }
  };

  const handleAutoUnblockConfirm = async () => {
    setMutationLoading(true);
    setMutationError(null);
    try {
      await autoUnblockExpired();
      setIsAutoUnblockOpen(false);
      loadEntities();
      loadStats();
    } catch (err) {
      setMutationError(getApiErrorMessage(err));
    } finally {
      setMutationLoading(false);
    }
  };

  const formatDate = (d?: string | null) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#0A1B39]">{t.blocked_entities || "Blocked Entities"}</h2>
          <p className="text-[13px] text-[#6C7688] mt-1">
            {t.blocked_entities_desc || "Manage and review blocked users, doctors, and assistants."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoUnblockOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E7E8EB] text-[#0A1B39] text-[13px] font-bold rounded-[8px] hover:bg-[#F5F6F8] transition-colors shadow-sm"
          >
            <Clock size={15} className="text-[#2E37A4]" />
            {t.auto_unblock || "Auto-unblock Expired"}
          </button>
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-[13px] font-bold rounded-[8px] hover:bg-red-700 transition-colors shadow-sm"
          >
            <Ban size={15} />
            {t.block_entity || "Block Entity"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 h-[88px] animate-pulse bg-gray-50" />
          ))
        ) : (
          <>
            <StatCard
              label={t.active_blocks || "Active Blocks"}
              value={stats?.active_blocks ?? 0}
              icon={<ShieldAlert size={22} className="text-red-600" />}
              colorClass="bg-red-50"
            />
            <StatCard
              label={t.temporary_blocks || "Temporary"}
              value={stats?.temporary_blocks ?? 0}
              icon={<Clock size={22} className="text-orange-600" />}
              colorClass="bg-orange-50"
            />
            <StatCard
              label={t.permanent_blocks || "Permanent"}
              value={stats?.permanent_blocks ?? 0}
              icon={<Ban size={22} className="text-red-800" />}
              colorClass="bg-red-100"
            />
            <StatCard
              label={t.removed_blocks || "Removed Blocks"}
              value={stats?.removed_blocks ?? 0}
              icon={<CheckCircle size={22} className="text-green-600" />}
              colorClass="bg-green-50"
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]" />
            <input
              type="text"
              placeholder={t.search || "Search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadEntities()}
              className="pl-9 pr-4 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4] w-[200px]"
            />
          </div>
          <select
            value={filters.entity_type || ""}
            onChange={(e) => handleFilterChange("entity_type", e.target.value)}
            className="px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
          >
            <option value="">{t.all_types || "All Types"}</option>
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
            <option value="assistant">Assistant</option>
          </select>
          <select
            value={filters.block_type || ""}
            onChange={(e) => handleFilterChange("block_type", e.target.value)}
            className="px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
          >
            <option value="">{t.all_block_types || "All Blocks"}</option>
            <option value="temporary">Temporary</option>
            <option value="permanent">Permanent</option>
            <option value="warning">Warning</option>
          </select>
          <select
            value={filters.is_active ? "true" : "false"}
            onChange={(e) => handleFilterChange("is_active", e.target.value === "true")}
            className="px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
          >
            <option value="true">{t.status_active || "Active"}</option>
            <option value="false">{t.status_inactive || "Inactive (History)"}</option>
          </select>
        </div>
        <button
          onClick={loadEntities}
          className="p-2 rounded-[8px] bg-[#F5F6F8] text-[#0A1B39] hover:bg-[#E7E8EB] transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* List */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#2E37A4]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertTriangle size={24} className="text-red-400" />
            <p className="text-[13px] text-red-500">{error}</p>
            <button onClick={loadEntities} className="text-[12px] text-[#2E37A4] hover:underline">Retry</button>
          </div>
        ) : entities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Ban size={24} className="text-[#9DA4B0]" />
            <p className="text-[13px] text-[#6C7688]">{t.no_data || "No blocked entities found."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-[#F5F6F8]">
                <tr>
                  <th className="px-5 py-3 text-start text-[#6C7688] font-semibold">Entity</th>
                  <th className="px-5 py-3 text-start text-[#6C7688] font-semibold">Type</th>
                  <th className="px-5 py-3 text-start text-[#6C7688] font-semibold">Block Type</th>
                  <th className="px-5 py-3 text-start text-[#6C7688] font-semibold">Until</th>
                  <th className="px-5 py-3 text-start text-[#6C7688] font-semibold">Status</th>
                  <th className="px-5 py-3 text-end text-[#6C7688] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB]">
                {entities.map(e => {
                  const targetId = e.blocked_user_id || e.blocked_doctor_id || e.blocked_assistant_id || e.blocked_admin_id;
                  const eType = e.entity_type || "user";
                  return (
                    <tr key={e.id} className="hover:bg-[#FAFBFC] transition-colors">
                      <td className="px-5 py-4 font-mono font-medium text-[#0A1B39]">#{targetId || '—'}</td>
                      <td className="px-5 py-4 capitalize text-[#6C7688]">{eType}</td>
                      <td className="px-5 py-4 capitalize text-[#0A1B39] font-medium">{e.block_type || "—"}</td>
                      <td className="px-5 py-4 text-[#6C7688]">{formatDate(e.blocked_until)}</td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-[6px] text-[11px] font-bold",
                          e.is_active ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                        )}>
                          {e.is_active ? "Active" : "Removed"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailsModalData({ blockId: e.id, entityId: targetId as number, entityType: eType })}
                            className="p-1.5 text-[#9DA4B0] hover:text-[#2E37A4] hover:bg-[#F5F6F8] rounded-[6px]"
                            title="Details"
                          >
                            <FileText size={14} />
                          </button>
                          {e.is_active && (
                            <>
                              <button
                                onClick={() => setUpdateModalData(e)}
                                className="p-1.5 text-[#9DA4B0] hover:text-[#2E37A4] hover:bg-[#F5F6F8] rounded-[6px]"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => setUnblockModalData({ entityId: targetId as number, entityType: eType })}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-[6px]"
                                title="Unblock"
                              >
                                <Unlock size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <BlockEntityModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleBlockConfirm}
        loading={mutationLoading}
        error={mutationError}
        t={t}
      />

      <UpdateBlockModal
        isOpen={!!updateModalData}
        onClose={() => setUpdateModalData(null)}
        onConfirm={handleUpdateConfirm}
        loading={mutationLoading}
        error={mutationError}
        t={t}
        initialData={updateModalData}
      />

      <BlockDetailsModal
        isOpen={!!detailsModalData}
        onClose={() => setDetailsModalData(null)}
        blockId={detailsModalData?.blockId as number}
        entityId={detailsModalData?.entityId as number}
        entityType={detailsModalData?.entityType as string}
        t={t}
      />

      <ConfirmModal
        isOpen={!!unblockModalData}
        onCancel={() => setUnblockModalData(null)}
        onConfirm={(reason) => handleUnblockConfirm(reason)}
        title={t.unblock_entity || "Unblock Entity"}
        description={`Are you sure you want to unblock ${unblockModalData?.entityType} #${unblockModalData?.entityId}?`}
        confirmLabel="Unblock"
        requireReason={true}
        loading={mutationLoading}
        error={mutationError}
      />

      <ConfirmModal
        isOpen={isAutoUnblockOpen}
        onCancel={() => setIsAutoUnblockOpen(false)}
        onConfirm={() => handleAutoUnblockConfirm()}
        title={t.auto_unblock || "Auto-unblock Expired"}
        description="This will automatically unblock all temporary blocks that have reached their expiration date."
        confirmLabel="Run Auto-unblock"
        requireReason={false}
        loading={mutationLoading}
        error={mutationError}
      />

    </div>
  );
}
