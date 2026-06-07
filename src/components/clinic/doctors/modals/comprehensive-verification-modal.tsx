"use client";

import React, { useState } from "react";
import type { DoctorApprovalStatus } from "@/types/admin-doctors";

interface ComprehensiveVerificationModalProps {
  t: any;
  initialIsVerified: boolean;
  initialApprovalStatus: DoctorApprovalStatus;
  onClose: () => void;
  onConfirm: (isVerified: boolean, approvalStatus: DoctorApprovalStatus, reason: string) => Promise<void>;
}

export function ComprehensiveVerificationModal({
  t,
  initialIsVerified,
  initialApprovalStatus,
  onClose,
  onConfirm
}: ComprehensiveVerificationModalProps) {
  const [isVerified, setIsVerified] = useState<boolean>(initialIsVerified);
  const [approvalStatus, setApprovalStatus] = useState<DoctorApprovalStatus>(initialApprovalStatus);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.length < 10 || reason.length > 500) {
      setError(t.clinic?.reason_required || "Reason is required (min 10 chars, max 500 chars)");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onConfirm(isVerified, approvalStatus, reason);
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
            {t.clinic?.update_verification_status || "Comprehensive Verification Status"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#EF1E1E] rounded-[6px] text-[#EF1E1E] text-[13px]">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.is_verified || "Verified Status"}</label>
            <select
              value={isVerified ? "true" : "false"}
              onChange={(e) => setIsVerified(e.target.value === "true")}
              className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
            >
              <option value="true">{t.clinic?.verified || "Verified"}</option>
              <option value="false">{t.clinic?.unverified || "Unverified"}</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.approval_status || "Approval Status"}</label>
            <select
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value as DoctorApprovalStatus)}
              className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
            >
              <option value="pending">{t.clinic?.pending || "Pending"}</option>
              <option value="approved">{t.clinic?.approved || "Approved"}</option>
              <option value="rejected">{t.clinic?.reject_doctor || "Rejected"}</option>
              <option value="suspended">{t.clinic?.status_suspended || "Suspended"}</option>
            </select>
          </div>

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
              disabled={loading || reason.length < 10}
              className="px-5 py-2 bg-[#2E37A4] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#252E8A] transition-colors disabled:opacity-50"
            >
              {loading ? (t.common?.loading || "Loading...") : (t.clinic?.confirm_action || "Confirm Action")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
