"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { 
  MoreVerticalIcon, 
  CalendarSettingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownSmall
} from "@/components/ui/icons/dashboard-icons";
import type { DoctorListItem } from "@/types/admin-doctors";

interface DoctorListProps {
  t: any;
  doctors?: DoctorListItem[];
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  lang?: string;
  selectedDoctorIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
}

function statusColor(status: string | undefined): string {
  switch (status) {
    case "active": return "text-[#27AE60] border-[#27AE60] bg-[#E8F8F0]";
    case "inactive": return "text-[#E8A317] border-[#E8A317] bg-[#FFF5E6]";
    case "suspended": return "text-[#EF1E1E] border-[#EF1E1E] bg-[#FEF2F2]";
    case "pending_verification": return "text-[#8B5CF6] border-[#8B5CF6] bg-[#F3EFFF]";
    default: return "text-[#6C7688] border-[#D0D5DD] bg-[#F5F6F8]";
  }
}

function formatStatus(status: string | undefined): string {
  if (!status) return "—";
  return status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export const DoctorList = ({
  t,
  doctors = [],
  loading = false,
  error = null,
  currentPage = 1,
  totalPages = 0,
  onPageChange,
  onRetry,
  lang = "en",
  selectedDoctorIds = [],
  onSelectionChange,
  onActionClick
}: DoctorListProps & { onActionClick?: (actionType: string, doctorId: number) => void }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getActionItems = (docId: number) => [
    { label: "Approve", onClick: () => onActionClick?.("approve", docId) },
    { label: "Reject", onClick: () => onActionClick?.("reject", docId), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" },
    { label: "Suspend", onClick: () => onActionClick?.("suspend", docId), className: "text-[#E8A317] hover:text-[#E8A317] hover:bg-[#FFF5E6]" },
    { label: "Verify Profile", onClick: () => onActionClick?.("verify", docId), className: "text-[#27AE60] hover:text-[#27AE60] hover:bg-[#E8F8F0]" },
    { label: "Unverify Profile", onClick: () => onActionClick?.("unverify", docId) },
    { label: "Update Status", onClick: () => onActionClick?.("update_status", docId) },
  ];

  const rowsOptions = [
    { label: "10", onClick: () => { setRowsPerPage(10); onPageChange?.(1); } },
    { label: "20", onClick: () => { setRowsPerPage(20); onPageChange?.(1); } },
    { label: "50", onClick: () => { setRowsPerPage(50); onPageChange?.(1); } },
  ];

  if (loading) {
    return (
      <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[14px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[400px] items-center justify-center gap-4">
        <span className="text-[14px] text-[#EF1E1E]">{error}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2 bg-[#2E37A4] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#252E8A] transition-colors"
          >
            {t.dashboard?.retry || "Retry"}
          </button>
        )}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] min-h-[400px] items-center justify-center">
        <span className="text-[14px] text-[#6C7688]">No doctors found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="w-full overflow-x-auto min-h-[400px] rounded-t-[12px]"> 
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E7E8EB] bg-white">
              <th className="py-4 px-6 w-[5%]">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-[#D0D5DD] text-[#2E37A4] focus:ring-[#2E37A4]"
                  checked={doctors.length > 0 && selectedDoctorIds.length === doctors.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectionChange?.(doctors.map(d => d.id as number));
                    } else {
                      onSelectionChange?.([]);
                    }
                  }}
                />
              </th>
              <th className="text-start py-4 px-2 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic.name_designation}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.department}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.phone}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic.email}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.fees}</th>
              <th className="text-center py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.status}</th>
              <th className="text-end py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => {
              const displayName = doc.full_name || doc.email || `Doctor #${doc.id}`;
              return (
                <tr key={doc.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  <td className="py-3 px-6">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-[#D0D5DD] text-[#2E37A4] focus:ring-[#2E37A4]"
                      checked={selectedDoctorIds.includes(doc.id as number)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectionChange?.([...selectedDoctorIds, doc.id as number]);
                        } else {
                          onSelectionChange?.(selectedDoctorIds.filter(id => id !== doc.id));
                        }
                      }}
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/${lang}/clinic/doctors/details?id=${doc.id}`}
                        className="shrink-0 w-10 h-10 rounded-full overflow-hidden border-[2px] border-[#F5F6F8] flex items-center justify-center bg-[#F5F6F8]"
                      >
                        {doc.profile_picture_url ? (
                          <img src={doc.profile_picture_url} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[12px] font-bold text-[#2E37A4]">
                            {displayName.split(/\s+/).map(s => s.charAt(0)).join("").slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </a>
                      <div className="flex flex-col min-w-0">
                        <a
                          href={`/${lang}/clinic/doctors/details?id=${doc.id!}`}
                          className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors truncate"
                        >
                          {displayName}
                        </a>
                        <span className="text-[12px] text-[#6C7688] truncate">{doc.specialty || "—"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]">{doc.specialty || "—"}</span></td>
                  <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]" dir="ltr">{doc.phone || "—"}</span></td>
                  <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]">{doc.email || "—"}</span></td>
                  <td className="py-3 px-4">
                    <span className="text-[14px] font-bold text-[#0A1B39]">—</span>
                  </td>
                  
                  <td className="py-3 px-4 text-center">
                    <span className={cn("px-3 py-1 rounded-[4px] text-[11px] font-medium border inline-block min-w-[80px]", statusColor(doc.status))}>
                      {formatStatus(doc.status)}
                    </span>
                  </td>

                  <td className="py-3 px-6 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/${lang}/clinic/doctors/details?id=${doc.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all"
                      >
                        <CalendarSettingIcon />
                      </a>
                      
                      <CustomDropdown 
                        trigger={
                          <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                            <MoreVerticalIcon />
                          </button>
                        }
                        items={getActionItems(doc.id!)}
                        width="w-40"
                        align="end"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4 rounded-b-[12px]">
        
        <div className="flex items-center gap-3 text-[13px] text-[#6C7688] font-medium">
          <span>{t.clinic.row_per_page}</span>
          
          <CustomDropdown 
            trigger={
              <button className="flex items-center justify-between w-[65px] h-[34px] px-2.5 bg-white border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] font-bold text-[13px] hover:border-[#2E37A4] transition-all shadow-sm">
                {rowsPerPage}
                <span className="w-4 h-4 text-[#6C7688] flex items-center justify-center">
                  <ChevronDownSmall />
                </span>
              </button>
            }
            items={rowsOptions}
            width="w-[65px]"
            align="start" 
          />

          <span>{t.clinic.entries}</span>
        </div>

        {totalPages > 0 && onPageChange && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
            >
              <ChevronLeftIcon />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
