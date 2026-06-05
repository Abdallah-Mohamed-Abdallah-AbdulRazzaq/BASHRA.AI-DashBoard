"use client";

import React from "react";
import { PatientViewToggle } from "./patient-view-toggle";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { PatientFilter } from "./patient-filter";
import { PlusIcon, ChevronDownSmall, SearchIcon } from "@/components/ui/icons/dashboard-icons";

interface PatientHeaderProps {
  t: any;
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  totalPatients: number;
}

export const PatientHeader = ({ t, view, setView, totalPatients }: PatientHeaderProps) => {
  
  const exportItems = [
    { label: "Download as PDF", onClick: () => console.log("PDF") },
    { label: "Download as Excel", onClick: () => console.log("Excel") },
  ];

  const sortItems = [
    { label: "Recently Added", onClick: () => console.log("Recent") },
    { label: "Last Visit (Newest)", onClick: () => console.log("Visit Newest") },
    { label: "Last Visit (Oldest)", onClick: () => console.log("Visit Oldest") },
    { label: "Name A-Z", onClick: () => console.log("A-Z") },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-[#0A1B39]">
            {view === "list" ? t.clinic.patient_list : t.clinic.patient_grid}
          </h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {t.clinic.total_patients} : {totalPatients}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          {view === "list" ? (
            <CustomDropdown 
              trigger={
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] font-medium text-[#0A1B39] hover:bg-gray-50 transition-colors">
                  {t.clinic.export || "Export"} <ChevronDownSmall />
                </button>
              }
              items={exportItems}
              width="w-48"
              align="end"
            />
          ) : (
            <PatientFilter t={t} />
          )}

          <PatientViewToggle view={view} onChange={setView} />

          <button className="flex items-center gap-2 px-4 py-2 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200">
            <PlusIcon /> {t.clinic.new_patient}
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
              placeholder={t.clinic.search || "Search..."} 
              className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]">
               <SearchIcon />
            </span>
          </div>

          {/* Filters & Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <PatientFilter t={t} />
            <CustomDropdown 
              trigger={
                <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] font-medium text-[#6C7688] hover:text-[#0A1B39] hover:border-[#D1D5DB] transition-all min-w-[160px] justify-between">
                   {t.clinic.sort_by || "Sort By"} : <span className="text-[#0A1B39] font-semibold">{t.clinic.recent || "Recent"}</span> <ChevronDownSmall />
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