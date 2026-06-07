"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";
import { UserAvatar } from "@/components/users/user-avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { AdminUserListItem } from "@/types/admin-users";

interface PatientCardProps {
  t: any;
  patient: AdminUserListItem;
}

export const PatientCard = ({ t, patient }: PatientCardProps) => {
  const params = useParams();
  const lang = params.lang as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="flex p-4 bg-white border border-[#E7E8EB] rounded-[12px] hover:shadow-md transition-all duration-300 relative group">
      
      <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] bg-[#F5F6F8] rounded-[8px] overflow-hidden flex-shrink-0 mr-4 rtl:mr-0 rtl:ml-4">
        <UserAvatar user={patient} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <Link href={`/${lang}/clinic/patients/details?id=${patient.id}`} className="text-[15px] font-bold text-[#0A1B39] truncate pr-2 hover:text-[#2E37A4] transition-colors">
              {patient.profile?.full_name || patient.email || `Patient #${patient.id}`}
            </Link>
            <span className="text-[12px] text-[#2E37A4] font-semibold">#{patient.id}</span>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:bg-gray-50 transition-colors"
            >
              <MoreVerticalIcon />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 rtl:left-0 top-8 w-32 bg-white border border-[#E7E8EB] rounded-[8px] shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full text-start px-3 py-2 text-[13px] text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors">
                  {t.clinic.edit || "Edit"}
                </button>
                <button className="w-full text-start px-3 py-2 text-[13px] text-[#EF1E1E] hover:bg-[#FEF2F2] transition-colors">
                  {t.clinic.delete || "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          {patient.profile?.gender && (
            <span className="px-2 py-0.5 bg-[#F5F6F8] text-[#6C7688] text-[11px] font-medium rounded-[4px] border border-[#E7E8EB] capitalize">
              {patient.profile?.gender}
            </span>
          )}
          {patient.email && (
            <span className="px-2 py-0.5 bg-[#F5F6F8] text-[#6C7688] text-[11px] font-medium rounded-[4px] border border-[#E7E8EB] truncate max-w-[140px]" dir="ltr">
              {patient.email}
            </span>
          )}
        </div>

        <div className="mt-auto flex justify-between items-end pt-3">
          <div className="flex flex-col gap-1">
             <span className="text-[11px] text-[#9DA4B0]">{t.clinic.phone || "Phone"}</span>
             <span className="text-[13px] font-bold text-[#0A1B39]" dir="ltr">{patient.phone || "—"}</span>
          </div>
          
          <span className={cn(
            "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border capitalize",
            getStatusColor(patient.status)
          )}>
            {patient.status || "—"}
          </span>
        </div>

      </div>
    </div>
  );
};