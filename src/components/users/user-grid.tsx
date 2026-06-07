"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons/dashboard-icons";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { AdminUserListItem } from "@/types/admin-users";
import { usePathname } from "next/navigation";
import { UserAvatar } from "./user-avatar";

interface UserGridProps {
  t: any;
  users: AdminUserListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const UserGrid = ({ t, users, currentPage, totalPages, onPageChange, onRetry, loading, error }: UserGridProps) => {
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
      case "inactive": return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
      case "suspended": return "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
      case "pending_verification": return "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";
      default: return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
    }
  };

  const getFullName = (user: any) => {
    if (!user) return null;
    if (user.full_name) return user.full_name;
    if (user.first_name || user.last_name) return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    if (user.profile?.full_name) return user.profile.full_name;
    if (user.profile?.translations?.full_name) return user.profile.translations.full_name;
    if (Array.isArray(user.profile?.translations) && user.profile.translations[0]?.full_name) return user.profile.translations[0].full_name;
    if (user.name) return user.name;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6C7688]">{t.clinic.loading_users || "Loading users..."}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[14px] text-[#EF1E1E] font-medium">{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88] transition-colors"
            >
              {t.clinic.retry || "Retry"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <span className="text-[14px] text-[#9DA4B0]">{t.clinic.no_users_found || "No users found"}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {users.map((userItem) => (
          <div key={userItem.id} className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 hover:border-[#2E37A4] hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
            
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <span className={cn(
                "px-2.5 py-1 text-[10px] font-bold rounded-[6px] border capitalize",
                getStatusColor(userItem.status)
              )}>
                {userItem.status || "—"}
              </span>
            </div>

            <div className="flex flex-col items-center mt-2 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#F5F6F8] mb-3 border-[2px] border-[#F5F6F8] group-hover:border-[#2E37A4]/20 transition-colors relative shrink-0">
                <UserAvatar user={userItem} />
              </div>
              <Link href={`/${lang}/users/details?id=${userItem.id}`} className="text-[15px] font-bold text-[#0A1B39] text-center hover:text-[#2E37A4] transition-colors hover:underline px-2 line-clamp-1">
                {getFullName(userItem) || userItem.email || `User #${userItem.id}`}
              </Link>
              <div className="flex items-center justify-center gap-2 mt-1">
                {userItem.role && (
                  <span className="px-1.5 py-0.5 bg-[#F5F6F8] text-[#6C7688] text-[10px] font-bold rounded-[4px] capitalize">
                    {userItem.role}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {userItem.id_verified ? (
                  <span className="text-[14px] text-[#27AE60]" title="ID Verified"><ShieldCheck size={14} /></span>
                ) : (
                  <span className="text-[14px] text-[#9DA4B0]" title="Pending ID"><ShieldAlert size={14} /></span>
                )}
                <span className={userItem.email_verified ? "text-[14px] text-[#2F80ED]" : "text-[14px] text-[#9DA4B0]"} title="Email Verified">📧</span>
                <span className={userItem.phone_verified ? "text-[14px] text-[#2F80ED]" : "text-[14px] text-[#9DA4B0]"} title="Phone Verified">📱</span>
              </div>
              {userItem.id && (
                <span className="text-[11px] text-[#9DA4B0] font-mono mt-1">#{userItem.id}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#E7E8EB] border-dashed">
              <div className="flex items-center gap-2 text-[12px] text-[#6C7688]" dir="ltr">
                <span className="w-4 flex justify-center">📧</span>
                <span className="truncate">{userItem.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#6C7688]" dir="ltr">
                <span className="w-4 flex justify-center">📱</span>
                <span>{userItem.phone || "—"}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white shadow-sm"
        >
          <ChevronLeftIcon />
        </button>

        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-[8px] text-[13px] font-medium transition-all shadow-sm",
              currentPage === page 
                ? "bg-[#2E37A4] text-white shadow-md shadow-indigo-200" 
                : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
            )}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white shadow-sm"
        >
          <ChevronRightIcon />
        </button>
      </div>

    </div>
  );
};