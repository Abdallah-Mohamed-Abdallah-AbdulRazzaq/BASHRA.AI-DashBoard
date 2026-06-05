"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  GenderIcon, 
  ShieldCheckOutlineIcon, 
  FileTextOutlineIcon, 
  AlertCircleOutlineIcon 
} from "@/components/ui/icons/dashboard-icons";

// --- Helper Components ---
// 1️⃣ قمنا بإصلاح SectionCard ليكون flex-col ويأخذ flex-1 للتمدد بشكل صحيح بدون قص
const SectionCard = ({ title, icon, children, className }: { title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col", className)}>
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] shrink-0">
      <div className="text-[#2E37A4]">{icon}</div>
      <h3 className="text-[15px] font-bold text-[#0A1B39]">{title}</h3>
    </div>
    <div className="p-5 flex flex-col gap-2 flex-1">
      {children}
    </div>
  </div>
);

const DataRow = ({ label, value, dir = "auto", highlight = false }: { label: string, value: React.ReactNode, dir?: string, highlight?: boolean }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#E7E8EB] border-dashed last:border-0 last:pb-0 first:pt-0 gap-2">
    <span className="text-[13px] text-[#6C7688] font-medium min-w-[150px]">{label}</span>
    <span 
      className={cn(
        "text-[14px] font-semibold text-start sm:text-end capitalize",
        highlight ? "text-[#2E37A4]" : "text-[#0A1B39]"
      )} 
      dir={dir}
    >
      {value || "-"}
    </span>
  </div>
);

const TextBlock = ({ label, text }: { label: string, text: string }) => (
  <div className="flex flex-col gap-1.5 mb-5 last:mb-0">
    <span className="text-[13px] font-bold text-[#0A1B39]">{label}</span>
    <p className="text-[13px] text-[#6C7688] leading-relaxed bg-[#FAFBFC] p-3.5 rounded-[8px] border border-[#E7E8EB]">
      {text || "-"}
    </p>
  </div>
);

// --- Main Component ---
interface PatientProfilesTabProps {
  t: any;
  patient: any;
}

export const PatientProfilesTab = ({ t, patient }: PatientProfilesTabProps) => {
  const profile = patient.patientProfile?.data || {};
  const translations = patient.patientProfile?.translations || {};

  const renderBadges = (text: string, colorClass: string) => {
    if (!text) return <span className="text-[13px] text-[#9DA4B0]">-</span>;
    const items = text.split(',').map(i => i.trim());
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={idx} className={cn("px-2.5 py-1 text-[12px] font-semibold rounded-[6px] border", colorClass)}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Column 1: Physical, Lifestyle & Insurance --- */}
      <div className="flex flex-col gap-6 h-full">
        
        {/* Physical & Lifestyle */}
        <SectionCard title={t.clinic.physical_lifestyle} icon={<GenderIcon />}>
          <DataRow 
            label={t.clinic.blood_group} 
            value={<span className="bg-[#Fef2f2] text-[#EF1E1E] px-2 py-0.5 rounded border border-[#EF1E1E]/20">{profile.bloodType}</span>} 
            dir="ltr" 
          />
          <DataRow label={t.clinic.height} value={`${profile.height} cm`} dir="ltr" />
          <DataRow label={t.clinic.weight} value={`${profile.weight} kg`} dir="ltr" />
          <DataRow label={t.clinic.smoking_status} value={profile.smokingStatus} />
          <DataRow label={t.clinic.alcohol_consumption} value={profile.alcoholConsumption} />
          <DataRow label={t.clinic.exercise_frequency} value={profile.exerciseFrequency} />
        </SectionCard>

        {/* Insurance & Preferences */}
        {/* 2️⃣ إضافة flex-1 ليتمدد الكارت للأسفل بالتساوي */}
        <SectionCard className="flex-1" title={t.clinic.insurance_preferences} icon={<ShieldCheckOutlineIcon />}>
          <DataRow label={t.clinic.insurance_provider} value={profile.insuranceProvider} highlight />
          <DataRow label={t.clinic.policy_number} value={profile.insurancePolicyNumber} dir="ltr" />
          <DataRow label={t.clinic.preferred_doctor} value={profile.preferredDoctorName} />
        </SectionCard>

      </div>

      {/* --- Column 2: Clinical Background & Translations --- */}
      <div className="flex flex-col gap-6 h-full">

        {/* Quick Lists (Allergies & Medications) */}
        <SectionCard title={t.clinic.allergies + " & " + t.clinic.current_medications} icon={<AlertCircleOutlineIcon />}>
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-[13px] font-bold text-[#0A1B39]">{t.clinic.allergies}</span>
            {renderBadges(translations.allergies, "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20")}
          </div>
          <div className="w-full border-t border-dashed border-[#E7E8EB] my-1"></div>
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[13px] font-bold text-[#0A1B39]">{t.clinic.current_medications}</span>
            {renderBadges(translations.currentMedications, "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20")}
          </div>
        </SectionCard>

        {/* Long Text Clinical Background */}
        {/* 3️⃣ الكارت الذي كان مقصوصاً سيأخذ flex-1 ليعرض محتواه بالكامل مهما كان طوله */}
        <SectionCard className="flex-1" title={t.clinic.clinical_background} icon={<FileTextOutlineIcon />}>
          <TextBlock label={t.clinic.medical_history} text={translations.medicalHistory} />
          <TextBlock label={t.clinic.chronic_conditions} text={translations.chronicConditions} />
          <TextBlock label={t.clinic.family_medical_history} text={translations.familyMedicalHistory} />
        </SectionCard>

      </div>

    </div>
  );
};