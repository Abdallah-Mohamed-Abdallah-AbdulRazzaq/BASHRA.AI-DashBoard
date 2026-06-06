"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Loader2, X, Edit } from "lucide-react";

interface UpdateBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    block_type: "temporary" | "permanent" | "warning";
    blocked_until?: string | null;
    reason: string;
  }) => void;
  loading: boolean;
  error: string | null;
  t: any;
  initialData?: {
    block_type?: string;
    blocked_until?: string | null;
  } | null;
}

export function UpdateBlockModal({ isOpen, onClose, onConfirm, loading, error, t, initialData }: UpdateBlockModalProps) {
  const [blockType, setBlockType] = useState<"temporary" | "permanent" | "warning">("temporary");
  const [blockedUntil, setBlockedUntil] = useState("");
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBlockType((initialData?.block_type as any) || "temporary");
      
      if (initialData?.blocked_until) {
        // Format to datetime-local expected format (YYYY-MM-DDTHH:MM)
        const d = new Date(initialData.blocked_until);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        setBlockedUntil(localISOTime);
      } else {
        setBlockedUntil("");
      }
      
      setReason("");
      setValidationError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedReason = reason.trim();
    if (trimmedReason.length < 10) {
      setValidationError("Reason must be at least 10 characters for updating.");
      return;
    }

    if (trimmedReason.length > 500) {
      setValidationError("Reason must not exceed 500 characters.");
      return;
    }

    if (blockType === "temporary" && !blockedUntil) {
      setValidationError("Block end date is required for temporary blocks.");
      return;
    }

    if (blockType === "temporary" && new Date(blockedUntil) <= new Date()) {
      setValidationError("Block end date must be in the future.");
      return;
    }

    onConfirm({
      block_type: blockType,
      reason: trimmedReason,
      ...(blockType === "temporary" && blockedUntil ? { blocked_until: new Date(blockedUntil).toISOString() } : { blocked_until: null }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[480px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3 text-[#2E37A4]">
            <Edit size={20} />
            <h3 className="text-[15px] font-bold">{t.update_block || "Update Block"}</h3>
          </div>
          <button onClick={onClose} disabled={loading} className="text-[#9DA4B0] hover:text-[#0A1B39]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">
              {t.block_type || "Block Type"} <span className="text-red-500">*</span>
            </label>
            <select
              value={blockType}
              onChange={(e) => setBlockType(e.target.value as any)}
              className="w-full px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
            >
              <option value="temporary">Temporary</option>
              <option value="permanent">Permanent</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          {blockType === "temporary" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">
                {t.blocked_until || "Blocked Until"} <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={blockedUntil}
                onChange={(e) => setBlockedUntil(e.target.value)}
                className="w-full px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">
              {t.reason || "Reason"} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for update (min 10 chars)..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] resize-none focus:outline-none focus:border-[#2E37A4]"
            />
          </div>

          {(error || validationError) && (
            <div className="rounded-[6px] border border-red-300 bg-red-50 px-3 py-2 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="text-[12px] text-red-600">{validationError || error}</p>
            </div>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-[13px] font-medium text-[#0A1B39] bg-[#F5F6F8] hover:bg-[#E7E8EB] rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-[#2E37A4] hover:bg-[#252D88] rounded-[6px]"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {t.confirm_update || "Update Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
