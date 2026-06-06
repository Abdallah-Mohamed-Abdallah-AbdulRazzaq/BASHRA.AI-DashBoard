"use client";

import React from "react";
import {
  CalendarSmallIcon, PhoneOutlineIcon, MailOutlineIcon,
  MapPinOutlineIcon, BriefcaseOutlineIcon, FileTextOutlineIcon,
  GenderIcon, GlobeOutlineIcon,
  LanguagesIcon, StarOutlineIcon, UsersOutlineIcon
} from "@/components/ui/icons/dashboard-icons";
import type { DoctorDetailData } from "@/types/admin-doctors";

interface GeneralInfoTabProps {
  t: any;
  doctor: DoctorDetailData;
  lang: string;
}

export const GeneralInfoTab = ({ t, doctor, lang }: GeneralInfoTabProps) => {
  const profile = doctor.profile;
  const translations = doctor.translations?.[lang];

  const fmtVal = (v: any) => v ?? "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* --- LEFT COLUMN (Span 8) --- */}
      <div className="lg:col-span-8 flex flex-col gap-6 w-full">

        <PlaceholderCard title={t.clinic.availability} />
        <PlaceholderCard title={t.clinic.short_bio} />
        <PlaceholderCard title={t.clinic.education_information} />
        <PlaceholderCard title={t.clinic.awards_recognition} />
        <PlaceholderCard title={t.clinic.certifications} />

      </div>

      {/* --- RIGHT COLUMN (Span 4) : About Sidebar --- */}
      <div className="lg:col-span-4 w-full">
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm sticky top-6">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.clinic.about}</h3>
          <div className="flex flex-col gap-5">
            <InfoRow icon={<FileTextOutlineIcon />} label={t.clinic.medical_license} value={fmtVal(doctor.license_number)} />
            <InfoRow icon={<PhoneOutlineIcon />} label={t.clinic.phone_number} value={fmtVal(doctor.phone)} ltr />
            <InfoRow icon={<MailOutlineIcon />} label={t.clinic.email_address} value={fmtVal(doctor.email)} />
            <InfoRow icon={<MapPinOutlineIcon />} label={t.clinic.location} value="—" />
            <InfoRow icon={<CalendarSmallIcon />} label={t.clinic.dob} value={fmtVal(profile?.date_of_birth)} ltr />
            <div className="w-full border-t border-dashed border-[#E7E8EB] my-1"></div>
            <InfoRow icon={<BriefcaseOutlineIcon />} label={t.clinic.years_of_experience} value={fmtVal(doctor.years_of_experience?.toString())} />
            <InfoRow icon={<GenderIcon />} label={t.clinic.gender} value={fmtVal(profile?.gender)} />
            <InfoRow icon={<LanguagesIcon />} label={t.clinic.languages} value={fmtVal(profile?.languages_spoken?.join(", "))} />
            <InfoRow icon={<GlobeOutlineIcon />} label={t.clinic.nationality} value={fmtVal(profile?.nationality)} />
            <div className="w-full border-t border-dashed border-[#E7E8EB] my-1"></div>
            <InfoRow icon={<StarOutlineIcon />} label={t.clinic.rating} value={doctor.rating_average !== undefined && doctor.rating_average !== null ? `${doctor.rating_average} / 5.0` : "—"} />
            <InfoRow icon={<UsersOutlineIcon />} label={t.clinic.total_consultations} value={fmtVal(doctor.total_consultations?.toLocaleString())} />
          </div>
        </div>
      </div>

    </div>
  );
};

const PlaceholderCard = ({ title }: { title: string }) => (
  <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
    <h3 className="text-[16px] font-bold text-[#0A1B39] mb-4">{title}</h3>
    <p className="text-[13px] text-[#6C7688]">This section will be connected in a later phase.</p>
  </div>
);

const InfoRow = ({ icon, label, value, ltr = false }: { icon: React.ReactNode, label: string, value: string, ltr?: boolean }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#6C7688] shrink-0">{icon}</div>
    <div className="flex flex-col mt-0.5">
      <span className="text-[12px] font-bold text-[#0A1B39] mb-0.5">{label}</span>
      <span className="text-[13px] text-[#6C7688]" dir={ltr ? "ltr" : "auto"}>{value}</span>
    </div>
  </div>
);