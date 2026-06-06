"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DoctorDetailData } from "@/types/admin-doctors";
import { PhoneOutlineIcon, MailOutlineIcon } from "@/components/ui/icons/dashboard-icons";

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-0 rtl:rotate-180">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

interface DoctorHeaderProps {
  t: any;
  doctor: DoctorDetailData;
}

export const DoctorDetailsHeader = ({ t, doctor }: DoctorHeaderProps) => {
  const params = useParams();
  const lang = params.lang as string;

  const name = doctor.translations?.[lang]?.full_name || doctor.email || "—";
  const specialty = doctor.translations?.[lang]?.specialty || "—";
  const avatar = doctor.profile_picture_url;
  const status = doctor.status;
  const approvalStatus = doctor.approval_status;
  const isVerified = doctor.is_verified;
  const license = doctor.license_number;
  const experience = doctor.years_of_experience;
  const rating = doctor.rating_average;
  const consultations = doctor.total_consultations;
  const email = doctor.email;
  const phone = doctor.phone;

  return (
    <div className="flex flex-col gap-4 w-full">
      <Link href={`/${lang}/clinic/doctors`} className="flex items-center gap-2 text-[15px] font-bold text-[#0A1B39] hover:text-[#2E37A4] transition-colors w-fit">
        <BackArrowIcon /> {t.clinic.back_to_doctors}
      </Link>

      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-4 sm:p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-[100px] h-[100px] rounded-[12px] overflow-hidden bg-[#F5F6F8] shrink-0">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9DA4B0] text-[32px] font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[20px] font-bold text-[#0A1B39]">{name}</h2>
              <span className="px-2.5 py-1 border border-[#E7E8EB] text-[#0A1B39] text-[11px] font-semibold rounded-[6px]">
                {specialty}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border",
                status === "active"
                  ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20"
                  : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
              )}>
                {status === "active" ? t.clinic.available : t.clinic.unavailable}
              </span>

              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border",
                approvalStatus === "approved"
                  ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20"
                  : "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20"
              )}>
                {approvalStatus === "approved" ? t.clinic.approved : t.clinic.pending}
              </span>

              {isVerified !== undefined && (
                <span className={cn(
                  "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border",
                  isVerified
                    ? "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20"
                    : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
                )}>
                  {isVerified ? t.clinic.verified : t.clinic.unverified}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#6C7688] mt-1 flex-wrap">
              {license && <span><span className="font-medium">{t.clinic.medical_license}:</span> {license}</span>}
              {experience !== undefined && experience > 0 && (
                <><span className="text-[#E7E8EB]">|</span><span>{experience} Yrs</span></>
              )}
              {rating !== undefined && rating > 0 && (
                <><span className="text-[#E7E8EB]">|</span><span>★ {rating.toFixed(1)}</span></>
              )}
              {consultations !== undefined && consultations > 0 && (
                <><span className="text-[#E7E8EB]">|</span><span>{consultations} Consult</span></>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
          {email && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#6C7688]">
              <MailOutlineIcon /> {email}
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#6C7688]">
              <PhoneOutlineIcon /> {phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};