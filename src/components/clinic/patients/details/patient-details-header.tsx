"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarSmallIcon, PhoneOutlineIcon } from "@/components/ui/icons/dashboard-icons";
import { cn } from "@/lib/utils";

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-0 rtl:rotate-180">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

interface PatientHeaderProps {
  t: any;
  patient: any;
}

export const PatientDetailsHeader = ({ t, patient }: PatientHeaderProps) => {
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* زر العودة */}
      <Link href={`/${lang}/clinic/patients`} className="flex items-center gap-2 text-[15px] font-bold text-[#0A1B39] hover:text-[#2E37A4] transition-colors w-fit">
        <BackArrowIcon /> {t.clinic.back_to_patients || "Back to Patients"}
      </Link>

      {/* الكارت الرئيسي */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        
        {/* القسم الأيسر: الصورة والمعلومات */}
        <div className="flex items-center gap-5">
          <div className="w-[100px] h-[100px] rounded-[12px] overflow-hidden bg-[#F5F6F8] shrink-0 border-[3px] border-[#F9FAFB]">
            <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[20px] font-bold text-[#0A1B39]">{patient.name}</h2>
              <span className="px-2.5 py-1 bg-[#Fef2f2] text-[#EF1E1E] text-[11px] font-bold rounded-[6px] shadow-sm">
                {patient.bloodGroup}
              </span>
            </div>
            
            <p className="text-[13px] text-[#6C7688] mb-3">
              {patient.patientId} • {patient.gender} • {patient.age}
            </p>
            
            <div className="flex items-center gap-4 text-[13px]">
              <div className="flex items-center gap-1.5 text-[#6C7688] font-medium">
                <PhoneOutlineIcon /> {patient.phone}
              </div>
              <span className="px-2.5 py-1 bg-[#F0FDF4] text-[#27AE60] text-[11px] font-bold rounded-[6px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]"></span> 
                {patient.status}
              </span>
            </div>
          </div>
        </div>

        {/* القسم الأيمن: العلامات الحيوية (Vitals) */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto mt-4 xl:mt-0 pt-4 xl:pt-0 border-t xl:border-t-0 border-[#E7E8EB]">
          <VitalCard label={t.clinic.weight} value={patient.vitals.weight} unit="kg" color="text-[#2E37A4]" bg="bg-[#E0E2F4]/50" />
          <VitalCard label={t.clinic.height} value={patient.vitals.height} unit="cm" color="text-[#27AE60]" bg="bg-[#F0FDF4]" />
          <VitalCard label={t.clinic.blood_pressure} value={patient.vitals.bloodPressure} unit="mmHg" color="text-[#EF1E1E]" bg="bg-[#FEF2F2]" />
          <VitalCard label={t.clinic.heart_rate} value={patient.vitals.heartRate} unit="bpm" color="text-[#F2994A]" bg="bg-[#FFF9F2]" />
        </div>

      </div>
    </div>
  );
};

const VitalCard = ({ label, value, unit, color, bg }: any) => (
  <div className={cn("flex flex-col px-4 py-2.5 rounded-[8px] border border-[#E7E8EB] min-w-[100px]", bg)}>
    <span className="text-[11px] font-semibold text-[#6C7688] mb-0.5">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className={cn("text-[16px] font-bold", color)}>{value}</span>
      <span className="text-[10px] font-medium text-[#9DA4B0]">{unit}</span>
    </div>
  </div>
);