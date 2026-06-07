import React from "react";

interface DashboardHeaderProps {
  title: string;
}

export const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
      {/* Title */}
      <h2 className="text-[20px] font-bold leading-[24px] text-[#0A1B39]">
        {title}
      </h2>
    </div>
  );
};