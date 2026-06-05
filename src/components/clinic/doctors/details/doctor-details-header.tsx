"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BuildingOutlineIcon, CalendarSmallIcon } from "@/components/ui/icons/dashboard-icons";

// أيقونة العودة (تنعكس تلقائياً في العربية)
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-0 rtl:rotate-180">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

interface DoctorHeaderProps {
  t: any;
  doctor: any;
}

export const DoctorDetailsHeader = ({ t, doctor }: DoctorHeaderProps) => {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* زر العودة */}
      <Link href={`/${lang}/clinic/doctors`} className="flex items-center gap-2 text-[15px] font-bold text-[#0A1B39] hover:text-[#2E37A4] transition-colors w-fit">
        <BackArrowIcon /> {t.clinic.back_to_doctors}
      </Link>

      {/* الكارت الرئيسي (مُطابق للصورة) */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-4 sm:p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* القسم الأيسر: الصورة والمعلومات */}
        <div className="flex items-center gap-5">
          {/* الصورة */}
          <div className="w-[100px] h-[100px] rounded-[12px] overflow-hidden bg-[#F5F6F8] shrink-0">
            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
          </div>

          {/* المعلومات */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[20px] font-bold text-[#0A1B39]">{doctor.name}</h2>
              <span className="px-2.5 py-1 border border-[#E7E8EB] text-[#0A1B39] text-[11px] font-semibold rounded-[6px] flex items-center gap-1.5 shadow-sm">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#2E37A4]"></span> {doctor.specialty}
              </span>
            </div>
            
            <p className="text-[13px] text-[#6C7688] mb-3">{doctor.degrees}</p>
            
            <div className="flex items-center gap-4 text-[13px]">
              <div className="flex items-center gap-1.5 text-[#6C7688] font-medium">
                <BuildingOutlineIcon /> Clinic : {doctor.clinic}
              </div>
              <span className="px-2.5 py-1 bg-[#F0FDF4] text-[#27AE60] text-[11px] font-bold rounded-[6px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]"></span> 
                {doctor.status === "available" ? t.clinic.available : t.clinic.unavailable}
              </span>
            </div>
          </div>
        </div>

        {/* القسم الأيمن: السعر وزر الحجز */}
        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto mt-2 md:mt-0">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[12px] text-[#9DA4B0] font-medium">{t.clinic.consultation_charge}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-bold text-[#0A1B39]">{doctor.charge}</span>
              <span className="text-[13px] text-[#6C7688]">/ {doctor.session_duration}</span>
            </div>
          </div>
          <button className="w-full md:w-auto px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm flex items-center justify-center gap-2">
            <CalendarSmallIcon /> {t.clinic.book_appointment}
          </button>
        </div>

      </div>
    </div>
  );
};