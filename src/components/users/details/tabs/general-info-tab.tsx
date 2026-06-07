"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  ShieldCheckOutlineIcon, 
  UsersOutlineIcon, 
  AlertCircleOutlineIcon, 
  SettingsOutlineIcon,
  CheckCircleSolidIcon,
  XCircleSolidIcon,
  FileTextOutlineIcon
} from "@/components/ui/icons/dashboard-icons";
import type { AdminUserDetailsData, AdminUserMedicalProfileData, AdminUserLog } from "@/types/admin-users";

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

const VerifiedBadge = ({ isVerified, t }: { isVerified?: boolean, t: any }) => (
  <span className={cn(
    "flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold border",
    isVerified ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
  )}>
    {isVerified ? <CheckCircleSolidIcon /> : <XCircleSolidIcon />}
    {isVerified ? t.clinic.verified : t.clinic.unverified}
  </span>
);

interface GeneralInfoTabProps {
  t: any;
  patient: AdminUserDetailsData;
  medicalProfile?: AdminUserMedicalProfileData | null;
  logs?: AdminUserLog[];
}

export const GeneralInfoTab = ({ t, patient, medicalProfile, logs }: GeneralInfoTabProps) => {
  const { user, profile } = patient;
  const patientProfile = medicalProfile?.patient_profile;
  const translations = patientProfile?.translations;

  const isEmailVerified = !!user?.verification?.email_verified;
  const isPhoneVerified = !!user?.verification?.phone_verified;

  const getFullName = (userObj: any, profileObj: any) => {
    if (userObj?.full_name) return userObj.full_name;
    if (userObj?.first_name || userObj?.last_name) return `${userObj.first_name || ""} ${userObj.last_name || ""}`.trim();
    if (profileObj?.full_name) return profileObj.full_name;
    if (profileObj?.translations?.full_name) return profileObj.translations.full_name;
    if (Array.isArray(profileObj?.translations) && profileObj.translations[0]?.full_name) return profileObj.translations[0].full_name;
    if (userObj?.name) return userObj.name;
    return "-";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col gap-6">
        
        <SectionCard title={t.clinic.account_security} icon={<ShieldCheckOutlineIcon />}>
          <DataRow 
            label={t.clinic.uuid} 
            value={<span className="font-mono text-[11px] text-[#9DA4B0] bg-[#F5F6F8] px-2 py-1 rounded">{user?.uuid}</span>} 
            dir="ltr" 
          />
          <DataRow 
            label={t.clinic.email_address} 
            value={user?.email} 
            dir="ltr"
            badge={<VerifiedBadge isVerified={isEmailVerified} t={t} />}
          />
          <DataRow 
            label={t.clinic.phone_number} 
            value={user?.phone} 
            dir="ltr"
            badge={<VerifiedBadge isVerified={isPhoneVerified} t={t} />}
          />
          <DataRow 
            label={t.clinic.id_verified} 
            value={
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border inline-block",
                user?.verification?.id_verified ? "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
              )}>
                {user?.verification?.id_verified ? "ID Verified" : "Pending ID"}
              </span>
            } 
          />
          <DataRow label={t.clinic?.role || "Role"} value={<span className="capitalize">{user?.role || "—"}</span>} />
          <DataRow 
            label={t.clinic.active || "Active"} 
            value={
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border inline-block capitalize",
                user?.is_active === true ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
              )}>
                {user?.is_active === true ? (t.clinic.active || "Active") : user?.is_active === false ? (t.clinic.status_inactive || "Inactive") : "—"}
              </span>
            } 
          />
          <DataRow label={t.clinic.last_login || "Last Login"} value={user?.activity?.last_login_at} dir="ltr" />
          <DataRow label={t.clinic.last_activity || "Last Activity"} value={user?.activity?.last_activity_at} dir="ltr" />
          <DataRow label={t.clinic?.created_at || "Created At"} value={user?.timestamps?.created_at} dir="ltr" />
          <DataRow label={t.clinic?.updated_at || "Updated At"} value={user?.timestamps?.updated_at} dir="ltr" />
          
          <DataRow label={t.clinic?.login_attempts || "Login Attempts"} value={user?.activity?.login_attempts ?? 0} />
          <DataRow label={t.clinic?.locked_until || "Locked Until"} value={user?.activity?.locked_until} dir="ltr" />
        </SectionCard>

        <SectionCard title={t.clinic.system_preferences} icon={<SettingsOutlineIcon />}>
          <DataRow 
            label={t.clinic.timezone || "Timezone"} 
            value={<span className="font-mono text-[12px] bg-[#F5F6F8] px-2 py-1 rounded">{profile?.preferences?.timezone || "—"}</span>} 
            dir="ltr" 
          />
          <DataRow 
            label={t.clinic.language_preference || "System Language"} 
            value={<span className="uppercase">{profile?.preferences?.language || profile?.language_preference || "—"}</span>} 
            dir="ltr" 
          />
        </SectionCard>

        {patientProfile && (
          <SectionCard title={t.clinic.physical_lifestyle} icon={<UsersOutlineIcon />}>
            <DataRow label={t.clinic.blood_group} value={patientProfile.blood_type} />
            <DataRow label={t.clinic.height} value={patientProfile.height ? `${patientProfile.height} cm` : "—"} />
            <DataRow label={t.clinic.weight} value={patientProfile.weight ? `${patientProfile.weight} kg` : "—"} />
            <DataRow label={t.clinic.smoking_status} value={patientProfile.smoking_status} />
            <DataRow label={t.clinic.alcohol_consumption} value={patientProfile.alcohol_consumption} />
            <DataRow label={t.clinic.exercise_frequency} value={patientProfile.exercise_frequency} />
          </SectionCard>
        )}

        {!patientProfile && (
          <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 text-center text-[13px] text-[#9DA4B0]">
            {t.clinic.no_medical_profile || "No medical profile available"}
          </div>
        )}

      </div>

      <div className="flex flex-col gap-6">

        <SectionCard title={t.clinic.personal_info || "Personal Information"} icon={<UsersOutlineIcon />}>
          <DataRow label={t.clinic.full_name || "Full Name"} value={getFullName(user, profile)} />
          <DataRow label={t.clinic.dob || "Date of Birth"} value={profile?.date_of_birth} dir="ltr" />
          <DataRow label={t.clinic.gender || "Gender"} value={<span className="capitalize">{profile?.gender?.replace(/_/g, ' ')}</span>} />
          <DataRow label={t.clinic.nationality || "Nationality"} value={profile?.nationality} />
        </SectionCard>

        <SectionCard title={t.clinic.emergency_contact} icon={<AlertCircleOutlineIcon />}>
          <DataRow label={t.clinic.contact_name || "Name"} value={profile?.emergency_contact?.name} />
          <DataRow label={t.clinic.relationship || "Relationship"} value={profile?.emergency_contact?.relationship} />
          <DataRow label={t.clinic.phone_number || "Phone"} value={profile?.emergency_contact?.phone} dir="ltr" />
        </SectionCard>

        {translations && (
          <SectionCard title={t.clinic.clinical_background} icon={<FileTextOutlineIcon />}>
            <DataRow label={t.clinic.medical_history} value={translations.medical_history} />
            <DataRow label={t.clinic.chronic_conditions} value={translations.chronic_conditions} />
            <DataRow label={t.clinic.family_medical_history} value={translations.family_medical_history} />
            <DataRow label={t.clinic.allergies} value={translations.allergies} />
            <DataRow label={t.clinic.current_medications} value={translations.current_medications} />
          </SectionCard>
        )}

        {logs && logs.length > 0 && (
          <SectionCard title={t.clinic.account_history || "Account History"} icon={<FileTextOutlineIcon />}>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex justify-between items-start py-2 border-b border-dashed border-[#E7E8EB] last:border-0 text-[12px]">
                  <span className="text-[#6C7688]">{log.action || log.description || "—"}</span>
                  <span className="text-[#9DA4B0] whitespace-nowrap ml-2" dir="ltr">{log.created_at || "—"}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

      </div>

    </div>
  );
};
