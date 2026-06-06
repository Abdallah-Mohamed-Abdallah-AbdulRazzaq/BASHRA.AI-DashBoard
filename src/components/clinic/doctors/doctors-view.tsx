"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { DoctorHeader } from "@/components/clinic/doctors/doctor-header";
import { DoctorGrid } from "@/components/clinic/doctors/doctor-grid";
import { DoctorList } from "@/components/clinic/doctors/doctor-list";
import { getDoctors, getPendingDoctors, getDoctorStatistics } from "@/lib/admin-doctors";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { DoctorListItem, DoctorListPagination, DoctorStatisticsData, SortOrder } from "@/types/admin-doctors";

interface DoctorsViewProps {
  t: any;
}

const DEFAULT_LIMIT = 12;

const SORT_OPTIONS = [
  { value: "recent", sortBy: "created_at" as const, sortOrder: "DESC" as SortOrder },
  { value: "oldest", sortBy: "created_at" as const, sortOrder: "ASC" as SortOrder },
  { value: "email_asc", sortBy: "email" as const, sortOrder: "ASC" as SortOrder },
  { value: "rating_desc", sortBy: "rating_average" as const, sortOrder: "DESC" as SortOrder },
  { value: "verified_desc", sortBy: "is_verified" as const, sortOrder: "DESC" as SortOrder },
];

const SORT_LABELS: Record<string, string> = {
  recent: "Recently Added",
  oldest: "Oldest",
  email_asc: "Email A-Z",
  rating_desc: "Highest Rated",
  verified_desc: "Verified First",
};

export default function DoctorsView({ t }: DoctorsViewProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [activeMode, setActiveMode] = useState<"all" | "pending">("all");

  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [pagination, setPagination] = useState<DoctorListPagination>({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0, hasMore: false });
  const [statistics, setStatistics] = useState<DoctorStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortValue, setSortValue] = useState("recent");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const currentPage = pagination.page || 1;
  const totalPages = pagination.totalPages || 0;

  const currentSort = SORT_OPTIONS.find((o) => o.value === sortValue) || SORT_OPTIONS[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reqParams: Record<string, string | number | boolean | undefined> = {
        page: currentPage,
        limit: DEFAULT_LIMIT,
      };
      if (activeMode === "all") {
        if (debouncedSearch) reqParams.search = debouncedSearch;
        reqParams.sort_by = currentSort.sortBy;
        reqParams.sort_order = currentSort.sortOrder;
      }
      let res;
      if (activeMode === "pending") {
        res = await getPendingDoctors(reqParams);
      } else {
        res = await getDoctors(reqParams);
      }
      setDoctors(res.data || []);
      if (res.pagination) {
        setPagination((prev) => ({
          ...prev,
          page: res.pagination?.page || 1,
          limit: res.pagination?.limit || DEFAULT_LIMIT,
          total: res.pagination?.total || 0,
          totalPages: res.pagination?.totalPages || 0,
          hasMore: res.pagination?.hasMore || false,
        }));
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [activeMode, currentPage, debouncedSearch, currentSort]);

  const fetchStatistics = useCallback(async () => {
    try {
      const res = await getDoctorStatistics();
      setStatistics(res.data || null);
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleModeChange = (mode: "all" | "pending") => {
    setActiveMode(mode);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleRetry = () => {
    fetchDoctors();
  };

  const handleSortChange = (newSortValue: string) => {
    setSortValue(newSortValue);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleApplyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const totalCount = statistics?.total_doctors ?? pagination.total ?? doctors.length ?? 0;
  const currentSortLabel = SORT_LABELS[currentSort.value] || currentSort.value;

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">

      <div className="flex items-center gap-1 bg-white border border-[#E7E8EB] rounded-[8px] p-1">
        <button
          onClick={() => handleModeChange("all")}
          className={cn(
            "px-4 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all",
            activeMode === "all" ? "bg-[#2E37A4] text-white shadow-sm" : "text-[#6C7688] hover:text-[#0A1B39]"
          )}
        >
          {t.sidebar?.all_doctors || "All Doctors"}
        </button>
        <button
          onClick={() => handleModeChange("pending")}
          className={cn(
            "px-4 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all",
            activeMode === "pending" ? "bg-[#2E37A4] text-white shadow-sm" : "text-[#6C7688] hover:text-[#0A1B39]"
          )}
        >
          {t.clinic?.pending || "Pending"}
        </button>
      </div>

      <DoctorHeader
        t={t}
        view={viewMode}
        setView={setViewMode}
        totalDoctors={totalCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentSortLabel={currentSortLabel}
        onSortChange={handleSortChange}
        onApplyFilters={handleApplyFilters}
      />

      <div className="w-full">
        {viewMode === "list" ? (
          <DoctorList
            t={t}
            doctors={doctors}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRetry={handleRetry}
            lang={lang}
          />
        ) : (
          <DoctorGrid
            t={t}
            doctors={doctors}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRetry={handleRetry}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}
