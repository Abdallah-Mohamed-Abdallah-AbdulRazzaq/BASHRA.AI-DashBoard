import React from "react";
import { PlusIconSmall, CalendarCheckIcon } from "@/components/ui/icons/dashboard-icons";

interface DashboardHeaderProps {
  title: string;
  btnNewAppointment: string; // 👈 نص جديد
  btnSchedule: string;       // 👈 نص جديد
}

export const DashboardHeader = ({ title, btnNewAppointment, btnSchedule }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
      {/* Title */}
      <h2 className="text-[20px] font-bold leading-[24px] text-[#0A1B39]">
        {title}
      </h2>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        {/* New Appointment Button */}
        <button className="flex items-center justify-center gap-1 px-[10px] py-[6px] rounded-[6px] bg-[#2E37A4] text-white shadow-sm hover:opacity-90 transition-opacity">
          <PlusIconSmall />
          <span className="text-[13px] font-semibold leading-[19.5px]">{btnNewAppointment}</span>
        </button>

        {/* Schedule Availability Button */}
        <button className="flex items-center justify-center gap-1 px-[10px] py-[6px] rounded-[6px] border border-[#E7E8EB] bg-white text-[#0A1B39] shadow-sm hover:bg-gray-50 transition-colors">
          <CalendarCheckIcon />
          <span className="text-[13px] font-semibold leading-[19.5px]">{btnSchedule}</span>
        </button>
      </div>
    </div>
  );
};