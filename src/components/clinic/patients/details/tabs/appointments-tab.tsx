"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { 
  MoreVerticalIcon, 
  SearchIcon, 
  FilterIcon, 
  CalendarSmallIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownSmall,
  WalletOutlineIcon,
  AlertCircleOutlineIcon,
  FileTextOutlineIcon
} from "@/components/ui/icons/dashboard-icons";

interface AppointmentsTabProps {
  t: any;
  patient: any;
}

export const AppointmentsTab = ({ t, patient }: AppointmentsTabProps) => {
  const appointments = patient.appointmentsData || [];
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination Logic
  const totalPages = Math.ceil(appointments.length / rowsPerPage) || 1;
  const currentData = appointments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const rowsOptions = [
    { label: "10", onClick: () => { setRowsPerPage(10); setCurrentPage(1); } },
    { label: "20", onClick: () => { setRowsPerPage(20); setCurrentPage(1); } },
    { label: "50", onClick: () => { setRowsPerPage(50); setCurrentPage(1); } },
  ];

  // Helper for Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-[#27AE60] bg-[#F0FDF4] border-[#27AE60]/20";
      case "completed": return "text-[#2F80ED] bg-[#EFF6FF] border-[#2F80ED]/20";
      case "cancelled": case "no_show": return "text-[#EF1E1E] bg-[#FEF2F2] border-[#EF1E1E]/20";
      case "in_progress": return "text-[#F2994A] bg-[#FFF9F2] border-[#F2994A]/20";
      default: return "text-[#6C7688] bg-[#F5F6F8] border-[#E7E8EB]"; // pending, rescheduled
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      
      {/* --- 1. Top Action Bar (Matching Image) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-[#E7E8EB] gap-4 bg-[#FAFBFC]">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-[250px]">
            <input 
              type="text" 
              placeholder={t.clinic.search || "Search..."} 
              className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]"><SearchIcon /></span>
          </div>
          {/* Date Picker */}
          <div className="relative w-full sm:w-[220px]">
            <input 
              type="text" 
              placeholder="22 Feb 26 - 22 Feb 26" 
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#6C7688] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]"><CalendarSmallIcon /></span>
          </div>
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] font-medium text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors w-full md:w-auto justify-center">
          <FilterIcon /> {t.clinic.filters || "Filters"}
        </button>
      </div>

      {/* --- 2. Data Table --- */}
      <div className="w-full overflow-x-auto min-h-[400px]">
        <table className="w-full min-w-[900px]">
          <thead className="bg-white border-b border-[#E7E8EB]">
            <tr>
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic.date_time}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.clinic.doctor_name}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic.appointment_mode}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic.status || "Status"}</th>
              <th className="text-end py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[15%]"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? currentData.map((appt: any) => {
              const isExpanded = expandedId === appt.id;
              
              return (
                <React.Fragment key={appt.id}>
                  {/* Standard Row */}
                  <tr 
                    onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                    className={cn(
                      "border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group",
                      isExpanded ? "bg-[#FAFBFC]" : ""
                    )}
                  >
                    <td className="py-4 px-6 text-[13px] text-[#6C7688]" dir="ltr">
                      {appt.scheduledDate} - {appt.scheduledTime}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={appt.doctorImage} alt={appt.doctorName} className="w-9 h-9 rounded-full object-cover border border-[#E7E8EB]" />
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#0A1B39]">{appt.doctorName}</span>
                          <span className="text-[11px] text-[#9DA4B0]">{appt.doctorSpecialty}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[13px] text-[#6C7688] capitalize">
                      {t.clinic[`type_${appt.appointmentType}`] || appt.appointmentType}
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-bold border capitalize", getStatusColor(appt.status))}>
                        {t.clinic[`status_${appt.status}`] || appt.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-end">
                      <div className="flex justify-end items-center gap-3">
                        <div className={cn("text-[#9DA4B0] transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")}>
                          <ChevronDownSmall />
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <CustomDropdown 
                            trigger={<button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all"><MoreVerticalIcon /></button>}
                            items={[
                              { label: t.clinic.edit || "Edit", onClick: () => console.log("Edit") },
                              { label: t.clinic.delete || "Delete", onClick: () => console.log("Delete"), className: "text-[#EF1E1E]" }
                            ]}
                            width="w-32"
                            align="end"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detailed Row (SQL Data) */}
                  {isExpanded && (
                    <tr className="bg-[#FAFBFC] border-b border-[#E7E8EB]">
                      <td colSpan={5} className="p-0">
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-200 shadow-inner">
                          
                          {/* Col 1: Clinical Translations */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[14px] font-bold text-[#2E37A4] flex items-center gap-2 border-b border-[#E7E8EB] pb-2">
                              <FileTextOutlineIcon /> Clinical Details
                            </h4>
                            <div className="flex flex-col gap-1">
                              <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.chief_complaint}</span>
                              <span className="text-[13px] text-[#0A1B39] font-medium">{appt.translations.chiefComplaint || "-"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.symptoms_description}</span>
                              <span className="text-[13px] text-[#6C7688]">{appt.translations.symptoms || "-"}</span>
                            </div>
                            {appt.status === "cancelled" && (
                              <div className="flex flex-col gap-1 mt-2 p-3 bg-[#FEF2F2] border border-[#EF1E1E]/20 rounded-[8px]">
                                <span className="text-[12px] font-bold text-[#EF1E1E] flex items-center gap-1.5"><AlertCircleOutlineIcon /> {t.clinic.cancellation_reason}</span>
                                <span className="text-[13px] text-[#EF1E1E]">{appt.translations.cancellationReason || "No reason provided"}</span>
                              </div>
                            )}
                          </div>

                          {/* Col 2: Administrative & Financial */}
                          <div className="flex flex-col gap-4">
                            <h4 className="text-[14px] font-bold text-[#2E37A4] flex items-center gap-2 border-b border-[#E7E8EB] pb-2">
                              <WalletOutlineIcon /> Administrative & Financial
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.urgency_level}</span>
                                <span className={cn("text-[12px] font-bold uppercase", 
                                  appt.urgencyLevel === "emergency" ? "text-[#EF1E1E]" : 
                                  appt.urgencyLevel === "high" ? "text-[#F2994A]" : "text-[#0A1B39]"
                                )}>{appt.urgencyLevel}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[12px] font-semibold text-[#9DA4B0]">Duration</span>
                                <span className="text-[13px] font-medium text-[#0A1B39]">{appt.durationMinutes} Mins</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.consultation_fee}</span>
                                <span className="text-[14px] font-bold text-[#0A1B39]">{appt.fee} {appt.currency}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[12px] font-semibold text-[#9DA4B0]">{t.clinic.payment_status}</span>
                                <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-[4px] border w-fit capitalize", 
                                  appt.paymentStatus === "paid" ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : 
                                  appt.paymentStatus === "refunded" ? "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]" :
                                  "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20"
                                )}>
                                  {t.clinic[`pay_${appt.paymentStatus}`] || appt.paymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="mt-auto text-[10px] text-[#9DA4B0] font-mono">UUID: {appt.uuid}</div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            }) : (
              <tr><td colSpan={5} className="py-12 text-center text-[#9DA4B0]">No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- 3. Pagination Footer (Matching Image) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4">
        
        <div className="flex items-center gap-3 text-[13px] text-[#6C7688] font-medium">
          <span>{t.clinic.row_per_page || "Row Per Page"}</span>
          <CustomDropdown 
            trigger={
              <button className="flex items-center justify-between w-[60px] h-[32px] px-2 bg-white border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] font-bold text-[13px] hover:border-[#2E37A4] transition-all">
                {rowsPerPage}
                  <span className="w-4 h-4 text-[#6C7688] flex items-center justify-center">
                    <ChevronDownSmall />
                  </span>
              </button>
            }
            items={rowsOptions}
            width="w-[60px]"
            align="start"
          />
          <span>{t.clinic.entries || "Entries"}</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 transition-all shadow-sm"
          >
            <ChevronLeftIcon />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-all shadow-sm",
                currentPage === page 
                  ? "bg-[#2E37A4] text-white" 
                  : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
              )}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 transition-all shadow-sm"
          >
            <ChevronRightIcon />
          </button>
        </div>

      </div>
    </div>
  );
};