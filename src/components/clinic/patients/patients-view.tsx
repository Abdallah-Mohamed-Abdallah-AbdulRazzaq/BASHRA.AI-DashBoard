"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { PatientHeader } from "./patient-header";
import { PatientGrid } from "./patient-grid";
import { PatientList } from "./patient-list";
import { PatientProfilesList } from "./patient-profiles-list";
import { SearchIcon } from "@/components/ui/icons/dashboard-icons";
import { getAdminUsers, searchAdminUsers, getAdminUsersByStatus, getAdminUserStats, getAllPatientProfiles } from "@/lib/admin-users";
import type { AdminUserListItem, PaginationMeta, PatientProfileItem, UserStatsData } from "@/types/admin-users";

interface PatientsViewProps {
  t: any;
}

type ActiveTab = "accounts" | "profiles";

export default function PatientsView({ t }: PatientsViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("accounts");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");

  const [stats, setStats] = useState<UserStatsData | null>(null);

  const [profiles, setProfiles] = useState<PatientProfileItem[]>([]);
  const [profilesPagination, setProfilesPagination] = useState<PaginationMeta | null>(null);
  const [profilesPage, setProfilesPage] = useState(1);
  const [profilesSearch, setProfilesSearch] = useState("");
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);

  useEffect(() => {
    getAdminUserStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const fetchUsers = useCallback(async (page: number, status: string, search: string, verified: string) => {
    setLoading(true);
    setError(null);
    const verifiedParam = verified === "true" ? true : verified === "false" ? false : undefined;
    try {
      let data;
      if (search.trim()) {
        data = await searchAdminUsers({ query: search.trim(), page, limit: 10, status: status || undefined, verified: verifiedParam });
      } else if (status && !verified) {
        data = await getAdminUsersByStatus(status, { page, limit: 10 });
      } else {
        data = await getAdminUsers({ page, limit: 10, status: status || undefined, verified: verifiedParam });
      }
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err?.message || t.clinic.patients_load_error || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchProfiles = useCallback(async (page: number, search: string) => {
    setProfilesLoading(true);
    setProfilesError(null);
    try {
      const data = await getAllPatientProfiles({ page, limit: 10, search: search.trim() || undefined });
      setProfiles(data.patient_profiles || []);
      setProfilesPagination(data.pagination || null);
    } catch (err: any) {
      setProfilesError(err?.message || t.clinic.patients_load_error || "Failed to load patient profiles");
    } finally {
      setProfilesLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers(currentPage, statusFilter, searchQuery, verifiedFilter);
  }, [currentPage, statusFilter, searchQuery, verifiedFilter, fetchUsers]);

  useEffect(() => {
    if (activeTab === "profiles") {
      fetchProfiles(profilesPage, profilesSearch);
    }
  }, [activeTab, profilesPage, profilesSearch, fetchProfiles]);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleVerifiedFilter = useCallback((value: string) => {
    setVerifiedFilter(value);
    setCurrentPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    fetchUsers(currentPage, statusFilter, searchQuery, verifiedFilter);
  }, [fetchUsers, currentPage, statusFilter, searchQuery, verifiedFilter]);

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

  const totalUserCount = stats?.total_users ?? pagination?.total_items ?? 0;

  return (
    <div className="flex flex-col items-start gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <PatientHeader 
        t={t} 
        view={viewMode} 
        setView={setViewMode} 
        totalPatients={totalUserCount}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onStatusFilterChange={handleStatusFilter}
        onVerifiedFilterChange={handleVerifiedFilter}
      />

      <div className="w-full border-b border-[#E7E8EB] flex items-center gap-6">
        <button
          onClick={() => setActiveTab("accounts")}
          className={cn(
            "pb-3 text-[14px] font-bold whitespace-nowrap border-b-2 transition-all",
            activeTab === "accounts"
              ? "border-[#2E37A4] text-[#2E37A4]"
              : "border-transparent text-[#6C7688] hover:text-[#0A1B39]"
          )}
        >
          {t.clinic.patient_list || "Patient Accounts"}
        </button>
        <button
          onClick={() => setActiveTab("profiles")}
          className={cn(
            "pb-3 text-[14px] font-bold whitespace-nowrap border-b-2 transition-all",
            activeTab === "profiles"
              ? "border-[#2E37A4] text-[#2E37A4]"
              : "border-transparent text-[#6C7688] hover:text-[#0A1B39]"
          )}
        >
          {t.clinic.patient_profiles || "Patient Profiles"}
        </button>
      </div>

      {activeTab === "accounts" && (
        <div className="w-full">
          {viewMode === "list" ? (
            <PatientList 
              t={t} 
              patients={users}
              currentPage={currentPage}
              totalPages={pagination?.total_pages ?? 1}
              onPageChange={setCurrentPage}
              onRetry={handleRetry}
              loading={loading}
              error={error}
            />
          ) : (
            <PatientGrid 
              t={t} 
              patients={users}
              currentPage={currentPage}
              totalPages={pagination?.total_pages ?? 1}
              onPageChange={setCurrentPage}
              onRetry={handleRetry}
              loading={loading}
              error={error}
            />
          )}
        </div>
      )}

      {activeTab === "profiles" && (
        <div className="w-full flex flex-col gap-4">
          <div className="relative w-full sm:w-[300px]">
            <input
              type="text"
              onChange={(e) => handleProfilesSearchInput(e.target.value)}
              placeholder={t.clinic.search_patients || "Search patients..."}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]">
              <SearchIcon />
            </span>
          </div>
          {stats && (
            <div className="flex flex-wrap gap-4 mb-2">
              {stats.total_users !== undefined && (
                <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px]">
                  <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic.total_patients}</span>
                  <p className="text-[20px] font-bold text-[#0A1B39] mt-1">{stats.total_users}</p>
                </div>
              )}
              {stats.active_users !== undefined && (
                <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px]">
                  <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic.active}</span>
                  <p className="text-[20px] font-bold text-[#27AE60] mt-1">{stats.active_users}</p>
                </div>
              )}
              {stats.pending_verification_users !== undefined && (
                <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px]">
                  <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic.status_pending_verification}</span>
                  <p className="text-[20px] font-bold text-[#F2994A] mt-1">{stats.pending_verification_users}</p>
                </div>
              )}
            </div>
          )}
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
      )}

    </div>
  );
}
