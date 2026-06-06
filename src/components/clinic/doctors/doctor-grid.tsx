"use client";

import React from "react";
import { DoctorCard } from "./doctor-card";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons/dashboard-icons";
import type { DoctorListItem } from "@/types/admin-doctors";

interface DoctorGridProps {
  t: any;
  doctors?: DoctorListItem[];
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  lang?: string;
}

export const DoctorGrid = ({
  t,
  doctors = [],
  loading = false,
  error = null,
  currentPage = 1,
  totalPages = 0,
  onPageChange,
  onRetry,
  lang = "en"
}: DoctorGridProps) => {

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[14px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white border border-[#E7E8EB] rounded-[12px] gap-4">
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
      <div className="flex items-center justify-center min-h-[400px] w-full bg-white border border-[#E7E8EB] rounded-[12px]">
        <span className="text-[14px] text-[#6C7688]">No doctors found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} t={t} doctor={doctor} lang={lang} />
        ))}
      </div>

      {totalPages > 0 && onPageChange && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white"
          >
            <ChevronLeftIcon />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-[8px] text-[13px] font-medium transition-all",
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
            disabled={currentPage >= totalPages}
            className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
};
