"use client";

import React from "react";
import { PatientCard } from "./patient-card";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons/dashboard-icons";
import type { AdminUserListItem } from "@/types/admin-users";

interface PatientGridProps {
  t: any;
  patients: AdminUserListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const PatientGrid = ({ t, patients, currentPage, totalPages, onPageChange, onRetry, loading, error }: PatientGridProps) => {

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
    <div className="flex flex-col gap-8 w-full">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {patients.map((patient) => (
          <PatientCard key={patient.id} t={t} patient={patient} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white shadow-sm"
        >
          <ChevronLeftIcon />
        </button>

        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-[8px] text-[13px] font-medium transition-all shadow-sm",
              currentPage === page 
                ? "bg-[#2E37A4] text-white shadow-md shadow-indigo-200" 
                : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
            )}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white shadow-sm"
        >
          <ChevronRightIcon />
        </button>
      </div>

    </div>
  );
};