"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FilterIcon } from "@/components/ui/icons/dashboard-icons";

// أيقونة إغلاق للموبايل
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface DoctorFilterProps {
  t: any;
  onApply?: (filters: Record<string, string>) => void;
}

export const DoctorFilter = ({ t, onApply }: DoctorFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // --- Filter States ---
  const [filters, setFilters] = useState<Record<string, string>>({
    status: "", approval_status: "", is_verified: ""
  });

  // إغلاق عند النقر بالخارج (للديسكتوب فقط)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 640 && filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // منع السكرول للصفحة الخلفية عند فتح الفلتر في الموبايل
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleChange = (field: string, value: string) => { setFilters(prev => ({ ...prev, [field]: value })); };
  const handleReset = (field: string) => { setFilters(prev => ({ ...prev, [field]: "" })); };
  const handleClearAll = () => {
    const cleared = { status: "", approval_status: "", is_verified: "" };
    setFilters(cleared);
    onApply?.(cleared);
  };

  const FieldLabel = ({ label, fieldKey }: { label: string, fieldKey: string }) => (
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[13px] font-semibold text-[#0A1B39]">{label}</span>
      <button onClick={() => handleReset(fieldKey)} className="text-[11px] font-medium text-[#2E37A4] hover:underline">
        {t.clinic.reset}
      </button>
    </div>
  );

  return (
    <div className="relative inline-block" ref={filterRef}>
      
      {/* زر الفلتر */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 bg-white border rounded-[8px] text-[13px] font-medium transition-all",
          isOpen ? "border-[#2E37A4] text-[#2E37A4] bg-[#F5F6F8]" : "border-[#E7E8EB] text-[#6C7688] hover:text-[#0A1B39] hover:border-[#D1D5DB]"
        )}
      >
        <FilterIcon /> {t.clinic.filters}
      </button>

      {/* --- طبقة التعتيم (Mobile Overlay) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] sm:hidden animate-in fade-in duration-200 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- قائمة الفلتر --- */}
      {isOpen && (
        <div className={cn(
          "bg-white border border-[#E7E8EB] rounded-[12px] shadow-2xl flex flex-col overflow-hidden",
          
          // 📱 Mobile Styles: توسيط إجباري ثابت في الشاشة
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[350px] max-h-[85vh] z-[70]",
          
          // 💻 Desktop Styles: إعادة تعيين الموبايل وتطبيق المحاذاة الذكية
          "sm:absolute sm:top-full sm:mt-2 sm:w-[350px] sm:max-h-[600px] sm:z-50",
          "sm:left-auto sm:translate-x-0 sm:translate-y-0", // إلغاء التوسيط الخاص بالموبايل
          
          // 🚀 الحل الجذري للاتجاهات: (تفتح للداخل دائماً)
          "sm:[inset-inline-end:0]",
          
          "animate-in zoom-in-95 duration-200"
        )}>
          
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-[#E7E8EB] bg-white sticky top-0 z-10">
            <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.clinic.filter}</h3>
            <div className="flex items-center gap-3">
              <button onClick={handleClearAll} className="text-[12px] font-medium text-[#EF1E1E] hover:underline">
                {t.clinic.clear_all}
              </button>
              <button onClick={() => setIsOpen(false)} className="sm:hidden text-gray-500 p-1">
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 bg-white">
            
            <div>
              <FieldLabel label={t.clinic?.status || "Status"} fieldKey="status" />
              <select value={filters.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4]">
                <option value="" disabled>{t.clinic?.select_option || "Select option"}</option>
                <option value="active">{t.clinic?.active || "Active"}</option>
                <option value="inactive">{t.clinic?.status_inactive || "Inactive"}</option>
                <option value="suspended">{t.clinic?.status_suspended || "Suspended"}</option>
                <option value="pending_verification">{t.clinic?.status_pending_verification || "Pending Verification"}</option>
              </select>
            </div>

            <div>
              <FieldLabel label={t.clinic?.approval_status || "Approval Status"} fieldKey="approval_status" />
              <select value={filters.approval_status} onChange={(e) => handleChange("approval_status", e.target.value)} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4]">
                <option value="" disabled>{t.clinic?.select_option || "Select option"}</option>
                <option value="approved">{t.clinic?.approved || "Approved"}</option>
                <option value="pending">{t.clinic?.pending || "Pending"}</option>
                <option value="rejected">{t.clinic?.reject_doctor || "Rejected"}</option>
                <option value="suspended">{t.clinic?.status_suspended || "Suspended"}</option>
              </select>
            </div>

            <div>
              <FieldLabel label={t.clinic?.verification_status || "Verification Status"} fieldKey="is_verified" />
              <select value={filters.is_verified} onChange={(e) => handleChange("is_verified", e.target.value)} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4]">
                <option value="" disabled>{t.clinic?.select_option || "Select option"}</option>
                <option value="true">{t.clinic?.verified || "Verified"}</option>
                <option value="false">{t.clinic?.unverified || "Unverified"}</option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-3 p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] sticky bottom-0 z-10">
            <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E8EB] transition-colors">
              {t.clinic.close}
            </button>
            <button onClick={() => { onApply?.(filters); setIsOpen(false); }} className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88] transition-colors shadow-sm">
              {t.clinic.apply}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};