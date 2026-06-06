import React, { useState } from "react";
import { cancelAdminAppointment } from "@/lib/admin-appointments";
import { ApiError } from "@/lib/api";

interface CancelAppointmentModalProps {
  t: any;
  appointmentId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelAppointmentModal({ t, appointmentId, onClose, onSuccess }: CancelAppointmentModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 10 || trimmedReason.length > 500) {
      setError(t.clinic?.reason_required || "Reason must be between 10 and 500 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await cancelAdminAppointment(appointmentId, {
        cancellation_reason: trimmedReason
      });
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(t.clinic?.action_failed || "Action failed");
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setError(t.clinic?.permission_denied || "Permission denied");
        } else if (err.status === 404) {
          setError(t.clinic?.not_found || "Appointment not found");
        } else {
          setError(err.getDisplayMessage() || t.clinic?.action_failed || "Action failed");
        }
      } else {
        setError(err.message || t.clinic?.action_failed || "Action failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[16px] w-full max-w-md flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#E7E8EB] flex justify-between items-center">
          <h2 className="text-[18px] font-bold text-[#EB5757]">{t.clinic?.cancel_appointment || "Cancel Appointment"}</h2>
          <button onClick={onClose} disabled={loading} className="text-[#6C7688] hover:text-[#0A1B39] disabled:opacity-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <p className="text-[14px] text-[#6C7688]">
            {t.clinic?.confirm_cancel || "Are you sure you want to cancel this appointment? Please provide a reason below."}
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#0A1B39]">{t.clinic?.cancellation_reason || "Cancellation Reason"}</label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              disabled={loading}
              className="w-full min-h-[100px] px-3 py-2 border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] outline-none focus:border-[#EB5757] resize-none disabled:bg-[#F5F6F8]"
              placeholder={t.clinic?.reason_required || "Reason must be between 10 and 500 characters"}
            />
            {error && <span className="text-[12px] text-[#EB5757]">{error}</span>}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-[#F5F6F8] text-[#0A1B39] rounded-[8px] text-[13px] font-medium disabled:opacity-50 hover:bg-[#E7E8EB] transition-colors"
            >
              {t.clinic?.close || "Close"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#EB5757] text-white rounded-[8px] text-[13px] font-medium disabled:opacity-50 hover:bg-[#C94A4A] transition-colors flex items-center justify-center min-w-[100px]"
            >
              {loading ? (t.common?.loading || "Loading...") : (t.clinic?.cancel_appointment || "Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
