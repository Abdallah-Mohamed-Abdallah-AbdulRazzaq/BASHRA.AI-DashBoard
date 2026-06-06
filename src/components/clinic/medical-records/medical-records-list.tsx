import React from "react";
import type { MedicalRecordListItem } from "@/types/admin-medical-records";

interface MedicalRecordsListProps {
  t: any;
  records: MedicalRecordListItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (record: MedicalRecordListItem) => void;
}

export function MedicalRecordsList({
  t,
  records,
  loading,
  error,
  onRetry,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails
}: MedicalRecordsListProps) {
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

  if (records.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="text-[#6C7688] text-[14px]">{t.clinic?.no_medical_records_found || "No medical records found"}</span>
      </div>
    );
  }

  const renderStatus = (status?: string) => {
    switch (status) {
      case "draft": return <span className="px-2 py-1 bg-[#FFF5E6] text-[#F2994A] rounded-full text-[12px]">{t.clinic?.record_status_draft || "Draft"}</span>;
      case "final": return <span className="px-2 py-1 bg-[#E6F8EF] text-[#27AE60] rounded-full text-[12px]">{t.clinic?.record_status_final || "Final"}</span>;
      case "amended": return <span className="px-2 py-1 bg-[#E6F0FF] text-[#2F80ED] rounded-full text-[12px]">{t.clinic?.record_status_amended || "Amended"}</span>;
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
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688]">{t.clinic?.visit_date || "Visit Date"}</th>
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688]">{t.clinic?.record_status || "Status"}</th>
              <th className="py-3 px-4 text-[13px] font-medium text-[#6C7688] text-right">{t.clinic?.quick_actions || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB] transition-colors">
                <td className="py-3 px-4 text-[13px] text-[#0A1B39]">
                  {rec.patient?.full_name || rec.patient_id || "—"}
                </td>
                <td className="py-3 px-4 text-[13px] text-[#0A1B39]">
                  {rec.doctor?.full_name || rec.doctor_id || "—"}
                </td>
                <td className="py-3 px-4 text-[13px] text-[#6C7688]">
                  {rec.visit_date || "—"}
                </td>
                <td className="py-3 px-4">
                  {renderStatus(rec.record_status)}
                </td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button 
                    onClick={() => onViewDetails(rec)}
                    className="px-3 py-1.5 text-[12px] bg-white border border-[#E7E8EB] text-[#0A1B39] rounded-[6px] hover:bg-[#F5F6F8] transition-colors"
                  >
                    {t.clinic?.see_more || "View"}
                  </button>
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
