"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Loader2, X, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    entity_id: number;
    entity_type: "user" | "doctor" | "assistant" | "admin";
    block_type: "temporary" | "permanent" | "warning";
    blocked_until?: string;
    reason: string;
  }) => void;
  loading: boolean;
  error: string | null;
  t: any;
}

export function BlockEntityModal({ isOpen, onClose, onConfirm, loading, error, t }: BlockEntityModalProps) {
  const [entityId, setEntityId] = useState("");
  const [entityType, setEntityType] = useState<"user" | "doctor" | "assistant" | "admin">("user");
  const [blockType, setBlockType] = useState<"temporary" | "permanent" | "warning">("temporary");
  const [blockedUntil, setBlockedUntil] = useState("");
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEntityId("");
      setEntityType("user");
      setBlockType("temporary");
      setBlockedUntil("");
      setReason("");
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsedId = parseInt(entityId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setValidationError("Entity ID must be a valid positive number.");
      return;
    }

    const trimmedReason = reason.trim();
    if (trimmedReason.length < 10) {
      setValidationError("Reason must be at least 10 characters.");
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
      entity_id: parsedId,
      entity_type: entityType,
      block_type: blockType,
      reason: trimmedReason,
      ...(blockType === "temporary" && blockedUntil ? { blocked_until: new Date(blockedUntil).toISOString() } : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[12px] shadow-2xl w-full max-w-[480px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-red-50 border-red-100">
          <div className="flex items-center gap-3 text-red-600">
            <Ban size={20} />
            <h3 className="text-[15px] font-bold">{t.block_entity || "Block Entity"}</h3>
          </div>
          <button onClick={onClose} disabled={loading} className="text-[#9DA4B0] hover:text-[#0A1B39]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">
                {t.entity_type || "Entity Type"} <span className="text-red-500">*</span>
              </label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
              >
                <option value="user">User</option>
                <option value="doctor">Doctor</option>
                <option value="assistant">Assistant</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">
                {t.entity_id || "Entity ID"} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="ID"
                className="w-full px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] focus:outline-none focus:border-[#2E37A4]"
              />
            </div>
          </div>

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
              placeholder="Reason for blocking (min 10 chars)..."
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
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-[6px]"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {t.confirm_block || "Confirm Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
