"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MoreVerticalIcon, 
  CalendarSettingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownSmall
} from "@/components/ui/icons/dashboard-icons";
import type { AdminUserListItem } from "@/types/admin-users";

interface PatientListProps {
  t: any;
  patients: AdminUserListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const PatientList = ({ t, patients, currentPage, totalPages, onPageChange, onRetry, loading, error }: PatientListProps) => {
  const params = useParams();
  const lang = params.lang as string;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
      case "inactive": return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
      case "suspended": return "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
      case "pending_verification": return "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";
      default: return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
    }
  };

  const actionItems = [
    { label: t.clinic.edit || "Edit", onClick: () => console.log("Edit") },
    { label: t.clinic.delete || "Delete", onClick: () => console.log("Delete"), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6C7688]">{t.clinic.loading_patients || "Loading patients..."}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[14px] text-[#EF1E1E] font-medium">{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88] transition-colors"
            >
              {t.clinic.retry || "Retry"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <span className="text-[14px] text-[#9DA4B0]">{t.clinic.no_patients_found || "No patients found"}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="w-full overflow-x-auto min-h-[400px] rounded-t-[12px]"> 
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E7E8EB] bg-[#FAFBFC]">
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.sidebar.patients || "Patient Name"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.email || "Email"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.phone || "Phone"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.gender || "Gender"}</th>
              <th className="text-center py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.status || "Status"}</th>
              <th className="text-end py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={patient.profile?.profile_picture_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop"} 
                      alt={patient.profile?.full_name || ""} 
                      className="w-10 h-10 rounded-[8px] object-cover border-[2px] border-[#F5F6F8]" 
                    />
                    <div className="flex flex-col">
                      <Link href={`/${lang}/clinic/patients/details?id=${patient.id}`} className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors hover:underline">
                        {patient.profile?.full_name || patient.email || `Patient #${patient.id}`}
                      </Link>
                      {patient.uuid && (
                        <span className="text-[11px] text-[#9DA4B0] font-mono">#{patient.id}</span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className="text-[13px] text-[#6C7688]" dir="ltr">{patient.email || "—"}</span>
                </td>

                <td className="py-3 px-4">
                  <span className="text-[13px] text-[#6C7688]" dir="ltr">{patient.phone || "—"}</span>
                </td>

                <td className="py-3 px-4">
                  <span className="text-[13px] text-[#6C7688] capitalize">{patient.profile?.gender || "—"}</span>
                </td>
                
                <td className="py-3 px-4 text-center">
                  <span className={cn(
                    "px-2.5 py-1 rounded-[6px] text-[11px] font-bold border inline-block min-w-[80px] capitalize",
                    getStatusColor(patient.status)
                  )}>
                    {patient.status || "—"}
                  </span>
                </td>

                <td className="py-3 px-6 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                      <CalendarSettingIcon />
                    </button>
                    
                    <CustomDropdown 
                      trigger={
                        <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                          <MoreVerticalIcon />
                        </button>
                      }
                      items={actionItems}
                      width="w-32"
                      align="end"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4 rounded-b-[12px]">
        <div className="text-[13px] text-[#6C7688] font-medium">
          {t.clinic.entries || "Entries"}: {patients.length}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
          >
            <ChevronLeftIcon />
          </button>

          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-all shadow-sm",
                currentPage === page 
                  ? "bg-[#2E37A4] text-white border border-[#2E37A4] shadow-indigo-200" 
                  : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
              )}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
          >
            <ChevronRightIcon />
          </button>
        </div>

      </div>
    </div>
  );
};