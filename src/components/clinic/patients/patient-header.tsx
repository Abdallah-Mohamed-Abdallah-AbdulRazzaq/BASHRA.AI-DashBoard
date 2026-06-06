"use client";

import React, { useState, useRef, useEffect } from "react";
import { PatientViewToggle } from "./patient-view-toggle";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { PatientFilter } from "./patient-filter";
import { PlusIcon, ChevronDownSmall, SearchIcon } from "@/components/ui/icons/dashboard-icons";

interface StatusFilterOption {
  label: string;
  value: string;
}

interface PatientHeaderProps {
  t: any;
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  totalPatients: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onStatusFilterChange?: (status: string) => void;
  onVerifiedFilterChange?: (value: string) => void;
}

export const PatientHeader = ({ t, view, setView, totalPatients, searchQuery, onSearchChange, onStatusFilterChange, onVerifiedFilterChange }: PatientHeaderProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery || "");
  }, [searchQuery]);

  const handleSearchInput = (value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange?.(value);
    }, 500);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    setStatusOpen(false);
    onStatusFilterChange?.(value);
  };

  const statusOptions: StatusFilterOption[] = [
    { label: t.clinic.all_statuses || "All Statuses", value: "" },
    { label: t.clinic.active || "Active", value: "active" },
    { label: t.clinic.status_inactive || "Inactive", value: "inactive" },
    { label: t.clinic.status_suspended || "Suspended", value: "suspended" },
    { label: t.clinic.status_pending_verification || "Pending Verification", value: "pending_verification" },
  ];

  const exportItems = [
    { label: "Download as PDF", onClick: () => console.log("PDF") },
    { label: "Download as Excel", onClick: () => console.log("Excel") },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-[#0A1B39]">
            {view === "list" ? t.clinic.patient_list : t.clinic.patient_grid}
          </h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {t.clinic.total_patients} : {totalPatients}
          </span>
        </div>

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
            <PatientFilter t={t} onVerifiedFilterChange={onVerifiedFilterChange} />
          )}

          <PatientViewToggle view={view} onChange={setView} />

          <button className="flex items-center gap-2 px-4 py-2 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200">
            <PlusIcon /> {t.clinic.new_patient}
          </button>
        </div>
      </div>

      {view === "list" && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          <div className="relative w-full sm:w-[300px]">
            <input 
              type="text" 
              value={localSearch}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder={t.clinic.search || "Search..."} 
              className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]">
               <SearchIcon />
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <button 
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-2 px-3 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] font-medium text-[#6C7688] hover:text-[#0A1B39] transition-all min-w-[140px] justify-between"
              >
                {selectedStatus ? statusOptions.find(o => o.value === selectedStatus)?.label : (t.clinic.status || "Status")}
                <ChevronDownSmall />
              </button>
              {statusOpen && (
                <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-[#E7E8EB] rounded-[8px] shadow-lg z-20 py-1">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusSelect(opt.value)}
                      className="w-full text-start px-3 py-2 text-[13px] text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <PatientFilter t={t} onVerifiedFilterChange={onVerifiedFilterChange} />
          </div>
        </div>
      )}
    </div>
  );
};