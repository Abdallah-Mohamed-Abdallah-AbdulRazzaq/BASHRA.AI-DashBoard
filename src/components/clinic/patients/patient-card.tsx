"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MoreVerticalIcon, CalendarSettingIcon } from "@/components/ui/icons/dashboard-icons";

interface PatientCardProps {
  t: any;
  patient: {
    id: number;
    patientId: string;
    name: string;
    age: string;
    gender: string;
    bloodGroup: string;
    image: string;
    lastVisit: string;
    status: "Active" | "In-patient" | "Discharged";
  };
}

export const PatientCard = ({ t, patient }: PatientCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex p-4 bg-white border border-[#E7E8EB] rounded-[12px] hover:shadow-md transition-all duration-300 relative group">
      
      {/* صورة المريض */}
      <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] bg-[#F5F6F8] rounded-[8px] overflow-hidden flex-shrink-0 mr-4 rtl:mr-0 rtl:ml-4">
        <img 
          src={patient.image} 
          alt={patient.name} 
          className="w-full h-full object-cover object-top mix-blend-multiply" 
        />
      </div>

      {/* تفاصيل المريض */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* الهيدر: الاسم والقائمة */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-[15px] font-bold text-[#0A1B39] truncate pr-2">{patient.name}</h3>
            <span className="text-[12px] text-[#2E37A4] font-semibold">{patient.patientId}</span>
          </div>
          
          {/* زر القائمة */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:bg-gray-50 transition-colors"
            >
              <MoreVerticalIcon />
            </button>

            {/* القائمة المنسدلة */}
            {isMenuOpen && (
              <div className="absolute right-0 rtl:left-0 top-8 w-32 bg-white border border-[#E7E8EB] rounded-[8px] shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full text-start px-3 py-2 text-[13px] text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors">
                  {t.clinic.edit || "Edit"}
                </button>
                <button className="w-full text-start px-3 py-2 text-[13px] text-[#EF1E1E] hover:bg-[#FEF2F2] transition-colors">
                  {t.clinic.delete || "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* الخصائص (العمر، الجنس، فصيلة الدم) */}
        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-[#F5F6F8] text-[#6C7688] text-[11px] font-medium rounded-[4px] border border-[#E7E8EB]">
            {patient.age}
          </span>
          <span className="px-2 py-0.5 bg-[#F5F6F8] text-[#6C7688] text-[11px] font-medium rounded-[4px] border border-[#E7E8EB] capitalize">
            {patient.gender}
          </span>
          <span className="px-2 py-0.5 bg-[#Fef2f2] text-[#EF1E1E] text-[11px] font-bold rounded-[4px] border border-[#EF1E1E]/20">
            {patient.bloodGroup}
          </span>
        </div>

        {/* الفوتر: الحالة وآخر زيارة */}
        <div className="mt-auto flex justify-between items-end pt-3">
          <div className="flex flex-col gap-1">
             <span className="text-[11px] text-[#9DA4B0]">{t.clinic.last_visit} : </span>
             <span className="text-[13px] font-bold text-[#0A1B39]" dir="ltr">{patient.lastVisit}</span>
          </div>
          
          <span className={cn(
            "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border",
            patient.status === "Active" ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : 
            patient.status === "In-patient" ? "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20" : 
            "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]"
          )}>
            {patient.status}
          </span>
        </div>

      </div>
    </div>
  );
};