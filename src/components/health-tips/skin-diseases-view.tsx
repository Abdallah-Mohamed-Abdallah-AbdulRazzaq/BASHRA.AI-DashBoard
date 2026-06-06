"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SkinDiseaseModal } from "./skin-disease-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  MoreVerticalIcon 
} from "@/components/ui/icons/dashboard-icons";
import { 
  getSkinDiseases, 
  deleteSkinDisease, 
  toggleSkinDiseaseStatus 
} from "@/lib/admin-content";
import { SkinDisease, ContentPagination } from "@/types/admin-content";

// أيقونة الرابط الخارجي للجدول
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

interface SkinDiseasesViewProps {
  t: any;
}

export default function SkinDiseasesView({ t }: SkinDiseasesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<SkinDisease | null>(null);
  
  const [diseases, setDiseases] = useState<SkinDisease[]>([]);
  const [pagination, setPagination] = useState<ContentPagination>({ page: 1, limit: 10, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchDiseases = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getSkinDiseases({ page, limit: 10 } as any);
      if (res.success) {
        setDiseases(res.data);
        setPagination(res.pagination);
      } else {
        setError(res.message || t.common?.error || "Failed to load skin diseases");
      }
    } catch (err: any) {
      setError(err.getDisplayMessage ? err.getDisplayMessage() : "An error occurred while loading skin diseases.");
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDiseases(pagination.page);
  }, [fetchDiseases, pagination.page]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (disease: SkinDisease) => {
    setEditingData(disease);
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
      const res = await deleteSkinDisease(id);
      if (res.success) {
        fetchDiseases(1); // Reset to page 1
      }
    } catch (err: any) {
      alert(err.getDisplayMessage ? err.getDisplayMessage() : "Failed to delete disease.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setActionLoadingId(id);
      const res = await toggleSkinDiseaseStatus(id);
      if (res.success) {
        setDiseases(diseases.map(d => d.id === id ? { ...d, is_active: !d.is_active } : d));
      }
    } catch (err: any) {
      alert(err.getDisplayMessage ? err.getDisplayMessage() : "Failed to update status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchDiseases(pagination.page);
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
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1B39]">{t.health_tips.skin_diseases_title}</h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {pagination.total}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleAddNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200 shrink-0"
          >
            <PlusIcon /> {t.health_tips.add_new_disease}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-[#FEF2F2] border border-[#EF1E1E] text-[#EF1E1E] p-4 rounded-[12px] flex items-center justify-between">
          <p className="text-[14px] font-medium">{error}</p>
          <button onClick={() => fetchDiseases(pagination.page)} className="px-4 py-2 bg-white text-[#EF1E1E] rounded-[8px] text-[13px] font-semibold hover:bg-[#FEF2F2] transition-colors">
            {t.common?.retry || "Retry"}
          </button>
        </div>
      )}

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.health_tips.title_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.health_tips.title_ar}</th>
                <th className="py-4 px-4 text-center text-[13px] font-bold text-[#0A1B39] w-[15%]">Link</th>
                <th className="py-4 px-4 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.health_tips.date_added}</th>
                <th className="py-4 px-4 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.health_tips.status}</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-6 h-6 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin"></div>
                       {t.common?.loading || "Loading..."}
                    </div>
                  </td>
                </tr>
              ) : diseases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">
                    {t.health_tips?.no_skin_diseases_found || "No skin diseases found."}
                  </td>
                </tr>
              ) : (
                diseases.map((disease) => (
                  <tr key={disease.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                    
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{disease.title_en || "—"}</span>
                        <span className="text-[12px] text-[#6C7688] truncate max-w-[220px]">{disease.description_en || "—"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{disease.title_ar}</span>
                        <span className="text-[12px] text-[#6C7688] truncate max-w-[220px]">{disease.description_ar}</span>
                      </div>
                    </td>

                    {/* Website Link Column */}
                    <td className="py-4 px-4 text-center">
                      {disease.website_link ? (
                        <a 
                          href={disease.website_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2F80ED] hover:bg-[#2F80ED] hover:text-white transition-colors text-[11px] font-bold rounded-[6px] border border-[#2F80ED]/20"
                        >
                          <ExternalLinkIcon /> {t.health_tips.visit_link}
                        </a>
                      ) : (
                        <span className="text-[12px] text-[#9DA4B0]">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[13px] text-[#6C7688] font-medium" dir="ltr">{disease.created_at ? new Date(disease.created_at).toLocaleDateString() : "—"}</span>
                    </td>

                    <td className="py-4 px-4">
                      <label className={cn("relative inline-flex items-center cursor-pointer", actionLoadingId === disease.id && "opacity-50 pointer-events-none")}>
                        <input type="checkbox" className="sr-only peer" checked={disease.is_active} onChange={() => handleToggleStatus(disease.id)} />
                        <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]"></div>
                        <span className={cn("ml-2 rtl:mr-2 rtl:ml-0 text-[11px] font-bold", disease.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                          {disease.is_active ? t.health_tips.active : t.health_tips.inactive}
                        </span>
                      </label>
                    </td>

                    <td className="py-4 px-6 text-end">
                      <CustomDropdown 
                        trigger={
                          <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all disabled:opacity-50" disabled={actionLoadingId === disease.id}>
                            <MoreVerticalIcon />
                          </button>
                        }
                        items={[
                          { label: t.health_tips.edit_disease, onClick: () => handleEdit(disease) },
                          { label: t.common?.delete || "Delete", onClick: () => handleDelete(disease.id, disease.title_en || disease.title_ar), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
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
      <SkinDiseaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
        t={t} 
        editData={editingData} 
      />

    </div>
  );
}