"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PhoneOutlineIcon } from "@/components/ui/icons/dashboard-icons";
import { cn } from "@/lib/utils";
import type { AdminUserDetailsData } from "@/types/admin-users";

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-0 rtl:rotate-180">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

interface PatientHeaderProps {
  t: any;
  patient: AdminUserDetailsData;
}

export const PatientDetailsHeader = ({ t, patient }: PatientHeaderProps) => {
  const params = useParams();
  const lang = params.lang as string;
  const { user, profile } = patient;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
      case "inactive": return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
      case "suspended": return "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
      case "pending_verification": return "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";
      default: return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      
      <Link href={`/${lang}/clinic/patients`} className="flex items-center gap-2 text-[15px] font-bold text-[#0A1B39] hover:text-[#2E37A4] transition-colors w-fit">
        <BackArrowIcon /> {t.clinic.back_to_patients || "Back to Patients"}
      </Link>

      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        
        <div className="flex items-center gap-5">
          <div className="w-[100px] h-[100px] rounded-[12px] overflow-hidden bg-[#F5F6F8] shrink-0 border-[3px] border-[#F9FAFB]">
            <img 
              src={profile?.profile_picture_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop"} 
              alt={profile?.full_name || ""} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-[20px] font-bold text-[#0A1B39]">{profile?.full_name || user?.email || user?.uuid || `User #${user?.id}`}</h2>
              <span className={cn("px-2.5 py-1 text-[11px] font-bold rounded-[6px] shadow-sm capitalize", getStatusColor(user?.status))}>
                {user?.status || "—"}
              </span>
            </div>
            
            {user?.uuid && (
              <p className="text-[12px] text-[#9DA4B0] font-mono mb-2">
                UUID: {user.uuid}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-[13px] flex-wrap">
              {user?.email && (
                <div className="flex items-center gap-1.5 text-[#6C7688] font-medium" dir="ltr">
                  <span>{user.email}</span>
                </div>
              )}
              {user?.phone && (
                <div className="flex items-center gap-1.5 text-[#6C7688] font-medium" dir="ltr">
                  <PhoneOutlineIcon /> {user.phone}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-[12px] text-[#9DA4B0] mt-1 flex-wrap">
              {user?.created_at && (
                <span>{t.clinic.member_since || "Member since"}: {user.created_at}</span>
              )}
              {user?.last_login_at && (
                <span>{t.clinic.last_login || "Last login"}: {user.last_login_at}</span>
              )}
              {user?.last_activity_at && (
                <span>{t.clinic.last_activity || "Last activity"}: {user.last_activity_at}</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
