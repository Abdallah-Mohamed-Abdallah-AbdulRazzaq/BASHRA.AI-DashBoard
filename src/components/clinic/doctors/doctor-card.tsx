"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MoreVerticalIcon, CalendarSettingIcon } from "@/components/ui/icons/dashboard-icons";

interface DoctorCardProps {
  t: any;
  doctor: {
    id: number;
    name: string;
    specialty: string;
    image: string;
    available: string;
    price: string;
  };
}

export const DoctorCard = ({ t, doctor }: DoctorCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex p-4 bg-white border border-[#E7E8EB] rounded-[12px] hover:shadow-md transition-all duration-300 relative group">
      
      {/* Image Side */}
      <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] bg-[#F5F6F8] rounded-[8px] overflow-hidden flex-shrink-0 mr-4 rtl:mr-0 rtl:ml-4">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-full h-full object-cover object-top mix-blend-multiply" // mix-blend helps if image has bg
        />
      </div>

      {/* Info Side */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Header: Name & Menu */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-[15px] font-bold text-[#0A1B39] truncate pr-2">{doctor.name}</h3>
            <span className="text-[13px] text-[#6C7688]">{doctor.specialty}</span>
          </div>
          
          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:bg-gray-50 transition-colors"
            >
              <MoreVerticalIcon />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 rtl:left-0 top-8 w-32 bg-white border border-[#E7E8EB] rounded-[8px] shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full text-left px-3 py-2 text-[13px] text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors">
                  {t.clinic.edit}
                </button>
                <button className="w-full text-left px-3 py-2 text-[13px] text-[#EF1E1E] hover:bg-[#FEF2F2] transition-colors">
                  {t.clinic.delete}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="mt-3 text-[12px] text-[#6C7688]">
          {t.clinic.available} : <span className="text-[#0A1B39] font-medium">{doctor.available}</span>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-auto flex justify-between items-center pt-3">
          <div className="flex flex-col">
             <span className="text-[11px] text-[#6C7688]">{t.clinic.starts_from} : </span>
             <span className="text-[16px] font-bold text-[#2E37A4]">{doctor.price}</span>
          </div>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-[#F5F6F8] transition-all">
            <CalendarSettingIcon />
          </button>
        </div>

      </div>
    </div>
  );
};