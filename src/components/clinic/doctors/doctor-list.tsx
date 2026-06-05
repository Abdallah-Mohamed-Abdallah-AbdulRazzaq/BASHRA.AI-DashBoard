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

interface DoctorListProps {
  t: any;
}

export const DoctorList = ({ t }: DoctorListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- Dummy Data ---
  const doctors = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "Dr. Mick Thompson" : "Dr. Sarah Johnson",
    role: i % 2 === 0 ? "Cardiologist" : "Orthopedic Surgeon",
    department: i % 2 === 0 ? "Cardiology" : "Orthopedics",
    phone: "+1 54554 54584",
    email: i % 2 === 0 ? "mick@example.com" : "sarah@example.com",
    fees: i % 2 === 0 ? "$458" : "$512",
    status: i === 5 ? "Unavailable" : "Available",
    img: i % 2 === 0 
      ? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop" 
      : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&auto=format&fit=crop"
  }));

  // --- Pagination Logic ---
  const totalPages = Math.ceil(doctors.length / rowsPerPage);
  const currentData = doctors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Action Menu Items
  const actionItems = [
    { label: "Edit", onClick: () => console.log("Edit") },
    { label: "Delete", onClick: () => console.log("Delete"), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" },
  ];

  // Rows Per Page Options
  const rowsOptions = [
    { label: "10", onClick: () => { setRowsPerPage(10); setCurrentPage(1); } },
    { label: "20", onClick: () => { setRowsPerPage(20); setCurrentPage(1); } },
    { label: "50", onClick: () => { setRowsPerPage(50); setCurrentPage(1); } },
  ];

  return (
    <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Table Container --- */}
      <div className="w-full overflow-x-auto min-h-[400px] rounded-t-[12px]"> 
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E7E8EB] bg-white">
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.clinic.name_designation}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.department}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.phone}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.clinic.email}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.fees}</th>
              <th className="text-center py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.status}</th>
              <th className="text-end py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((doc) => (
              <tr key={doc.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <img src={doc.img} alt={doc.name} className="w-10 h-10 rounded-full object-cover border-[2px] border-[#F5F6F8]" />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{doc.name}</span>
                      <span className="text-[12px] text-[#6C7688]">{doc.role}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]">{doc.department}</span></td>
                <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]" dir="ltr">{doc.phone}</span></td>
                <td className="py-3 px-4"><span className="text-[13px] text-[#6C7688]">{doc.email}</span></td>
                <td className="py-3 px-4"><span className="text-[14px] font-bold text-[#0A1B39]">{doc.fees}</span></td>
                
                <td className="py-3 px-4 text-center">
                  <span className={cn("px-3 py-1 rounded-[4px] text-[11px] font-medium border inline-block min-w-[80px]", doc.status === "Available" ? "text-[#27AE60] border-[#27AE60]" : "text-[#EF1E1E] border-[#EF1E1E]")}>
                    {doc.status === "Available" ? t.clinic.available : t.clinic.unavailable}
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

      {/* --- Pagination Footer --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4 rounded-b-[12px]">
        
        <div className="flex items-center gap-3 text-[13px] text-[#6C7688] font-medium">
          <span>{t.clinic.row_per_page}</span>
          
          <CustomDropdown 
            trigger={
              <button className="flex items-center justify-between w-[65px] h-[34px] px-2.5 bg-white border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] font-bold text-[13px] hover:border-[#2E37A4] transition-all shadow-sm">
                {rowsPerPage}
                {/* 👈 هنا قمنا بحل الخطأ من خلال تغليف الأيقونة في span وتمرير الكلاس له */}
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

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
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
                  ? "bg-[#2E37A4] text-white border border-[#2E37A4] shadow-indigo-200" 
                  : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
              )}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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