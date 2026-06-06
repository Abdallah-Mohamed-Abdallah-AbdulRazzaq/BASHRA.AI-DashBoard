"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Clock, ShieldAlert, AlertCircle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlockDetails, getBlockHistory } from "@/lib/admin-blocked-entities";
import type { BlockedEntity } from "@/types/admin-blocked-entities";
import { getApiErrorMessage } from "@/lib/error-utils";

interface BlockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockId: number;
  entityType: string;
  entityId: number;
  t: any;
}

export function BlockDetailsModal({ isOpen, onClose, blockId, entityType, entityId, t }: BlockDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<BlockedEntity | null>(null);
  const [history, setHistory] = useState<BlockedEntity[]>([]);

  useEffect(() => {
    if (isOpen && blockId && entityType && entityId) {
      loadData();
    }
  }, [isOpen, blockId, entityType, entityId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [detailsRes, historyRes] = await Promise.all([
        getBlockDetails(blockId),
        getBlockHistory({ entity_type: entityType, entity_id: entityId, limit: 10 })
      ]);
      setDetails(detailsRes.data?.block || null);
      setHistory(historyRes.data?.history || []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (d?: string | null) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-[#F5F6F8]">
          <div className="flex items-center gap-3 text-[#0A1B39]">
            <Ban size={20} className="text-red-500" />
            <h3 className="text-[15px] font-bold">{t.block_details || "Block Details"}</h3>
          </div>
          <button onClick={onClose} className="text-[#9DA4B0] hover:text-[#0A1B39]">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-[#2E37A4]" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <AlertCircle size={24} className="text-red-400" />
              <p className="text-[13px] text-red-500">{error}</p>
              <button onClick={loadData} className="text-[12px] text-[#2E37A4] hover:underline">
                {t.retry || "Retry"}
              </button>
            </div>
          ) : details ? (
            <>
              {/* Current Details */}
              <div className="bg-[#FAFBFC] border border-[#E7E8EB] rounded-[10px] p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-[#6C7688] uppercase tracking-wider mb-1">
                      {t.target_entity || "Target Entity"}
                    </p>
                    <p className="text-[14px] font-bold text-[#0A1B39]">
                      {details.entity_type} #{entityId}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-2.5 py-1 text-[11px] font-bold rounded-[6px]",
                      details.is_active
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    )}
                  >
                    {details.is_active ? t.status_active || "Active" : t.status_inactive || "Inactive"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-[11px] text-[#6C7688] mb-0.5">{t.block_type || "Type"}</p>
                    <p className="text-[13px] font-medium text-[#0A1B39] capitalize">{details.block_type || "—"}</p>
                  </div>
                  {details.block_type === "temporary" && (
                    <div>
                      <p className="text-[11px] text-[#6C7688] mb-0.5">{t.blocked_until || "Until"}</p>
                      <p className="text-[13px] font-medium text-[#0A1B39]">{formatDate(details.blocked_until)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] text-[#6C7688] mb-0.5">{t.blocked_by || "Blocked By"}</p>
                    <p className="text-[13px] font-medium text-[#0A1B39]">Admin #{details.blocked_by_admin_id || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#6C7688] mb-0.5">{t.created_at || "Created At"}</p>
                    <p className="text-[13px] font-medium text-[#0A1B39]">{formatDate(details.created_at)}</p>
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-[#E7E8EB]">
                  <p className="text-[11px] text-[#6C7688] mb-1">{t.reason || "Reason"}</p>
                  <p className="text-[13px] text-[#0A1B39] leading-relaxed bg-white p-3 rounded-[6px] border border-[#E7E8EB]">
                    {details.reason || "—"}
                  </p>
                </div>
              </div>

              {/* History Section */}
              {history.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-[14px] font-bold text-[#0A1B39] flex items-center gap-2">
                    <Clock size={16} className="text-[#6C7688]" />
                    {t.block_history || "Block History"}
                  </h4>
                  <div className="border border-[#E7E8EB] rounded-[10px] overflow-hidden">
                    <table className="w-full text-[12px]">
                      <thead className="bg-[#F5F6F8]">
                        <tr>
                          <th className="px-4 py-2.5 text-start text-[#6C7688] font-semibold">Date</th>
                          <th className="px-4 py-2.5 text-start text-[#6C7688] font-semibold">Type</th>
                          <th className="px-4 py-2.5 text-start text-[#6C7688] font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F5F6F8]">
                        {history.map((h) => (
                          <tr key={h.id} className="hover:bg-[#FAFBFC]">
                            <td className="px-4 py-3 text-[#0A1B39]">{formatDate(h.created_at)}</td>
                            <td className="px-4 py-3 capitalize text-[#6C7688]">{h.block_type || "—"}</td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-[4px] text-[10px] font-bold",
                                  h.is_active ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                                )}
                              >
                                {h.is_active ? t.status_active || "Active" : t.status_inactive || "Inactive"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-[#6C7688] text-[13px]">
              No details found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
