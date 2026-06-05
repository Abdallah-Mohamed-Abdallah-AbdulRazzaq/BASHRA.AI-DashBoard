import React from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  badgeValue: string;
  badgeText: string;
  badgeColor?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  chart: React.ReactNode;
}

export const StatsCard = ({
  title,
  value,
  badgeValue,
  badgeText,
  badgeColor = "bg-[#27AE60]",
  icon,
  iconBgColor,
  chart
}: StatsCardProps) => {
  return (
    <div className="relative flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[6px] shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] p-5 gap-2 h-[160px] overflow-hidden group hover:shadow-md transition-shadow duration-300">
      
      {/* 1. Top Section: Icon & Badge */}
      <div className="flex justify-between items-start w-full relative z-10">
        {/* Icon */}
        <div className={cn("flex items-center justify-center w-[40px] h-[40px] rounded-full text-white shadow-sm", iconBgColor)}>
          {icon}
        </div>

        {/* Badge Group */}
        <div className="flex flex-col items-end gap-1">
          <div className={cn("flex items-center justify-center px-2 py-[2px] rounded-[6px] text-white text-[12px] font-medium leading-[18px]", badgeColor)}>
            {badgeValue}
          </div>
          <span className="text-[13px] font-normal leading-[19.5px] text-[#6C7688]">
            {badgeText}
          </span>
        </div>
      </div>

      {/* 2. Middle Section: Text & Value */}
      <div className="flex flex-col items-start gap-1 relative z-10 mt-auto">
        <span className="text-[14px] font-normal leading-[21px] text-[#6C7688]">{title}</span>
        <h3 className="text-[24px] font-bold leading-[28.8px] text-[#0A1B39] tracking-tight">{value}</h3>
      </div>

      {/* 3. Bottom Section: Chart */}
      {/* التعديل الجوهري هنا: استخدام end-5 بدلاً من right-5 */}
      {/* end-5: تضع العنصر في اليمين للإنجليزية، وفي اليسار للعربية */}
      <div className="absolute bottom-4 end-5 z-0 opacity-90">
        {chart}
      </div>
      
      {/* (Optional) Decorative Background Blur for 'Pro' feel */}
      <div className={cn("absolute -bottom-4 -end-4 w-24 h-24 rounded-full opacity-[0.03] blur-xl pointer-events-none", iconBgColor)} />
    </div>
  );
};