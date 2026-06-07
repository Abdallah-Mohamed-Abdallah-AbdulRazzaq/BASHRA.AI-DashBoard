"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { PatientProfilesList } from "./patient-profiles-list";
import { SearchIcon } from "@/components/ui/icons/dashboard-icons";
import { getAllPatientProfiles } from "@/lib/admin-users";
import type { PaginationMeta, PatientProfileItem } from "@/types/admin-users";

interface PatientsViewProps {
  t: any;
}

export default function PatientsView({ t }: PatientsViewProps) {
  const [profiles, setProfiles] = useState<PatientProfileItem[]>([]);
  const [profilesPagination, setProfilesPagination] = useState<PaginationMeta | null>(null);
  const [profilesPage, setProfilesPage] = useState(1);
  const [profilesSearch, setProfilesSearch] = useState("");
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async (page: number, search: string) => {
    setProfilesLoading(true);
    setProfilesError(null);
    try {
      const data = await getAllPatientProfiles({ page, limit: 10, search: search.trim() || undefined });
      setProfiles(data.patient_profiles || []);
      setProfilesPagination(data.pagination || null);
    } catch (err: any) {
      setProfilesError(err?.message || t.clinic?.patients_load_error || "Failed to load patient profiles");
    } finally {
      setProfilesLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchProfiles(profilesPage, profilesSearch);
  }, [profilesPage, profilesSearch, fetchProfiles]);

  const profilesSearchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleProfilesSearchInput = useCallback((value: string) => {
    if (profilesSearchDebounce.current) clearTimeout(profilesSearchDebounce.current);
    profilesSearchDebounce.current = setTimeout(() => {
      setProfilesSearch(value);
      setProfilesPage(1);
    }, 400);
  }, []);

  const handleProfilesRetry = useCallback(() => {
    fetchProfiles(profilesPage, profilesSearch);
  }, [fetchProfiles, profilesPage, profilesSearch]);

  return (
    <div className="flex flex-col items-start gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A1B39]">{t.sidebar?.patients || "Patients"}</h1>
          <p className="text-[14px] text-[#6C7688] mt-1">{t.sidebar?.manage_patients || "Manage all patient profiles and medical records"}</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-[300px]">
            <input
              type="text"
              onChange={(e) => handleProfilesSearchInput(e.target.value)}
              placeholder={t.clinic?.search_patients || "Search patients..."}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]">
              <SearchIcon />
            </span>
          </div>
        </div>

        <PatientProfilesList
          t={t}
          profiles={profiles}
          pagination={profilesPagination}
          currentPage={profilesPage}
          totalPages={profilesPagination?.total_pages ?? 1}
          onPageChange={setProfilesPage}
          onRetry={handleProfilesRetry}
          loading={profilesLoading}
          error={profilesError}
        />
      </div>

    </div>
  );
}
