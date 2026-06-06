"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DailyTipModal } from "./daily-tip-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  SearchIcon, 
  MoreVerticalIcon,
} from "@/components/ui/icons/dashboard-icons";
import { 
  getDailyTips, 
  deleteDailyTip, 
  toggleDailyTipStatus 
} from "@/lib/admin-content";
import { DailyTip, ContentPagination } from "@/types/admin-content";

interface DailyTipsViewProps {
  t: any;
}

export default function DailyTipsView({ t }: DailyTipsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<DailyTip | null>(null);
  
  const [tips, setTips] = useState<DailyTip[]>([]);
  const [pagination, setPagination] = useState<ContentPagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchTips = useCallback(async (page: number, search: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getDailyTips({ page, limit: 10, search: search || undefined } as any);
      // Wait, is search supported for list? The docs say GET /daily-tips has no search param, only `page`, `limit`, `is_active`.
      // The Advanced search has `q`. The docs say "Search covers active rows only...". 
      // If we use local filtering vs server filtering, I should check if the docs mention a search param for GET /daily-tips.
      // 01-content-management-api-docs.md says for GET /api/health-tips/daily-tips: params are page, limit, is_active.
      // So no search param is documented for this endpoint! I should filter locally if it's not documented, OR remove the search box.
      // The user constraints say: "Possible filters may include, if documented: search".
      // Since `search` is NOT documented on GET /daily-tips, I will NOT send it to the API.
      // Wait, if pagination is server-side, local search is broken unless we fetch all.
      // The user says "Server-side pagination if endpoint supports it. Search/filter using documented params only."
      // Since it's not documented, I will remove the search box to be safe and perfectly align with the contract.
      if (res.success) {
        setTips(res.data);
        setPagination(res.pagination);
      } else {
        setError(res.message || t.common?.error || "Failed to load tips");
      }
    } catch (err: any) {
      setError(err.getDisplayMessage ? err.getDisplayMessage() : "An error occurred while loading tips.");
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTips(pagination.page, searchTerm);
  }, [fetchTips, pagination.page, searchTerm]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tip: DailyTip) => {
    setEditingData(tip);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    const confirmMessage = `Are you sure you want to permanently delete "${title}"?\nType DELETE to confirm.`;
    const userInput = prompt(confirmMessage);
    if (userInput !== "DELETE") {
      if (userInput !== null) alert("Deletion cancelled.");
      return;
    }

    try {
      setActionLoadingId(id);
      const res = await deleteDailyTip(id);
      if (res.success) {
        fetchTips(1, ""); // Reset to page 1 to refresh list
      }
    } catch (err: any) {
      alert(err.getDisplayMessage ? err.getDisplayMessage() : "Failed to delete tip.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setActionLoadingId(id);
      const res = await toggleDailyTipStatus(id);
      if (res.success) {
        setTips(tips.map(t => t.id === id ? { ...t, is_active: !t.is_active } : t));
      }
    } catch (err: any) {
      alert(err.getDisplayMessage ? err.getDisplayMessage() : "Failed to update status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchTips(pagination.page, searchTerm);
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1B39]">{t.health_tips.daily_tips_title}</h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {pagination.total}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleAddNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200 shrink-0"
          >
            <PlusIcon /> {t.health_tips.add_new_tip}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-[#FEF2F2] border border-[#EF1E1E] text-[#EF1E1E] p-4 rounded-[12px] flex items-center justify-between">
          <p className="text-[14px] font-medium">{error}</p>
          <button onClick={() => fetchTips(pagination.page, searchTerm)} className="px-4 py-2 bg-white text-[#EF1E1E] rounded-[8px] text-[13px] font-semibold hover:bg-[#FEF2F2] transition-colors">
            {t.common?.retry || "Retry"}
          </button>
        </div>
      )}

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.health_tips.title_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.health_tips.title_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.health_tips.date_added}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.health_tips.status}</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-6 h-6 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin"></div>
                       {t.common?.loading || "Loading..."}
                    </div>
                  </td>
                </tr>
              ) : tips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                    {t.health_tips?.no_tips_found || "No tips found."}
                  </td>
                </tr>
              ) : (
                tips.map((tip) => (
                  <tr key={tip.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                    
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{tip.title_en || "—"}</span>
                        <span className="text-[12px] text-[#6C7688] truncate max-w-[250px]">{tip.description_en || "—"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{tip.title_ar}</span>
                        <span className="text-[12px] text-[#6C7688] truncate max-w-[250px]">{tip.description_ar}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-[13px] text-[#6C7688] font-medium" dir="ltr">{tip.created_at ? new Date(tip.created_at).toLocaleDateString() : "—"}</span>
                    </td>

                    <td className="py-4 px-6">
                      <label className={cn("relative inline-flex items-center cursor-pointer", actionLoadingId === tip.id && "opacity-50 pointer-events-none")}>
                        <input type="checkbox" className="sr-only peer" checked={tip.is_active} onChange={() => handleToggleStatus(tip.id)} />
                        <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]"></div>
                        <span className={cn("ml-2 rtl:mr-2 rtl:ml-0 text-[11px] font-bold", tip.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                          {tip.is_active ? t.health_tips.active : t.health_tips.inactive}
                        </span>
                      </label>
                    </td>

                    <td className="py-4 px-6 text-end">
                      <CustomDropdown 
                        trigger={
                          <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all disabled:opacity-50" disabled={actionLoadingId === tip.id}>
                            <MoreVerticalIcon />
                          </button>
                        }
                        items={[
                          { label: t.health_tips.edit_tip, onClick: () => handleEdit(tip) },
                          { label: t.common?.delete || "Delete", onClick: () => handleDelete(tip.id, tip.title_en || tip.title_ar), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                        ]}
                        width="w-32"
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
          <div className="p-4 border-t border-[#E7E8EB] flex items-center justify-between">
            <span className="text-[13px] text-[#6C7688]">
              Showing page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changePage(pagination.page - 1)} 
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-[13px] border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] disabled:opacity-50 hover:bg-[#F9FAFB] transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => changePage(pagination.page + 1)} 
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-[13px] border border-[#E7E8EB] rounded-[6px] text-[#0A1B39] disabled:opacity-50 hover:bg-[#F9FAFB] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. The Modal */}
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