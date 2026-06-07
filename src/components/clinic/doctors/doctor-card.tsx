"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MoreVerticalIcon, CalendarSettingIcon } from "@/components/ui/icons/dashboard-icons";
import type { DoctorListItem } from "@/types/admin-doctors";

interface DoctorCardProps {
  t: any;
  doctor: DoctorListItem;
  lang?: string;
  onActionClick?: (actionType: string, doctorId: number) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function statusColor(status: string | undefined): string {
  switch (status) {
    case "active": return "text-[#27AE60] border-[#27AE60] bg-[#E8F8F0]";
    case "inactive": return "text-[#E8A317] border-[#E8A317] bg-[#FFF5E6]";
    case "suspended": return "text-[#EF1E1E] border-[#EF1E1E] bg-[#FEF2F2]";
    case "pending_verification": return "text-[#8B5CF6] border-[#8B5CF6] bg-[#F3EFFF]";
    default: return "text-[#6C7688] border-[#D0D5DD] bg-[#F5F6F8]";
  }
}

export const DoctorCard = ({ t, doctor, lang = "en", onActionClick }: DoctorCardProps) => {
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

  const displayName = doctor.full_name || doctor.email || `Doctor #${doctor.id}`;
  const displaySpecialty = doctor.specialty || "—";
  const avatarUrl = doctor.profile_picture_url;
  const detailsHref = `/${lang}/clinic/doctors/details?id=${doctor.id!}`;

  const handleActionClick = (action: string) => {
    setIsMenuOpen(false);
    onActionClick?.(action, doctor.id!);
  };

  return (
    <div className="flex p-4 bg-white border border-[#E7E8EB] rounded-[12px] hover:shadow-md transition-all duration-300 relative group">
      
      {/* Image Side */}
      <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] relative bg-[#F5F6F8] rounded-[8px] overflow-hidden flex-shrink-0 mr-4 rtl:mr-0 rtl:ml-4 flex items-center justify-center">
        {avatarUrl ? (
          <Image 
            src={avatarUrl} 
            alt={displayName} 
            fill
            className="object-cover object-top"
            unoptimized
          />
        ) : (
          <span className="text-[24px] font-bold text-[#2E37A4]">{getInitials(displayName)}</span>
        )}
      </div>

      {/* Info Side */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Header: Name & Menu */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col min-w-0">
            <a href={detailsHref} className="text-[15px] font-bold text-[#0A1B39] truncate pr-2 hover:text-[#2E37A4] transition-colors">
              {displayName}
            </a>
            <span className="text-[13px] text-[#6C7688] truncate">{displaySpecialty}</span>
          </div>
          
          {/* Menu Button */}
          <div className="relative shrink-0" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-7 h-7 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:bg-gray-50 transition-colors"
            >
              <MoreVerticalIcon />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 rtl:left-0 top-8 w-40 bg-white border border-[#E7E8EB] rounded-[8px] shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => handleActionClick("approve")} className="w-full text-left px-3 py-2 text-[13px] text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors">
                  Approve
                </button>
                <button onClick={() => handleActionClick("reject")} className="w-full text-left px-3 py-2 text-[13px] text-[#EF1E1E] hover:bg-[#FEF2F2] transition-colors">
                  Reject
                </button>
                <button onClick={() => handleActionClick("suspend")} className="w-full text-left px-3 py-2 text-[13px] text-[#E8A317] hover:bg-[#FFF5E6] transition-colors">
                  Suspend
                </button>
                <button onClick={() => handleActionClick("verify")} className="w-full text-left px-3 py-2 text-[13px] text-[#27AE60] hover:bg-[#E8F8F0] transition-colors">
                  Verify Profile
                </button>
                <button onClick={() => handleActionClick("unverify")} className="w-full text-left px-3 py-2 text-[13px] text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors">
                  Unverify Profile
                </button>
                <button onClick={() => handleActionClick("update_status")} className="w-full text-left px-3 py-2 text-[13px] text-[#0A1B39] hover:bg-[#F5F6F8] transition-colors">
                  Update Status
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {doctor.status && (
            <span className={cn("px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium border", statusColor(doctor.status))}>
              {doctor.status.replace(/_/g, " ")}
            </span>
          )}
          {doctor.approval_status && (
            <span className={cn(
              "px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium border",
              doctor.approval_status === "approved" ? "text-[#27AE60] border-[#27AE60] bg-[#E8F8F0]" :
              doctor.approval_status === "rejected" ? "text-[#EF1E1E] border-[#EF1E1E] bg-[#FEF2F2]" :
              doctor.approval_status === "suspended" ? "text-[#EF1E1E] border-[#EF1E1E] bg-[#FEF2F2]" :
              "text-[#E8A317] border-[#E8A317] bg-[#FFF5E6]"
            )}>
              {doctor.approval_status}
            </span>
          )}
          {doctor.is_verified !== undefined && (
            <span className={cn(
              "px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium border",
              doctor.is_verified ? "text-[#27AE60] border-[#27AE60] bg-[#E8F8F0]" : "text-[#6C7688] border-[#D0D5DD] bg-[#F5F6F8]"
            )}>
              {doctor.is_verified ? t.clinic.verified || "Verified" : t.clinic.unverified || "Unverified"}
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-2 text-[12px] text-[#6C7688]">
          {doctor.rating_average !== undefined && doctor.rating_average !== null && (
            <span className="flex items-center gap-1">
              <span className="text-[#E8A317]">★</span>
              <span>{Number(doctor.rating_average).toFixed(1)}</span>
            </span>
          )}
          {doctor.total_consultations !== undefined && doctor.total_consultations !== null && (
            <span>{doctor.total_consultations} {t.clinic.total_consultations || "Consultations"}</span>
          )}
        </div>

        {/* Footer: Link & Action */}
        <div className="mt-auto flex justify-between items-center pt-3">
          <a 
            href={detailsHref}
            className="text-[13px] font-semibold text-[#2E37A4] hover:underline"
          >
            {t.clinic.doctor_details || "View Details"}
          </a>
          
          <button className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-[#F5F6F8] transition-all">
            <CalendarSettingIcon />
          </button>
        </div>

      </div>
    </div>
  );
};
