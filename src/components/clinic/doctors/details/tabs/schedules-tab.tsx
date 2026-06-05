"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  VideoCameraOutlineIcon, ClockOutlineIcon, WalletOutlineIcon,
  BuildingOutlineIcon, MapPinOutlineIcon, PhoneOutlineIcon
} from "@/components/ui/icons/dashboard-icons";

interface SchedulesTabProps {
  t: any;
  doctor: any;
}

export const SchedulesTab = ({ t, doctor }: SchedulesTabProps) => {
  const { onlineSchedule, clinics } = doctor.schedulesData;

  // Helper component to render schedule rows
  const ScheduleList = ({ scheduleMap }: { scheduleMap: any }) => (
    <div className="flex flex-col w-full">
      {Object.entries(scheduleMap).map(([day, slots]: [string, any], idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 py-4 border-b border-[#E7E8EB] last:border-0 items-start sm:items-center hover:bg-[#F9FAFB] px-2 -mx-2 rounded-[8px] transition-colors">
          {/* Day Name */}
          <span className="w-28 text-[13px] font-bold text-[#0A1B39] capitalize">{day}</span>
          
          {/* Time Slots */}
          <div className="flex flex-wrap gap-2 flex-1">
            {slots.map((slot: string, sIdx: number) => (
              <span 
                key={sIdx} 
                className="px-3 py-1.5 bg-white border border-[#E7E8EB] text-[#0A1B39] text-[12px] font-medium rounded-[6px] shadow-sm cursor-default hover:border-[#2E37A4] hover:text-[#2E37A4] transition-all"
                dir="ltr"
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ----------------------------------------------------------- */}
      {/* 1. Online Consultations Schedule */}
      {/* ----------------------------------------------------------- */}
      {onlineSchedule && onlineSchedule.isActive && (
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.clinic.online_consultations}</h3>
          
          <div className="bg-gradient-to-br from-[#F8F9FF] to-white border border-[#2E37A4]/20 rounded-[12px] p-5 sm:p-6 shadow-sm relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -right-6 -top-6 text-[#2E37A4]/5 w-32 h-32 pointer-events-none rtl:right-auto rtl:-left-6">
              <VideoCameraOutlineIcon />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 relative z-10">
              {/* Left Info */}
              <div className="lg:w-[250px] shrink-0 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full bg-[#2E37A4] text-white flex items-center justify-center shadow-md mb-4">
                  <VideoCameraOutlineIcon />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#0A1B39]">
                    <span className="text-[#6C7688]"><ClockOutlineIcon /></span>
                    {t.clinic.session_duration}: <span className="font-bold text-[#2E37A4]">{onlineSchedule.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#0A1B39]">
                    <span className="text-[#6C7688]"><WalletOutlineIcon /></span>
                    {t.clinic.session_price}: <span className="font-bold text-[#2E37A4]">{onlineSchedule.price}</span>
                  </div>
                </div>
              </div>

              {/* Right Schedule List */}
              <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-[10px] p-4 border border-white">
                <ScheduleList scheduleMap={onlineSchedule.schedule} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 2. In-Clinic Consultations (Clinics List) */}
      {/* ----------------------------------------------------------- */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.clinic.in_clinic_consultations}</h3>
        
        <div className="flex flex-col gap-6">
          {clinics.map((clinic: any, index: number) => (
            <div key={clinic.id} className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden flex flex-col xl:flex-row group hover:shadow-md transition-all">
              
              {/* Left Side: Clinic Info & Image */}
              <div className="xl:w-[320px] bg-[#FAFBFC] border-b xl:border-b-0 xl:border-r border-[#E7E8EB] p-5 flex flex-col gap-4 shrink-0">
                {/* Clinic Image */}
                <div className="w-full h-[160px] rounded-[8px] overflow-hidden bg-gray-200 border border-[#E7E8EB]">
                  <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                {/* Clinic Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {clinic.isMain && (
                      <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#27AE60] border border-[#27AE60]/20 text-[10px] font-bold rounded-[4px]">{t.clinic.main_branch}</span>
                    )}
                    <span className={cn(
                      "px-2 py-0.5 border text-[10px] font-bold rounded-[4px]",
                      clinic.status === 'active' ? "bg-white text-[#2E37A4] border-[#2E37A4]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
                    )}>
                      {clinic.status === 'active' ? t.clinic.active : t.clinic.unavailable}
                    </span>
                  </div>
                  
                  <h4 className="text-[16px] font-bold text-[#0A1B39] flex items-center gap-2">
                    <BuildingOutlineIcon /> {clinic.name}
                  </h4>
                  
                  <div className="flex items-start gap-2 text-[12px] text-[#6C7688] mt-1">
                    <span className="mt-0.5 shrink-0"><MapPinOutlineIcon /></span>
                    <span className="leading-relaxed">{clinic.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[12px] text-[#6C7688] mt-1">
                    <span className="shrink-0"><PhoneOutlineIcon /></span>
                    <span dir="ltr">{clinic.phone}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Schedule & Pricing */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col">
                
                {/* Top Info Bar (Price & Duration) */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E7E8EB] mb-2">
                  <h4 className="text-[15px] font-bold text-[#0A1B39]">{t.clinic.schedule}</h4>
                  <div className="flex items-center gap-4 text-[13px] bg-[#F5F6F8] px-3 py-1.5 rounded-[8px] border border-[#E7E8EB]">
                    <div className="flex items-center gap-1.5 font-medium text-[#0A1B39]">
                      <span className="text-[#6C7688]"><ClockOutlineIcon /></span>
                      <span className="font-bold text-[#2E37A4]">{clinic.sessionDuration}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-[#D1D5DB]"></div>
                    <div className="flex items-center gap-1.5 font-medium text-[#0A1B39]">
                      <span className="text-[#6C7688]"><WalletOutlineIcon /></span>
                      <span className="font-bold text-[#2E37A4]">{clinic.sessionPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Days & Time Slots */}
                <div className="flex-1">
                  {Object.keys(clinic.schedule).length > 0 ? (
                    <ScheduleList scheduleMap={clinic.schedule} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[13px] text-[#9DA4B0] py-10">
                      No schedule available for this clinic.
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};