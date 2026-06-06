import React from "react";
import type { AppointmentListItem } from "@/types/admin-appointments";

interface AppointmentsListProps {
  t: any;
  appointments: AppointmentListItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (appt: AppointmentListItem) => void;
  onCancel: (appt: AppointmentListItem) => void;
}

export function AppointmentsList({
  t,
  appointments,
  loading,
  error,
  onRetry,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
  onCancel
}: AppointmentsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-[#6C7688] text-[14px]">{t.common?.loading || "Loading..."}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-10 gap-3">
        <span className="text-[#EB5757] text-[14px]">{error}</span>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-[#2E37A4] text-white rounded-[8px] text-[13px]"
        >
          {t.clinic?.retry || "Retry"}
        </button>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-[#6C7688] text-[14px]">{t.clinic?.no_appointments_found || "No appointments found"}</span>
      </div>
    );
  }

  const renderStatus = (status?: string) => {
    switch (status) {
      case "pending": return <span className="px-2 py-1 bg-[#FFF5E6] text-[#F2994A] rounded-full text-[12px]">{t.clinic?.status_pending || "Pending"}</span>;
      case "confirmed": return <span className="px-2 py-1 bg-[#E6F8EF] text-[#27AE60] rounded-full text-[12px]">{t.clinic?.status_confirmed || "Confirmed"}</span>;
      case "in_progress": return <span className="px-2 py-1 bg-[#E6F0FF] text-[#2F80ED] rounded-full text-[12px]">{t.clinic?.status_in_progress || "In Progress"}</span>;
      case "completed": return <span className="px-2 py-1 bg-[#F0F2F5] text-[#6C7688] rounded-full text-[12px]">{t.clinic?.status_completed || "Completed"}</span>;
      case "cancelled": return <span className="px-2 py-1 bg-[#FFEBEB] text-[#EB5757] rounded-full text-[12px]">{t.clinic?.status_cancelled || "Cancelled"}</span>;
      case "no_show": return <span className="px-2 py-1 bg-[#F5F5F5] text-[#9E9E9E] rounded-full text-[12px]">{t.clinic?.status_no_show || "No Show"}</span>;
      case "rescheduled": return <span className="px-2 py-1 bg-[#FFF5E6] text-[#F2994A] rounded-full text-[12px]">{t.clinic?.status_rescheduled || "Rescheduled"}</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E7E8EB]">
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688]">{t.clinic?.patient || "Patient"}</th>
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688]">{t.clinic?.doctor || "Doctor"}</th>
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688]">{t.clinic?.scheduled_date || "Date"}</th>
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688]">{t.clinic?.scheduled_time || "Time"}</th>
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688]">{t.clinic?.status || "Status"}</th>
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688] text-right">{t.clinic?.quick_actions || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB] transition-colors">
                <td className="py-3 px-4 text-[13px] text-[#0A1B39]">
                  {appt.patient?.full_name || appt.patient_id || "—"}
                </td>
                <td className="py-3 px-4 text-[13px] text-[#0A1B39]">
                  {appt.doctor?.full_name || appt.doctor_id || "—"}
                </td>
                <td className="py-3 px-4 text-[13px] text-[#6C7688]">
                  {appt.scheduled_date || "—"}
                </td>
                <td className="py-3 px-4 text-[13px] text-[#6C7688]">
                  {appt.scheduled_start_time || "—"}
                </td>
                <td className="py-3 px-4">
                  {renderStatus(appt.status)}
                </td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button 
                    onClick={() => onViewDetails(appt)}
                    className="px-3 py-1.5 text-[12px] bg-white border border-[#E7E8EB] text-[#0A1B39] rounded-[6px] hover:bg-[#F5F6F8] transition-colors"
                  >
                    {t.clinic?.see_more || "View"}
                  </button>
                  {appt.status !== "cancelled" && (
                    <button 
                      onClick={() => onCancel(appt)}
                      className="px-3 py-1.5 text-[12px] bg-[#FFEBEB] text-[#EB5757] rounded-[6px] hover:bg-[#FFD6D6] transition-colors"
                    >
                      {t.clinic?.cancel_appointment || "Cancel"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <span className="text-[13px] text-[#6C7688]">
            {t.clinic?.page || "Page"} {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] disabled:opacity-50"
            >
              {t.clinic?.previous || "Prev"}
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] disabled:opacity-50"
            >
              {t.clinic?.next || "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
