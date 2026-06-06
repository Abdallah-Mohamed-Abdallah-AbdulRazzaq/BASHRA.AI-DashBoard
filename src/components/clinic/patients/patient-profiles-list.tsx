"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import type { PatientProfileItem, PaginationMeta } from "@/types/admin-users";

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
      router.push(`/${lang}/clinic/patients/details?id=${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6C7688]">{t.clinic.loading_patients}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white border border-[#E7E8EB] rounded-[12px]">
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
      <div className="flex items-center justify-center min-h-[300px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <span className="text-[14px] text-[#9DA4B0]">{t.clinic.no_patient_profiles || "No patient profiles found"}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FAFBFC] border-b border-[#E7E8EB]">
              <th className="text-start px-4 py-3 text-[12px] font-bold text-[#6C7688] uppercase">{t.clinic.patient_id}</th>
              <th className="text-start px-4 py-3 text-[12px] font-bold text-[#6C7688] uppercase">{t.clinic.name_designation}</th>
              <th className="text-start px-4 py-3 text-[12px] font-bold text-[#6C7688] uppercase">{t.clinic.blood_group}</th>
              <th className="text-start px-4 py-3 text-[12px] font-bold text-[#6C7688] uppercase">{t.clinic.status}</th>
              <th className="text-start px-4 py-3 text-[12px] font-bold text-[#6C7688] uppercase">{t.clinic.insurance_provider}</th>
              <th className="text-start px-4 py-3 text-[12px] font-bold text-[#6C7688] uppercase">{t.clinic.smoking_status}</th>
              <th className="text-start px-4 py-3 text-[12px] font-bold text-[#6C7688] uppercase">{t.clinic.date}</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              const name = profile.user?.profile?.full_name || profile.user?.email || `User #${profile.user_id}`;
              const avatarUrl = profile.user?.profile?.profile_picture_url;
              const initials = getInitials(profile.user?.profile?.full_name);

              return (
                <tr
                  key={profile.id || profile.user_id}
                  onClick={() => handleRowClick(profile.user_id!)}
                  className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#FAFBFC] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-[13px] text-[#0A1B39] font-mono">#{profile.user_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profile.user?.profile?.full_name || ""}
                          className="w-9 h-9 rounded-full object-cover border border-[#E7E8EB]"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#2E37A4] text-white flex items-center justify-center text-[12px] font-bold">
                          {initials}
                        </div>
                      )}
                      <span className="text-[13px] font-medium text-[#0A1B39]">
                        {name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 text-[12px] font-semibold rounded-[6px] bg-[#FEF2F2] text-[#EF1E1E] border border-[#EF1E1E]/20">
                      {profile.blood_type || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] text-[#0A1B39] capitalize">{profile.user?.status || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#0A1B39]">{profile.insurance_provider || "-"}</td>
                  <td className="px-4 py-3 text-[13px] text-[#0A1B39] capitalize">{profile.smoking_status || "-"}</td>
                  <td className="px-4 py-3 text-[13px] text-[#6C7688]">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-[13px] text-[#6C7688]">
            {t.clinic.row_per_page} {pagination.total_items}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1.5 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] disabled:opacity-50"
            >
              {t.clinic.previous}
            </button>
            <span className="text-[13px] text-[#6C7688]">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1.5 bg-white border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] disabled:opacity-50"
            >
              {t.clinic.next}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
