"use client";

import React, { useState } from "react";

interface ReviewDocumentModalProps {
  t: any;
  status: "approved" | "rejected";
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
}

export function ReviewDocumentModal({ t, status, onClose, onConfirm }: ReviewDocumentModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "rejected" && (reason.length < 10 || reason.length > 500)) {
      setError(t.clinic?.reason_required || "Reason is required for rejection (min 10 chars, max 500 chars)");
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
        <div className="px-6 py-4 border-b border-[#E7E8EB]">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">
            {status === "approved" 
              ? (t.clinic?.approve_document || "Approve Document")
              : (t.clinic?.reject_document || "Reject Document")
            }
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#EF1E1E] rounded-[6px] text-[#EF1E1E] text-[13px]">
              {error}
            </div>
          )}

          <p className="text-[14px] text-[#6C7688]">
            {status === "approved"
              ? "Are you sure you want to approve this document?"
              : "Please provide a reason for rejecting this document."
            }
          </p>

          {status === "rejected" && (
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.action_reason || "Reason"}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors resize-none h-[100px]"
                placeholder={t.clinic?.reason_required || "Reason (10-500 char)"}
                maxLength={500}
              />
              <span className="text-[11px] text-[#6C7688] text-end">{reason.length} / 500</span>
            </div>
          )}

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
              disabled={loading || (status === "rejected" && reason.length < 10)}
              className={`px-5 py-2 text-white text-[14px] font-medium rounded-[8px] transition-colors disabled:opacity-50 ${status === "approved" ? "bg-[#27AE60] hover:bg-[#219653]" : "bg-[#EF1E1E] hover:bg-[#DC2626]"}`}
            >
              {loading ? (t.common?.loading || "Loading...") : (t.clinic?.confirm_action || "Confirm Action")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
