"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  ShieldCheckOutlineIcon, 
  UsersOutlineIcon, 
  AlertCircleOutlineIcon, 
  SettingsOutlineIcon,
  CheckCircleSolidIcon,
  XCircleSolidIcon
} from "@/components/ui/icons/dashboard-icons";

// ----------------------------------------------------------------------
// Helper Components for clean code
// ----------------------------------------------------------------------
const SectionCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden h-full">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC]">
      <div className="text-[#2E37A4]">{icon}</div>
      <h3 className="text-[15px] font-bold text-[#0A1B39]">{title}</h3>
    </div>
    <div className="p-5 flex flex-col gap-1">
      {children}
    </div>
  </div>
);

const DataRow = ({ label, value, dir = "auto", badge }: { label: string, value: React.ReactNode, dir?: string, badge?: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#E7E8EB] border-dashed last:border-0 last:pb-0 first:pt-0 gap-2">
    <span className="text-[13px] text-[#6C7688] font-medium min-w-[140px]">{label}</span>
    <div className="flex items-center gap-2 justify-start sm:justify-end">
      <span className="text-[14px] font-semibold text-[#0A1B39] text-start sm:text-end" dir={dir}>
        {value || "-"}
      </span>
      {badge && <div>{badge}</div>}
    </div>
  </div>
);

const VerifiedBadge = ({ isVerified, t }: { isVerified: boolean, t: any }) => (
  <span className={cn(
    "flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold border",
    isVerified ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
  )}>
    {isVerified ? <CheckCircleSolidIcon /> : <XCircleSolidIcon />}
    {isVerified ? t.clinic.verified : t.clinic.unverified}
  </span>
);

// ----------------------------------------------------------------------
// Main Tab Component
// ----------------------------------------------------------------------
interface GeneralInfoTabProps {
  t: any;
  patient: any; // البيانات ستأتي مهندلة من المكون الرئيسي
}

export const GeneralInfoTab = ({ t, patient }: GeneralInfoTabProps) => {
  // فصلنا البيانات لتطابق الجداول
  const { account, profile, translations } = patient.generalInfo;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-6">
        
        {/* 1. Account & Security (From `users` table) */}
        <SectionCard title={t.clinic.account_security} icon={<ShieldCheckOutlineIcon />}>
          <DataRow 
            label={t.clinic.uuid} 
            value={<span className="font-mono text-[11px] text-[#9DA4B0] bg-[#F5F6F8] px-2 py-1 rounded">{account.uuid}</span>} 
            dir="ltr" 
          />
          <DataRow 
            label={t.clinic.email_address} 
            value={account.email} 
            dir="ltr"
            badge={<VerifiedBadge isVerified={account.isEmailVerified} t={t} />}
          />
          <DataRow 
            label={t.clinic.phone_number} 
            value={account.phone} 
            dir="ltr"
            badge={<VerifiedBadge isVerified={account.isPhoneVerified} t={t} />}
          />
          <DataRow 
            label={t.clinic.id_verified} 
            value={
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border inline-block",
                account.isIdVerified ? "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
              )}>
                {account.isIdVerified ? "ID Verified" : "Pending ID"}
              </span>
            } 
          />
          <DataRow label={t.clinic.last_login} value={account.lastLogin} dir="ltr" />
          <DataRow label={t.clinic.last_activity} value={account.lastActivity} dir="ltr" />
        </SectionCard>

        {/* 2. System Preferences (From `user_profiles` table) */}
        <SectionCard title={t.clinic.system_preferences} icon={<SettingsOutlineIcon />}>
          <DataRow 
            label={t.clinic.timezone || "Timezone"} 
            value={<span className="font-mono text-[12px] bg-[#F5F6F8] px-2 py-1 rounded">{profile.timezone}</span>} 
            dir="ltr" 
          />
          <DataRow 
            label={t.clinic.language_preference || "System Language"} 
            value={<span className="uppercase">{profile.languagePreference}</span>} 
            dir="ltr" 
          />
        </SectionCard>

      </div>

      {/* --- Column 2 --- */}
      <div className="flex flex-col gap-6">

        {/* 3. Personal Information (From `user_profiles` & `translations` tables) */}
        <SectionCard title={t.clinic.personal_info} icon={<UsersOutlineIcon />}>
          <DataRow label={t.clinic.full_name} value={translations.fullName} />
          <DataRow label={t.clinic.dob} value={profile.dob} dir="ltr" />
          <DataRow label={t.clinic.gender} value={<span className="capitalize">{profile.gender.replace(/_/g, ' ')}</span>} />
          <DataRow label={t.clinic.nationality} value={profile.nationality} />
        </SectionCard>

        {/* 4. Emergency Contact (From `user_profiles` & `translations` tables) */}
        <SectionCard title={t.clinic.emergency_contact} icon={<AlertCircleOutlineIcon />}>
          <DataRow label={t.clinic.contact_name || "Name"} value={translations.emergencyContactName} />
          <DataRow label={t.clinic.relationship || "Relationship"} value={translations.emergencyContactRelationship} />
          <DataRow label={t.clinic.phone_number} value={profile.emergencyContactPhone} dir="ltr" />
        </SectionCard>

      </div>

    </div>
  );
};