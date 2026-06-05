"use client";

import React from "react";
import { DoctorViewToggle } from "./doctor-view-toggle";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { DoctorFilter } from "./doctor-filter"; // 👈 Import New Component
import { 
  PlusIcon, 
  FilterIcon, 
  ChevronDownSmall,
  SearchIcon 
} from "@/components/ui/icons/dashboard-icons";

interface DoctorHeaderProps {
  t: any;
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  totalDoctors: number;
}

export const DoctorHeader = ({ t, view, setView, totalDoctors }: DoctorHeaderProps) => {
  
  // ... (Keep sortItems and exportItems same as before) ...
  const exportItems = [
    { label: "Download as PDF", onClick: () => console.log("PDF") },
    { label: "Download as Excel", onClick: () => console.log("Excel") },
  ];

  const sortItems = [
    { label: "Recently Added", onClick: () => console.log("Recent") },
    { label: "Ascending", onClick: () => console.log("Asc") },
    { label: "Descending", onClick: () => console.log("Desc") },
    { label: "Last Month", onClick: () => console.log("Month") },
    { label: "Last 7 Days", onClick: () => console.log("Week") },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-[#0A1B39]">
            {view === "list" ? t.clinic.doctor_list : t.clinic.doctor_grid}
          </h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {t.clinic.total_doctors} : {totalDoctors}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          {view === "list" ? (
            // Export Dropdown
            <CustomDropdown 
              trigger={
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] font-medium text-[#0A1B39] hover:bg-gray-50 transition-colors">
                  {t.clinic.export} <ChevronDownSmall />
                </button>
              }
              items={exportItems}
              width="w-48"
              align="end" // 👈 لأنه في نهاية السطر
            />
          ) : (
            // Grid View - Using the Filter Component
            <DoctorFilter t={t} />
          )}

          <DoctorViewToggle view={view} onChange={setView} />

          <button className="flex items-center gap-2 px-4 py-2 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200">
            <PlusIcon /> {t.clinic.new_doctor}
          </button>
        </div>
      </div>

      {/* Bottom Row (List View Only) */}
      {view === "list" && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Search */}
          <div className="relative w-full sm:w-[300px]">
            <input 
              type="text" 
              placeholder={t.clinic.search} 
              className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]">
               <SearchIcon />
            </span>
          </div>

          {/* Filters & Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            
            {/* Filter Component (Here too) */}
            <DoctorFilter t={t} />

            {/* Sort Dropdown */}
            <CustomDropdown 
              trigger={
                <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] font-medium text-[#6C7688] hover:text-[#0A1B39] hover:border-[#D1D5DB] transition-all min-w-[160px] justify-between">
                   {t.clinic.sort_by} : <span className="text-[#0A1B39] font-semibold">{t.clinic.recent}</span> <ChevronDownSmall />
                </button>
              }
              items={sortItems}
              width="w-48"
              align="end"
            />
          </div>
        </div>
      )}
    </div>
  );
};