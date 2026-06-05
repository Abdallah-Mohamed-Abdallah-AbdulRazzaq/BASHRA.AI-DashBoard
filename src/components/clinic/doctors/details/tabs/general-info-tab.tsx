"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  BuildingOutlineIcon, CalendarSmallIcon, PhoneOutlineIcon, MailOutlineIcon, 
  MapPinOutlineIcon, BriefcaseOutlineIcon, FileTextOutlineIcon, AwardOutlineIcon, 
  CertificateOutlineIcon, ChevronDownSmall, GenderIcon, GlobeOutlineIcon, 
  LanguagesIcon, StarOutlineIcon, UsersOutlineIcon
} from "@/components/ui/icons/dashboard-icons";

interface GeneralInfoTabProps {
  t: any;
  doctor: any;
}

export const GeneralInfoTab = ({ t, doctor }: GeneralInfoTabProps) => {
  const days = Object.keys(doctor.schedule);
  const [activeTab, setActiveTab] = useState(days[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* --- LEFT COLUMN (Span 8) --- */}
      <div className="lg:col-span-8 flex flex-col gap-6 w-full">
        
        {/* Availability Block */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-4">{t.clinic.availability}</h3>
          
          <div className="flex items-center w-full border-b border-[#E7E8EB] overflow-x-auto custom-scrollbar mb-5">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveTab(day)}
                className={cn(
                  "px-4 py-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors",
                  activeTab === day 
                    ? "border-[#2E37A4] text-[#2E37A4]" 
                    : "border-transparent text-[#6C7688] hover:text-[#0A1B39]"
                )}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {doctor.schedule[activeTab].map((time: string, idx: number) => (
              <div key={idx} className="flex justify-center items-center py-2 px-3 bg-[#F9FAFB] border border-[#F3F4F6] rounded-[8px] text-[12px] font-medium text-[#0A1B39] hover:border-[#2E37A4] transition-colors cursor-default">
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Short Bio Block */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-3">{t.clinic.short_bio}</h3>
          <p className="text-[13px] text-[#6C7688] leading-relaxed mb-3">{doctor.bio}</p>
          <button className="text-[13px] font-semibold text-[#2E37A4] flex items-center gap-1 hover:underline">
            {t.clinic.see_more} <ChevronDownSmall />
          </button>
        </div>

        {/* Education Information Block */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-5">{t.clinic.education_information}</h3>
          <div className="flex flex-col gap-6 relative ml-2 rtl:ml-0 rtl:mr-2">
            <div className="absolute left-[3px] rtl:left-auto rtl:right-[3px] top-2 bottom-2 w-[1px] border-l border-dashed border-[#E7E8EB]"></div>
            {doctor.education.map((edu: any, idx: number) => (
              <div key={idx} className="relative pl-5 rtl:pl-0 rtl:pr-5">
                <div className="absolute left-[-2px] rtl:left-auto rtl:right-[-2px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#2E37A4] border-2 border-white shadow-sm z-10"></div>
                <h4 className="text-[14px] font-bold text-[#0A1B39]">{edu.degree}</h4>
                <p className="text-[12px] text-[#9DA4B0] mt-1" dir="ltr">{edu.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Block */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-5">{t.clinic.awards_recognition}</h3>
          <div className="flex flex-col gap-5">
            {doctor.awards.map((award: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 text-[#6C7688]"><AwardOutlineIcon /></div>
                <div className="flex flex-col">
                  <h4 className="text-[14px] font-bold text-[#0A1B39]">{award.title}</h4>
                  <p className="text-[13px] text-[#6C7688] mt-1">{award.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Block */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-5">{t.clinic.certifications}</h3>
          <div className="flex flex-col gap-5">
            {doctor.certifications.map((cert: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 text-[#6C7688]"><CertificateOutlineIcon /></div>
                <div className="flex flex-col">
                  <h4 className="text-[14px] font-bold text-[#0A1B39]">{cert.title}</h4>
                  <p className="text-[13px] text-[#6C7688] mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN (Span 4) : About Sidebar --- */}
      <div className="lg:col-span-4 w-full">
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm sticky top-6">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.clinic.about}</h3>
          <div className="flex flex-col gap-5">
            <InfoRow icon={<FileTextOutlineIcon />} label={t.clinic.medical_license} value={doctor.about.license} />
            <InfoRow icon={<PhoneOutlineIcon />} label={t.clinic.phone_number} value={doctor.about.phone} ltr />
            <InfoRow icon={<MailOutlineIcon />} label={t.clinic.email_address} value={doctor.about.email} />
            <InfoRow icon={<MapPinOutlineIcon />} label={t.clinic.location} value={doctor.about.location} />
            <InfoRow icon={<CalendarSmallIcon />} label={t.clinic.dob} value={doctor.about.dob} ltr />
            <div className="w-full border-t border-dashed border-[#E7E8EB] my-1"></div>
            <InfoRow icon={<BriefcaseOutlineIcon />} label={t.clinic.years_of_experience} value={doctor.about.experience} />
            <InfoRow icon={<GenderIcon />} label={t.clinic.gender} value={doctor.about.gender} />
            <InfoRow icon={<LanguagesIcon />} label={t.clinic.languages} value={doctor.about.languages} />
            <InfoRow icon={<GlobeOutlineIcon />} label={t.clinic.nationality} value={doctor.about.nationality} />
            <div className="w-full border-t border-dashed border-[#E7E8EB] my-1"></div>
            <InfoRow icon={<StarOutlineIcon />} label={t.clinic.rating} value={`${doctor.about.rating} / 5.0`} />
            <InfoRow icon={<UsersOutlineIcon />} label={t.clinic.total_consultations} value={doctor.about.total_consultations} />
          </div>
        </div>
      </div>

    </div>
  );
};

const InfoRow = ({ icon, label, value, ltr = false }: { icon: React.ReactNode, label: string, value: string, ltr?: boolean }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#6C7688] shrink-0">{icon}</div>
    <div className="flex flex-col mt-0.5">
      <span className="text-[12px] font-bold text-[#0A1B39] mb-0.5">{label}</span>
      <span className="text-[13px] text-[#6C7688]" dir={ltr ? "ltr" : "auto"}>{value}</span>
    </div>
  </div>
);