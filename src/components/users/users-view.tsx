"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserList } from "./user-list";
import { UserGrid } from "./user-grid";
import { getAdminUsers, searchAdminUsers, getAdminUsersByStatus, getAdminUserStats } from "@/lib/admin-users";
import type { AdminUserListItem, PaginationMeta, UserStatsData } from "@/types/admin-users";
import { SearchIcon } from "@/components/ui/icons/dashboard-icons";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsersViewProps {
  t: any;
}

export const UsersView = ({ t }: UsersViewProps) => {
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
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, statusFilter, searchQuery, verifiedFilter);
  }, [currentPage, statusFilter, searchQuery, verifiedFilter, fetchUsers]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleVerifiedFilter = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setVerifiedFilter(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    fetchUsers(currentPage, statusFilter, searchQuery, verifiedFilter);
  }, [fetchUsers, currentPage, statusFilter, searchQuery, verifiedFilter]);

  return (
    <div className="flex flex-col items-start gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#0A1B39]">{t.sidebar?.all_users || "All Users"}</h1>
          <p className="text-[14px] text-[#6C7688] mt-1">{t.sidebar?.manage_users || "Manage all user accounts in the system"}</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {stats.total_users !== undefined && (
            <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-4">
              <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.total_users || "Total Users"}</span>
              <p className="text-[24px] font-bold text-[#0A1B39] mt-1">{stats.total_users}</p>
            </div>
          )}
          {stats.by_status?.active !== undefined && (
            <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-4">
              <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.active || "Active"}</span>
              <p className="text-[24px] font-bold text-[#27AE60] mt-1">{stats.by_status.active}</p>
            </div>
          )}
          {stats.by_status?.pending_verification !== undefined && (
            <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-4">
              <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.status_pending_verification || "Pending Verification"}</span>
              <p className="text-[24px] font-bold text-[#F2994A] mt-1">{stats.by_status.pending_verification}</p>
            </div>
          )}
          {stats.by_status?.suspended !== undefined && (
            <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-4">
              <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.status_suspended || "Suspended"}</span>
              <p className="text-[24px] font-bold text-[#EF1E1E] mt-1">{stats.by_status.suspended}</p>
            </div>
          )}
        </div>
      )}

      <div className="w-full bg-white p-4 rounded-[12px] border border-[#E7E8EB] shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-[300px]">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder={t.clinic?.search_users || "Search users..."}
              className="w-full pl-4 pr-10 py-2.5 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9DA4B0]">
              <SearchIcon />
            </span>
          </div>
          
          <select 
            value={statusFilter}
            onChange={handleStatusFilter}
            className="h-10 px-3 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
          >
            <option value="">{t.clinic?.all_statuses || "All Statuses"}</option>
            <option value="active">{t.clinic?.status_active || "Active"}</option>
            <option value="inactive">{t.clinic?.status_inactive || "Inactive"}</option>
            <option value="suspended">{t.clinic?.status_suspended || "Suspended"}</option>
            <option value="pending_verification">{t.clinic?.status_pending_verification || "Pending"}</option>
          </select>

          <select 
            value={verifiedFilter}
            onChange={handleVerifiedFilter}
            className="h-10 px-3 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors"
          >
            <option value="">{t.clinic?.all_verification || "All Verification"}</option>
            <option value="true">{t.clinic?.verified_only || "Verified Only"}</option>
            <option value="false">{t.clinic?.unverified_only || "Unverified Only"}</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#F9FAFB] p-1 rounded-[8px] border border-[#E7E8EB]">
          <button 
            onClick={() => setViewMode("list")}
            className={cn("p-1.5 rounded-[6px] transition-colors", viewMode === "list" ? "bg-white shadow-sm text-[#2E37A4]" : "text-[#9DA4B0] hover:text-[#0A1B39]")}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded-[6px] transition-colors", viewMode === "grid" ? "bg-white shadow-sm text-[#2E37A4]" : "text-[#9DA4B0] hover:text-[#0A1B39]")}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      <div className="w-full">
        {viewMode === "list" ? (
          <UserList 
            t={t} 
            users={users}
            pagination={pagination}
            currentPage={currentPage}
            totalPages={pagination?.total_pages ?? 1}
            onPageChange={setCurrentPage}
            onRetry={handleRetry}
            loading={loading}
            error={error}
          />
        ) : (
          <UserGrid 
            t={t} 
            users={users}
            currentPage={currentPage}
            totalPages={pagination?.total_pages ?? 1}
            onPageChange={setCurrentPage}
            onRetry={handleRetry}
            loading={loading}
            error={error}
          />
        )}
      </div>

    </div>
  );
};
