"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import type { PatientProfileItem, PaginationMeta } from "@/types/admin-users";
import { UserAvatar } from "../../users/user-avatar";

interface PatientProfilesListProps {
  t: any;
  profiles: PatientProfileItem[];
  pagination: PaginationMeta | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
  loading: boolean;
  error: string | null;
}

const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
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

export const PatientProfilesList = ({
  t,
  profiles,
  pagination,
  currentPage,
  totalPages,
  onPageChange,
  onRetry,
  loading,
  error,
}: PatientProfilesListProps) => {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const handleRowClick = (userId?: number) => {
    if (userId) {
      router.push(`/${lang}/users/details?id=${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6C7688]">{t.clinic.loading_patients || "Loading patient profiles..."}</span>
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

  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <span className="text-[14px] text-[#9DA4B0]">{t.clinic.no_patient_profiles || "No patient profiles found"}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="w-full overflow-x-auto min-h-[400px] rounded-t-[12px]">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#E7E8EB] bg-[#FAFBFC]">
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.patient_id || "Patient ID"}</th>
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.clinic.name_designation || "Patient Name"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.blood_group || "Blood Group"}</th>
              <th className="text-center py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.status || "Status"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.insurance_provider || "Insurance"}</th>
              <th className="text-start py-4 px-4 text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.clinic.smoking_status || "Smoking Status"}</th>
              <th className="text-start py-4 px-6 text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.clinic.date || "Date"}</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              const fullName = getFullName(profile.user);
              const name = fullName || profile.user?.email || `User #${profile.user_id}`;
              const avatarUrl = profile.user?.profile?.profile_picture_url;
              const initials = getInitials(fullName || profile.user?.email);

              return (
                <tr
                  key={profile.id || profile.user_id}
                  onClick={() => handleRowClick(profile.user_id!)}
                  className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-6 text-[13px] text-[#9DA4B0] font-mono">#{profile.user_id}</td>
                  
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[8px] overflow-hidden bg-[#F5F6F8] border-[2px] border-[#F5F6F8] shrink-0">
                        <UserAvatar user={profile.user} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">
                          {name}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 text-[12px] font-semibold rounded-[6px] bg-[#FEF2F2] text-[#EF1E1E] border border-[#EF1E1E]/20 inline-block min-w-[40px] text-center">
                      {profile.blood_type || "-"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold border bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB] inline-block min-w-[80px] capitalize">
                      {profile.user?.status || "-"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[13px] text-[#6C7688] truncate max-w-[150px]" title={profile.insurance_provider}>
                    {profile.insurance_provider || "-"}
                  </td>

                  <td className="py-3 px-4 text-[13px] text-[#6C7688] capitalize">
                    {profile.smoking_status || "-"}
                  </td>

                  <td className="py-3 px-6 text-[13px] text-[#9DA4B0]">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[#E7E8EB] bg-[#FAFBFC] gap-4 rounded-b-[12px]">
        <div className="text-[13px] text-[#6C7688] font-medium">
          {t.clinic.entries || "Entries"}: {pagination?.total_items || profiles.length}
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-[6px] text-[13px] font-medium transition-all shadow-sm ${
                  currentPage === page 
                    ? "bg-[#2E37A4] text-white border border-[#2E37A4] shadow-indigo-200" 
                    : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E8EB] rounded-[6px] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
