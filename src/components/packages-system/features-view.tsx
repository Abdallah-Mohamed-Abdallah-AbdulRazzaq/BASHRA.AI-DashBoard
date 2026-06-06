"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FeatureModal } from "./feature-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  SearchIcon, 
  MoreVerticalIcon,
  Layers,
  RefreshCw,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { getAdminFeatures, toggleAdminFeatureStatus, deleteAdminFeature } from "@/lib/admin-packages";
import { AdminFeature } from "@/types/admin-packages";
import { getApiErrorMessage } from "@/lib/error-utils";

interface FeaturesViewProps {
  t: any;
}

export default function FeaturesView({ t }: FeaturesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<AdminFeature | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [features, setFeatures] = useState<AdminFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<AdminFeature | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchFeatures = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAdminFeatures();
      if (res.success && res.data) {
        setFeatures(res.data);
      } else {
        setError(res.message || t.common?.error_occurred || "Failed to fetch features");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [t.common?.error_occurred]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (feature: AdminFeature) => {
    setEditingData(feature);
    setIsModalOpen(true);
  };

  const confirmDelete = (feature: AdminFeature) => {
    setFeatureToDelete(feature);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!featureToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteAdminFeature(featureToDelete.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        fetchFeatures();
      } else {
        setDeleteError(res.message || t.common?.error_occurred || "Failed to delete feature");
      }
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (feature: AdminFeature) => {
    const actionName = feature.is_active ? t.packages?.deactivate_confirm || "deactivate" : t.packages?.activate_confirm || "activate";
    if (!confirm(t.packages?.confirm_status_change?.replace('{action}', actionName) || `Are you sure you want to ${actionName} this feature?`)) {
      return;
    }
    
    try {
      const res = await toggleAdminFeatureStatus(feature.id);
      if (res.success) {
        fetchFeatures();
      } else {
        alert(res.message || t.common?.error_occurred || "Failed to toggle status");
      }
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const filteredFeatures = features.filter(feature => 
    (feature.name_en && feature.name_en.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (feature.name_ar && feature.name_ar.includes(searchTerm))
  );

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0">
            <Layers size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1B39] leading-tight">{t.packages?.features_title || "System Features"}</h2>
            <span className="text-[12px] font-medium text-[#6C7688]">Total: {features.length} features</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <input 
              type="text" 
              placeholder={t.packages?.search_features || "Search features..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]">
               <SearchIcon size={16} />
            </span>
          </div>

          <button 
            onClick={handleAddNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200 shrink-0"
          >
            <PlusIcon size={16} /> {t.packages?.add_new_feature || "Add Feature"}
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#6C7688]">
              <RefreshCw className="animate-spin mb-2" size={24} />
              <p>{t.common?.loading || "Loading..."}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#EF1E1E]">
              <AlertTriangle className="mb-2" size={24} />
              <p className="mb-4">{error}</p>
              <button 
                onClick={fetchFeatures}
                className="px-4 py-2 bg-[#F9FAFB] border border-[#E7E8EB] text-[#0A1B39] rounded-[8px] text-[13px] font-semibold hover:bg-[#F3F4F6] transition-colors"
              >
                {t.common?.retry || "Retry"}
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#FAFBFC]">
                <tr className="border-b border-[#E7E8EB]">
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[35%]">{t.packages?.feature_name_en || "Feature Name (EN)"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[35%]">{t.packages?.feature_name_ar || "Feature Name (AR)"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.packages?.date_added || "Date Added"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.packages?.status || "Status"}</th>
                  <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map((feature) => (
                  <tr key={feature.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                    
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{feature.name_en || "—"}</span>
                        {feature.unit_en && <span className="text-[11px] font-medium text-[#6C7688] bg-white border border-[#E7E8EB] px-2 py-0.5 rounded w-fit">Unit: {feature.unit_en}</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{feature.name_ar || "—"}</span>
                        {feature.unit_ar && <span className="text-[11px] font-medium text-[#6C7688] bg-white border border-[#E7E8EB] px-2 py-0.5 rounded w-fit">الوحدة: {feature.unit_ar}</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-[13px] text-[#6C7688] font-medium" dir="ltr">
                        {feature.created_at ? new Date(feature.created_at).toLocaleDateString() : "—"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={!!feature.is_active} onChange={() => handleToggleStatus(feature)} />
                        <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]"></div>
                        <span className={cn("ml-2 rtl:mr-2 rtl:ml-0 text-[11px] font-bold", feature.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                          {feature.is_active ? (t.packages?.active || "Active") : (t.packages?.inactive || "Inactive")}
                        </span>
                      </label>
                    </td>

                    <td className="py-4 px-6 text-end">
                      <CustomDropdown 
                        trigger={
                          <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                            <MoreVerticalIcon size={16} />
                          </button>
                        }
                        items={[
                          { label: t.packages?.edit_feature || "Edit", onClick: () => handleEdit(feature) },
                          { label: t.common?.delete || "Delete", onClick: () => confirmDelete(feature), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                        ]}
                        width="w-32"
                        align="end"
                      />
                    </td>

                  </tr>
                ))}
                
                {filteredFeatures.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                      {t.packages?.no_features_found || "No features found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. Form Modal */}
      {isModalOpen && (
        <FeatureModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchFeatures();
          }}
          t={t} 
          editData={editingData} 
        />
      )}

      {/* 4. Delete Confirmation Modal */}
      {isDeleteModalOpen && featureToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[400px] p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF1E1E] mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-[18px] font-bold text-[#0A1B39] mb-2">{t.packages?.delete_feature || "Delete Feature"}</h3>
            <p className="text-[14px] text-[#6C7688] mb-6 leading-relaxed">
              {t.packages?.delete_feature_confirm || "Are you sure you want to delete this feature? This action cannot be undone if not used in any package."}
              <br/><br/>
              <strong>{featureToDelete.name_en || featureToDelete.name_ar}</strong>
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[13px] rounded-[8px]">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-white border border-[#E7E8EB] text-[#0A1B39] font-bold rounded-[8px] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
              >
                {t.common?.cancel || "Cancel"}
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-[#EF1E1E] text-white font-bold rounded-[8px] hover:bg-[#DC1414] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="animate-spin" size={16} /> : null}
                {t.common?.delete || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
