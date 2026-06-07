"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MoreVerticalIcon, 
  CalendarSettingIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownSmall
} from "@/components/ui/icons/dashboard-icons";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { AdminUserListItem } from "@/types/admin-users";
import { UserAvatar } from "./user-avatar";

interface PaginationMeta {
  total_items: number;
}

export interface UserListProps {
  t: any;
  users: AdminUserListItem[];
  pagination?: PaginationMeta | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const UserList = ({ t, users, pagination, currentPage, totalPages, onPageChange, onRetry, loading, error }: UserListProps) => {
  const params = useParams();
  const lang = params.lang as string;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
      case "inactive": return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
      case "suspended": return "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
      case "pending_verification": return "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";
      default: return "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
    }
  };

  const actionItems = [
    { label: t.clinic.edit || "Edit", onClick: () => console.log("Edit") },
    { label: t.clinic.delete || "Delete", onClick: () => console.log("Delete"), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" },
  ];

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
    <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="w-full overflow-x-auto min-h-[400px] rounded-t-[12px]"> 
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E7E8EB] bg-[#FAFBFC]">
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.sidebar.users || "User Name"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.contact || "Contact"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.status || "Status"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.verification || "Verification"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.last_login || "Last Login"}</th>
              <th className="text-end py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F5F6F8] border-[2px] border-[#F5F6F8] group-hover:border-[#2E37A4]/20 transition-colors relative shrink-0">
                      <UserAvatar user={userItem} />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/${lang}/users/details?id=${userItem.id}`} className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors hover:underline">
                        {getFullName(userItem) || userItem.email || `User #${userItem.id}`}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        {userItem.role && (
                          <span className="px-1.5 py-0.5 bg-[#F5F6F8] text-[#6C7688] text-[10px] font-bold rounded-[4px] capitalize">
                            {userItem.role}
                          </span>
                        )}
                        {userItem.uuid && (
                          <span className="text-[11px] text-[#9DA4B0] font-mono">#{userItem.id}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-6">
                  <div className="flex flex-col gap-1 text-[13px] text-[#6C7688]">
                    {userItem.email && <span dir="ltr" className="truncate max-w-[150px]">{userItem.email}</span>}
                    {userItem.phone && <span dir="ltr">{userItem.phone}</span>}
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-[6px] text-[11px] font-bold border inline-block min-w-[80px] capitalize text-center",
                    getStatusColor(userItem.status)
                  )}>
                    {userItem.status || "—"}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {userItem.id_verified ? (
                      <span className="text-[14px] text-[#27AE60]" title="ID Verified"><ShieldCheck size={14} /></span>
                    ) : (
                      <span className="text-[14px] text-[#9DA4B0]" title="Pending ID"><ShieldAlert size={14} /></span>
                    )}
                    <span className={userItem.email_verified ? "text-[14px] text-[#2F80ED]" : "text-[14px] text-[#9DA4B0]"} title="Email Verified">📧</span>
                    <span className={userItem.phone_verified ? "text-[14px] text-[#2F80ED]" : "text-[14px] text-[#9DA4B0]"} title="Phone Verified">📱</span>
                  </div>
                </td>

                <td className="py-3 px-6 text-[13px] text-[#9DA4B0]">
                  {userItem.last_login_at || "—"}
                </td>

                <td className="py-3 px-6 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                      <CalendarSettingIcon />
                    </button>
                    
                    <CustomDropdown 
                      trigger={
                        <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                          <MoreVerticalIcon />
                        </button>
                      }
                      items={actionItems}
                      width="w-32"
                      align="end"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4 rounded-b-[12px]">
        <div className="text-[13px] text-[#6C7688] font-medium">
          {t.clinic.entries || "Entries"}: {pagination?.total_items || users.length}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
          >
            <ChevronLeftIcon />
          </button>

          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-all shadow-sm",
                currentPage === page 
                  ? "bg-[#2E37A4] text-white border border-[#2E37A4] shadow-indigo-200" 
                  : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
              )}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
          >
            <ChevronRightIcon />
          </button>
        </div>

      </div>
    </div>
  );
};