"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DailyTipModal } from "./daily-tip-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  MoreVerticalIcon,
} from "@/components/ui/icons/dashboard-icons";
import {
  getDailyTips,
  deleteDailyTip,
  toggleDailyTipStatus,
  getHealthContentStatistics,
} from "@/lib/admin-content";
import { DailyTip, ContentPagination, ContentStatistics } from "@/types/admin-content";
import { getApiErrorMessage } from "@/lib/error-utils";

interface DailyTipsViewProps {
  t: any;
}

type FilterTab = "all" | "active" | "inactive";

const LightBulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

const TotalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function DailyTipsView({ t }: DailyTipsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<DailyTip | null>(null);

  const [tips, setTips] = useState<DailyTip[]>([]);
  const [pagination, setPagination] = useState<ContentPagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [stats, setStats] = useState<ContentStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch statistics (separate call)
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getHealthContentStatistics();
      if (res.success && res.data?.daily_tips) {
        setStats(res.data.daily_tips);
      }
    } catch {
      // silently fail, stats are non-critical
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch tips using documented query params: page, limit, is_active
  const fetchTips = useCallback(async (page: number, filter: FilterTab) => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, any> = { page, limit: 10 };
      if (filter === "active") params.is_active = "true";
      if (filter === "inactive") params.is_active = "false";

      const res = await getDailyTips(params);
      if (res.success) {
        setTips(Array.isArray(res.data) ? res.data : (res.data && Array.isArray((res.data as any).data) ? (res.data as any).data : []));
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
      } else {
        setError(res.message || "Failed to load tips");
      }
    } catch (err: any) {
      setError(getApiErrorMessage(err, "en"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTips(1, activeFilter);
  }, [fetchTips, activeFilter]);

  // When paginating, keep current filter
  useEffect(() => {
    fetchTips(pagination.page, activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tip: DailyTip) => {
    setEditingData(tip);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    const confirmMessage = `هل أنت متأكد من حذف "${title}" نهائيًا؟\nاكتب DELETE للتأكيد.`;
    const userInput = prompt(confirmMessage);
    if (userInput !== "DELETE") {
      if (userInput !== null) alert("تم إلغاء الحذف.");
      return;
    }
    try {
      setActionLoadingId(id);
      const res = await deleteDailyTip(id);
      if (res.success) {
        fetchTips(1, activeFilter);
        fetchStats();
      }
    } catch (err: any) {
      alert(getApiErrorMessage(err, "en"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      setActionLoadingId(id);
      const res = await toggleDailyTipStatus(id);
      if (res.success) {
        setTips(prev => prev.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
        // Update stats optimistically
        setStats(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            active: currentStatus ? prev.active - 1 : prev.active + 1,
            inactive: currentStatus ? prev.inactive + 1 : prev.inactive - 1,
          };
        });
      }
    } catch (err: any) {
      alert(getApiErrorMessage(err, "en"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchTips(pagination.page, activeFilter);
    fetchStats();
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const filterTabs: { key: FilterTab; label: string; color: string; activeClass: string }[] = [
    { key: "all", label: t.health_tips?.filter_all || "All", color: "text-[#2E37A4]", activeClass: "bg-[#2E37A4] text-white" },
    { key: "active", label: t.health_tips?.active || "Active", color: "text-[#27AE60]", activeClass: "bg-[#27AE60] text-white" },
    { key: "inactive", label: t.health_tips?.inactive || "Inactive", color: "text-[#9DA4B0]", activeClass: "bg-[#9DA4B0] text-white" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[14px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-gradient-to-br from-[#2E37A4] to-[#4F5FD8] text-white shadow-md shadow-indigo-200">
            <LightBulbIcon />
          </div>
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1B39]">
              {t.health_tips.daily_tips_title}
            </h2>
            <p className="text-[12px] text-[#6C7688] mt-0.5">
              {t.health_tips?.manage_tips || "Manage daily health tips content"}
            </p>
          </div>
          <span className="px-3 py-1 bg-[#E0E2F4]/60 text-[#2E37A4] text-[12px] font-bold rounded-[6px] border border-[#E0E2F4]">
            {pagination.total}
          </span>
        </div>

        <button
          onClick={handleAddNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2E37A4] to-[#4F5FD8] text-white rounded-[10px] text-[13px] font-semibold hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 shadow-sm shrink-0"
        >
          <PlusIcon /> {t.health_tips.add_new_tip}
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {[
          {
            label: t.health_tips?.total || "Total Tips",
            value: statsLoading ? "—" : (stats?.total ?? 0),
            icon: <TotalIcon />,
            color: "from-[#2E37A4] to-[#4F5FD8]",
            bg: "bg-[#EEF0FD]",
            text: "text-[#2E37A4]",
          },
          {
            label: t.health_tips?.active || "Active",
            value: statsLoading ? "—" : (stats?.active ?? 0),
            icon: <CheckIcon />,
            color: "from-[#27AE60] to-[#2ECF75]",
            bg: "bg-[#E8F8EE]",
            text: "text-[#27AE60]",
          },
          {
            label: t.health_tips?.inactive || "Inactive",
            value: statsLoading ? "—" : (stats?.inactive ?? 0),
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
            ),
            color: "from-[#9DA4B0] to-[#B5BCC9]",
            bg: "bg-[#F3F4F6]",
            text: "text-[#6C7688]",
          },
          {
            label: t.health_tips?.today_created || "Added Today",
            value: statsLoading ? "—" : (stats?.today_created ?? 0),
            icon: <CalendarIcon />,
            color: "from-[#F2994A] to-[#F7B56C]",
            bg: "bg-[#FFF4E8]",
            text: "text-[#F2994A]",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-[#E7E8EB] rounded-[12px] p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className={cn("w-10 h-10 flex items-center justify-center rounded-[10px] bg-gradient-to-br shrink-0", stat.color, "text-white shadow-sm")}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#6C7688] uppercase tracking-wide">{stat.label}</p>
              <p className={cn("text-[22px] font-bold", stat.text)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-[#FEF2F2] border border-[#EF1E1E]/30 text-[#EF1E1E] p-4 rounded-[12px] flex items-center justify-between">
          <p className="text-[14px] font-medium">{error}</p>
          <button
            onClick={() => fetchTips(pagination.page, activeFilter)}
            className="px-4 py-2 bg-white text-[#EF1E1E] border border-[#EF1E1E]/30 rounded-[8px] text-[13px] font-semibold hover:bg-[#FEF2F2] transition-colors"
          >
            {t.common?.retry || "Retry"}
          </button>
        </div>
      )}

      {/* ── Table Card ── */}
      <div className="bg-white border border-[#E7E8EB] rounded-[14px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Filter Tabs */}
        <div className="px-5 pt-4 pb-0 flex items-center gap-1.5 border-b border-[#E7E8EB]">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={cn(
                "px-4 py-2 text-[12px] font-semibold rounded-t-[8px] border border-b-0 transition-all duration-200 -mb-px",
                activeFilter === tab.key
                  ? cn(tab.activeClass, "border-[#E7E8EB] border-b-white z-10")
                  : "bg-[#F5F6F8] text-[#6C7688] border-transparent hover:bg-[#ECEDF0]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[32%]">
                  {t.health_tips.title_en}
                </th>
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[32%]">
                  {t.health_tips.title_ar}
                </th>
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[16%]">
                  {t.health_tips.date_added}
                </th>
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[12%]">
                  {t.health_tips.status}
                </th>
                <th className="py-4 px-6 text-end text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[8%]"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[13px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
                    </div>
                  </td>
                </tr>
              ) : tips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#EEF0FD] text-[#2E37A4]">
                        <LightBulbIcon />
                      </div>
                      <p className="text-[14px] font-semibold text-[#0A1B39]">
                        {t.health_tips?.no_tips_found || "No tips found."}
                      </p>
                      <p className="text-[12px] text-[#9DA4B0]">
                        {t.health_tips?.no_tips_hint || "Add your first health tip using the button above."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tips.map(tip => (
                  <tr
                    key={tip.id}
                    className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors duration-150 group"
                  >
                    {/* EN Title + Description */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-semibold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors line-clamp-1">
                          {tip.title_en || <span className="text-[#9DA4B0] font-normal italic text-[13px]">No English title</span>}
                        </span>
                        <span className="text-[11px] text-[#9DA4B0] line-clamp-2">
                          {tip.description_en || "—"}
                        </span>
                      </div>
                    </td>

                    {/* AR Title + Description */}
                    <td className="py-4 px-6" dir="rtl">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-semibold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors line-clamp-1">
                          {tip.title_ar}
                        </span>
                        <span className="text-[11px] text-[#9DA4B0] line-clamp-2">
                          {tip.description_ar}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6">
                      <span className="text-[13px] text-[#6C7688]" dir="ltr">
                        {tip.created_at ? new Date(tip.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-6">
                      <label
                        className={cn(
                          "relative inline-flex items-center cursor-pointer gap-2",
                          actionLoadingId === tip.id && "opacity-50 pointer-events-none"
                        )}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={tip.is_active}
                            onChange={() => handleToggleStatus(tip.id, tip.is_active)}
                          />
                          <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]" />
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-bold px-2 py-0.5 rounded-[5px]",
                            tip.is_active
                              ? "text-[#27AE60] bg-[#E8F8EE]"
                              : "text-[#9DA4B0] bg-[#F3F4F6]"
                          )}
                        >
                          {tip.is_active ? t.health_tips.active : t.health_tips.inactive}
                        </span>
                      </label>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-end">
                      <CustomDropdown
                        trigger={
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-[#EEF0FD] transition-all duration-150 disabled:opacity-40"
                            disabled={actionLoadingId === tip.id}
                          >
                            {actionLoadingId === tip.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <MoreVerticalIcon />
                            )}
                          </button>
                        }
                        items={[
                          {
                            label: t.health_tips.edit_tip,
                            onClick: () => handleEdit(tip),
                          },
                          {
                            label: t.common?.delete || "Delete",
                            onClick: () => handleDelete(tip.id, tip.title_en || tip.title_ar),
                            className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]",
                          },
                        ]}
                        width="w-36"
                        align="end"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && pagination.pages > 1 && (
          <div className="p-4 border-t border-[#E7E8EB] flex items-center justify-between bg-[#FAFBFC]">
            <span className="text-[12px] text-[#6C7688]">
              Page <span className="font-bold text-[#0A1B39]">{pagination.page}</span> of{" "}
              <span className="font-bold text-[#0A1B39]">{pagination.pages}</span>
              {" "}· {pagination.total} total
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-[12px] font-medium border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] disabled:opacity-40 hover:bg-[#EEF0FD] hover:border-[#2E37A4] hover:text-[#2E37A4] transition-all"
              >
                ← {t.common?.previous || "Previous"}
              </button>
              <button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-[12px] font-medium border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] disabled:opacity-40 hover:bg-[#EEF0FD] hover:border-[#2E37A4] hover:text-[#2E37A4] transition-all"
              >
                {t.common?.next || "Next"} →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <DailyTipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        t={t}
        editData={editingData}
      />
    </div>
  );
}