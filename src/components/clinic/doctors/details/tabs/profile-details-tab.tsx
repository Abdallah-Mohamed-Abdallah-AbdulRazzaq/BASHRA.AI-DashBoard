"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  ShieldCheckOutlineIcon, StethoscopeOutlineIcon, FileTextOutlineIcon, 
  UsersOutlineIcon, AlertCircleOutlineIcon, SettingsOutlineIcon
} from "@/components/ui/icons/dashboard-icons";

interface ProfileDetailsTabProps {
  t: any;
  doctor: any;
}

// ----------------------------------------------------------------------
// Helper Components for clean code
// ----------------------------------------------------------------------
const SectionCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC]">
      <div className="text-[#2E37A4]">{icon}</div>
      <h3 className="text-[15px] font-bold text-[#0A1B39]">{title}</h3>
    </div>
    <div className="p-5 flex flex-col">
      {children}
    </div>
  </div>
);

const DataRow = ({ label, value, dir = "auto" }: { label: string, value: React.ReactNode, dir?: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#E7E8EB] border-dashed last:border-0 last:pb-0 first:pt-0 gap-1 sm:gap-4">
    <span className="text-[13px] text-[#6C7688] font-medium min-w-[140px]">{label}</span>
    <div className="text-[14px] font-semibold text-[#0A1B39] text-start sm:text-end" dir={dir}>
      {value || "-"}
    </div>
  </div>
);

// ----------------------------------------------------------------------
// Main Tab Component
// ----------------------------------------------------------------------
export const ProfileDetailsTab = ({ t, doctor }: ProfileDetailsTabProps) => {
  const profile = doctor.profileDetails;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-6">
        
        {/* 1. Verification & Approval */}
        <SectionCard title={t.clinic.verification_info} icon={<ShieldCheckOutlineIcon />}>
          <DataRow 
            label={t.clinic.approval_status} 
            value={
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border inline-block",
                profile.approvalStatus === 'approved' ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20"
              )}>
                {profile.approvalStatus === 'approved' ? t.clinic.approved : t.clinic.pending}
              </span>
            } 
          />
          <DataRow 
            label={t.clinic.is_verified} 
            value={
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border inline-block",
                profile.isVerified ? "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
              )}>
                {profile.isVerified ? t.clinic.verified : t.clinic.unverified}
              </span>
            } 
          />
          <DataRow label={t.clinic.verification_date} value={profile.verificationDate} dir="ltr" />
        </SectionCard>

        {/* 2. Professional Identity */}
        <SectionCard title={t.clinic.professional_identity} icon={<StethoscopeOutlineIcon />}>
          <DataRow label={t.sidebar.doctor_details} value={profile.fullName} />
          <DataRow label={t.clinic.specialty} value={profile.specialty} />
          <DataRow label={t.clinic.sub_specialty} value={profile.subSpecialty} />
          <DataRow label={t.clinic.medical_license} value={profile.licenseNumber} />
          <DataRow label={t.clinic.years_of_experience} value={`${profile.yearsOfExperience} Years`} />
        </SectionCard>

        {/* 3. Academic Credentials */}
        <SectionCard title={t.clinic.academic_credentials} icon={<FileTextOutlineIcon />}>
          <DataRow label={t.clinic.medical_school} value={profile.medicalSchool} />
          <DataRow label={t.clinic.graduation_year} value={profile.graduationYear} dir="ltr" />
          <div className="flex flex-col py-3">
            <span className="text-[13px] text-[#6C7688] font-medium mb-2">{t.clinic.board_certifications}</span>
            <div className="flex flex-wrap gap-2">
              {profile.boardCertifications.map((cert: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#F5F6F8] text-[#0A1B39] text-[12px] font-medium rounded-[6px] border border-[#E7E8EB]">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

      </div>

      {/* --- Column 2 --- */}
      <div className="flex flex-col gap-6">

        {/* 4. Personal & Demographics */}
        <SectionCard title={t.clinic.personal_demographics} icon={<UsersOutlineIcon />}>
          <DataRow label={t.clinic.dob} value={profile.dob} dir="ltr" />
          <DataRow label={t.clinic.gender} value={<span className="capitalize">{profile.gender}</span>} />
          <DataRow label={t.clinic.nationality} value={profile.nationality} />
          <div className="flex flex-col py-3">
            <span className="text-[13px] text-[#6C7688] font-medium mb-2">{t.clinic.languages_spoken}</span>
            <div className="flex flex-wrap gap-2">
              {profile.languagesSpoken.map((lang: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#F0FDF4] text-[#27AE60] text-[12px] font-bold rounded-[6px] border border-[#27AE60]/20">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* 5. Emergency Contact */}
        <SectionCard title={t.clinic.emergency_contact} icon={<AlertCircleOutlineIcon />}>
          <DataRow label={t.clinic.contact_name} value={profile.emergencyContactName} />
          <DataRow label={t.clinic.relationship} value={profile.emergencyRelationship} />
          <DataRow label={t.clinic.phone_number} value={profile.emergencyPhone} dir="ltr" />
        </SectionCard>

        {/* 6. System Preferences */}
        <SectionCard title={t.clinic.system_preferences} icon={<SettingsOutlineIcon />}>
          <DataRow label={t.clinic.timezone} value={<span className="font-mono text-[12px] bg-gray-100 px-2 py-1 rounded">{profile.timezone}</span>} dir="ltr" />
          <DataRow label={t.clinic.system_language} value={<span className="uppercase">{profile.languagePreference}</span>} dir="ltr" />
        </SectionCard>

      </div>

    </div>
  );
};