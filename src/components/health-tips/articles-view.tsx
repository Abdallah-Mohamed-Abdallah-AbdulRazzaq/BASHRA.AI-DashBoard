"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MedicalArticleModal } from "./medical-article-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { PlusIcon, MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";
import {
  getMedicalArticles,
  deleteMedicalArticle,
  toggleMedicalArticleStatus,
  getHealthContentStatistics,
} from "@/lib/admin-content";
import { MedicalArticle, ContentPagination, ContentStatistics } from "@/types/admin-content";
import { getApiErrorMessage } from "@/lib/error-utils";

interface ArticlesViewProps {
  t: any;
}

type FilterTab = "all" | "active" | "inactive";

const ArticleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
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

export default function ArticlesView({ t }: ArticlesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<MedicalArticle | null>(null);

  const [articles, setArticles] = useState<MedicalArticle[]>([]);
  const [pagination, setPagination] = useState<ContentPagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [stats, setStats] = useState<ContentStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getHealthContentStatistics();
      if (res.success && res.data?.medical_articles) {
        setStats(res.data.medical_articles);
      }
    } catch {
      // silently fail
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchArticles = useCallback(async (page: number, filter: FilterTab) => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, any> = { page, limit: 10 };
      if (filter === "active") params.is_active = "true";
      if (filter === "inactive") params.is_active = "false";

      const res = await getMedicalArticles(params);
      if (res.success) {
        setArticles(Array.isArray(res.data) ? res.data : (res.data && Array.isArray((res.data as any).data) ? (res.data as any).data : []));
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
      } else {
        setError(res.message || "Failed to load articles");
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
    fetchArticles(1, activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  useEffect(() => {
    fetchArticles(pagination.page, activeFilter);
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

  const handleEdit = (article: MedicalArticle) => {
    setEditingData(article);
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
      const res = await deleteMedicalArticle(id);
      if (res.success) {
        fetchArticles(1, activeFilter);
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
      const res = await toggleMedicalArticleStatus(id);
      if (res.success) {
        setArticles(prev => prev.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a));
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
    fetchArticles(pagination.page, activeFilter);
    fetchStats();
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const filterTabs: { key: FilterTab; label: string; activeClass: string }[] = [
    { key: "all", label: t.health_tips?.filter_all || "All", activeClass: "bg-[#2E37A4] text-white" },
    { key: "active", label: t.health_tips?.active || "Active", activeClass: "bg-[#27AE60] text-white" },
    { key: "inactive", label: t.health_tips?.inactive || "Inactive", activeClass: "bg-[#9DA4B0] text-white" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[14px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px] bg-gradient-to-br from-[#2F80ED] to-[#56A1F7] text-white shadow-md shadow-blue-200">
            <ArticleIcon />
          </div>
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1B39]">
              {t.health_tips.articles_title}
            </h2>
            <p className="text-[12px] text-[#6C7688] mt-0.5">
              {t.health_tips?.manage_articles || "Manage medical articles content"}
            </p>
          </div>
          <span className="px-3 py-1 bg-[#DBEAFE]/60 text-[#2F80ED] text-[12px] font-bold rounded-[6px] border border-[#DBEAFE]">
            {pagination.total}
          </span>
        </div>

        <button
          onClick={handleAddNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2F80ED] to-[#56A1F7] text-white rounded-[10px] text-[13px] font-semibold hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-200 shadow-sm shrink-0"
        >
          <PlusIcon /> {t.health_tips.add_new_article}
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {[
          {
            label: t.health_tips?.total || "Total",
            value: statsLoading ? "—" : (stats?.total ?? 0),
            icon: <TotalIcon />,
            gradient: "from-[#2F80ED] to-[#56A1F7]",
            text: "text-[#2F80ED]",
          },
          {
            label: t.health_tips?.active || "Active",
            value: statsLoading ? "—" : (stats?.active ?? 0),
            icon: <CheckIcon />,
            gradient: "from-[#27AE60] to-[#2ECF75]",
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
            gradient: "from-[#9DA4B0] to-[#B5BCC9]",
            text: "text-[#6C7688]",
          },
          {
            label: t.health_tips?.today_created || "Added Today",
            value: statsLoading ? "—" : (stats?.today_created ?? 0),
            icon: <CalendarIcon />,
            gradient: "from-[#F2994A] to-[#F7B56C]",
            text: "text-[#F2994A]",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-[#E7E8EB] rounded-[12px] p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className={cn("w-10 h-10 flex items-center justify-center rounded-[10px] bg-gradient-to-br shrink-0 text-white shadow-sm", stat.gradient)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#6C7688] uppercase tracking-wide">{stat.label}</p>
              <p className={cn("text-[22px] font-bold", stat.text)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-[#FEF2F2] border border-[#EF1E1E]/30 text-[#EF1E1E] p-4 rounded-[12px] flex items-center justify-between">
          <p className="text-[14px] font-medium">{error}</p>
          <button
            onClick={() => fetchArticles(pagination.page, activeFilter)}
            className="px-4 py-2 bg-white text-[#EF1E1E] border border-[#EF1E1E]/30 rounded-[8px] text-[13px] font-semibold hover:bg-[#FEF2F2] transition-colors"
          >
            {t.common?.retry || "Retry"}
          </button>
        </div>
      )}

      {/* ── Table ── */}
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
                  ? cn(tab.activeClass, "border-[#E7E8EB]")
                  : "bg-[#F5F6F8] text-[#6C7688] border-transparent hover:bg-[#ECEDF0]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[28%]">
                  {t.health_tips.title_en}
                </th>
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[28%]">
                  {t.health_tips.title_ar}
                </th>
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[16%]">
                  Sub-Title
                </th>
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[14%]">
                  {t.health_tips.date_added}
                </th>
                <th className="py-4 px-6 text-start text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[8%]">
                  {t.health_tips.status}
                </th>
                <th className="py-4 px-6 text-end text-[12px] font-bold text-[#6C7688] uppercase tracking-wide w-[6%]"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#2F80ED] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[13px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#DBEAFE] text-[#2F80ED]">
                        <ArticleIcon />
                      </div>
                      <p className="text-[14px] font-semibold text-[#0A1B39]">
                        {t.health_tips?.no_articles_found || "No articles found."}
                      </p>
                      <p className="text-[12px] text-[#9DA4B0]">
                        {t.health_tips?.no_articles_hint || "Add your first medical article using the button above."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                articles.map(article => (
                  <tr
                    key={article.id}
                    className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors duration-150 group"
                  >
                    {/* EN column */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-semibold text-[#0A1B39] group-hover:text-[#2F80ED] transition-colors line-clamp-1">
                          {article.title_en || <span className="text-[#9DA4B0] font-normal italic text-[13px]">No English title</span>}
                        </span>
                        <span className="text-[11px] text-[#9DA4B0] line-clamp-2">
                          {article.description_en || "—"}
                        </span>
                      </div>
                    </td>

                    {/* AR column */}
                    <td className="py-4 px-6" dir="rtl">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-semibold text-[#0A1B39] group-hover:text-[#2F80ED] transition-colors line-clamp-1">
                          {article.title_ar}
                        </span>
                        <span className="text-[11px] text-[#9DA4B0] line-clamp-2">
                          {article.description_ar}
                        </span>
                      </div>
                    </td>

                    {/* Sub-titles */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-medium text-[#6C7688] line-clamp-1">
                          {article.sub_title_en || "—"}
                        </span>
                        <span className="text-[12px] text-[#9DA4B0] line-clamp-1" dir="rtl">
                          {article.sub_title_ar || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6">
                      <span className="text-[13px] text-[#6C7688]" dir="ltr">
                        {article.created_at
                          ? new Date(article.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <label
                        className={cn(
                          "relative inline-flex items-center cursor-pointer gap-2",
                          actionLoadingId === article.id && "opacity-50 pointer-events-none"
                        )}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={article.is_active}
                            onChange={() => handleToggleStatus(article.id, article.is_active)}
                          />
                          <div className="w-9 h-5 bg-[#D1D5DB] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]" />
                        </div>
                        <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-[5px]", article.is_active ? "text-[#27AE60] bg-[#E8F8EE]" : "text-[#9DA4B0] bg-[#F3F4F6]")}>
                          {article.is_active ? t.health_tips.active : t.health_tips.inactive}
                        </span>
                      </label>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-end">
                      <CustomDropdown
                        trigger={
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2F80ED] hover:text-[#2F80ED] hover:bg-[#DBEAFE]/40 transition-all duration-150 disabled:opacity-40"
                            disabled={actionLoadingId === article.id}
                          >
                            {actionLoadingId === article.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-[#2F80ED] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <MoreVerticalIcon />
                            )}
                          </button>
                        }
                        items={[
                          { label: t.health_tips.edit_article, onClick: () => handleEdit(article) },
                          {
                            label: t.common?.delete || "Delete",
                            onClick: () => handleDelete(article.id, article.title_en || article.title_ar),
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
              <span className="font-bold text-[#0A1B39]">{pagination.pages}</span> · {pagination.total} total
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => changePage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-[12px] font-medium border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] disabled:opacity-40 hover:bg-[#DBEAFE]/40 hover:border-[#2F80ED] hover:text-[#2F80ED] transition-all"
              >
                ← {t.common?.previous || "Previous"}
              </button>
              <button
                onClick={() => changePage(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-[12px] font-medium border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] disabled:opacity-40 hover:bg-[#DBEAFE]/40 hover:border-[#2F80ED] hover:text-[#2F80ED] transition-all"
              >
                {t.common?.next || "Next"} →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <MedicalArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        t={t}
        editData={editingData}
      />
    </div>
  );
}