"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { DoctorHeader } from "@/components/clinic/doctors/doctor-header";
import { DoctorGrid } from "@/components/clinic/doctors/doctor-grid";
import { DoctorList } from "@/components/clinic/doctors/doctor-list";
import { 
  getDoctors, 
  getPendingDoctors, 
  getDoctorStatistics,
  approveDoctor,
  rejectDoctor,
  suspendDoctor,
  verifyDoctor,
  updateDoctorStatus
} from "@/lib/admin-doctors";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { DoctorListItem, DoctorListPagination, DoctorStatisticsData, SortOrder } from "@/types/admin-doctors";
import { DoctorActionModal } from "@/components/clinic/doctors/doctor-action-modal";
import { BulkDoctorStatusModal } from "@/components/clinic/doctors/modals/bulk-doctor-status-modal";
import { bulkUpdateDoctorsStatus } from "@/lib/admin-doctors";

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

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: string;
    doctorId: number | null;
  }>({ isOpen: false, actionType: "", doctorId: null });

  const [selectedDoctorIds, setSelectedDoctorIds] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

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
        if (filters.status) reqParams.status = filters.status;
        if (filters.approval_status) reqParams.approval_status = filters.approval_status;
        if (filters.is_verified) reqParams.is_verified = filters.is_verified === "true";
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
  }, [activeMode, currentPage, debouncedSearch, currentSort, filters]);

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
    setSelectedDoctorIds([]);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    setSelectedDoctorIds([]);
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
    setSelectedDoctorIds([]);
  };

  const handleActionClick = (actionType: string, doctorId: number) => {
    setModalState({ isOpen: true, actionType, doctorId });
  };

  const handleConfirmAction = async (reason: string, status?: string) => {
    if (!modalState.doctorId) return;
    try {
      if (modalState.actionType === "approve") {
        await approveDoctor(modalState.doctorId, { reason });
      } else if (modalState.actionType === "reject") {
        await rejectDoctor(modalState.doctorId, { reason });
      } else if (modalState.actionType === "suspend") {
        await suspendDoctor(modalState.doctorId, { reason });
      } else if (modalState.actionType === "verify") {
        await verifyDoctor(modalState.doctorId, { is_verified: true, reason });
      } else if (modalState.actionType === "unverify") {
        await verifyDoctor(modalState.doctorId, { is_verified: false, reason });
      } else if (modalState.actionType === "update_status" && status) {
        await updateDoctorStatus(modalState.doctorId, { status: status as any, reason });
      }
      
      setModalState({ isOpen: false, actionType: "", doctorId: null });
      fetchDoctors();
      fetchStatistics();
      alert(t.common?.success || "Action completed successfully");
    } catch (err: any) {
      alert(getApiErrorMessage(err, "en") || "An error occurred");
    }
  };

  const handleBulkConfirm = async (status: string, reason: string) => {
    await bulkUpdateDoctorsStatus({ doctorIds: selectedDoctorIds, status: status as any, reason });
    setIsBulkModalOpen(false);
    setSelectedDoctorIds([]);
    fetchDoctors();
    fetchStatistics();
  };

  const handleExportCSV = () => {
    if (!doctors || doctors.length === 0) return;
    const headers = ["ID", "Full Name", "Email", "Phone", "Specialty", "Status", "Verified", "Rating"];
    const rows = doctors.map(d => [
      d.id || "",
      `"${d.full_name || ""}"`,
      `"${d.email || ""}"`,
      `"${d.phone || ""}"`,
      `"${d.specialty || ""}"`,
      d.status || "",
      d.is_verified ? "Yes" : "No",
      d.rating_average || 0
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `doctors_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
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
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportCSV}
      />

      {selectedDoctorIds.length > 0 && viewMode === "list" && (
        <div className="w-full bg-[#E8F8F0] border border-[#27AE60] rounded-[8px] p-3 flex items-center justify-between animate-in fade-in zoom-in duration-200">
          <span className="text-[14px] font-bold text-[#0A1B39]">
            {selectedDoctorIds.length} {t.clinic?.selected_doctors || "Selected Doctors"}
          </span>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-1.5 bg-[#2E37A4] text-white text-[13px] font-bold rounded-[6px] hover:bg-[#252E8A] transition-colors"
          >
            {t.clinic?.bulk_update_status || "Bulk Update Status"}
          </button>
        </div>
      )}

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
            selectedDoctorIds={selectedDoctorIds}
            onSelectionChange={setSelectedDoctorIds}
            onActionClick={handleActionClick}
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
            onActionClick={handleActionClick}
          />
        )}
      </div>

      {modalState.isOpen && (
        <DoctorActionModal
          t={t}
          actionType={modalState.actionType}
          onClose={() => setModalState({ isOpen: false, actionType: "", doctorId: null })}
          onConfirm={handleConfirmAction}
        />
      )}

      {isBulkModalOpen && (
        <BulkDoctorStatusModal
          t={t}
          selectedCount={selectedDoctorIds.length}
          onClose={() => setIsBulkModalOpen(false)}
          onConfirm={handleBulkConfirm}
        />
      )}
    </div>
  );
}
