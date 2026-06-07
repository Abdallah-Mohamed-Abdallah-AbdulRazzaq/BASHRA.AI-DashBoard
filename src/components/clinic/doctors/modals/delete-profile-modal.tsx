"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteProfileModalProps {
  t: any;
  doctorId: number;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export function DeleteProfileModal({ t, doctorId, onClose, onConfirm }: DeleteProfileModalProps) {
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredConfirmText = `DELETE/${doctorId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.length < 10 || reason.length > 500) {
      setError(t.clinic?.reason_required || "Reason is required (min 10 chars, max 500 chars)");
      return;
    }
    if (confirmText !== requiredConfirmText) {
      setError(`Please type ${requiredConfirmText} to confirm.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onConfirm(reason);
    } catch (err: any) {
      setError(err?.message || t.clinic?.action_failed || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[12px] shadow-lg w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FEF2F2]">
          <div className="flex items-center gap-3 text-[#EF1E1E]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-[18px] font-bold">
              {t.clinic?.delete_profile || "Delete Profile"}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#EF1E1E] rounded-[6px] text-[#EF1E1E] text-[13px]">
              {error}
            </div>
          )}

          <div className="p-4 bg-[#FFF9F2] border border-[#F2994A]/30 rounded-[8px]">
            <p className="text-[14px] text-[#0A1B39] font-medium">
              Warning: This action is permanent and cannot be undone. All data associated with this doctor will be marked as deleted.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#0A1B39]">
              {t.clinic?.action_reason || "Reason"} <span className="text-[#EF1E1E]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39] focus:outline-none focus:border-[#EF1E1E] transition-colors resize-none h-[100px]"
              placeholder={t.clinic?.reason_required || "Reason (10-500 char)"}
              maxLength={500}
            />
            <span className="text-[11px] text-[#6C7688] text-end">{reason.length} / 500</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#0A1B39]">
              To confirm, type <span className="font-mono bg-gray-100 px-1 rounded select-all">{requiredConfirmText}</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39] focus:outline-none focus:border-[#EF1E1E]"
              placeholder={requiredConfirmText}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-[14px] font-medium text-[#6C7688] hover:text-[#0A1B39] transition-colors disabled:opacity-50"
            >
              {t.settings?.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading || reason.length < 10 || confirmText !== requiredConfirmText}
              className="px-5 py-2 bg-[#EF1E1E] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#DC2626] transition-colors disabled:opacity-50"
            >
              {loading ? (t.common?.loading || "Loading...") : (t.clinic?.delete_profile || "Delete Profile")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
