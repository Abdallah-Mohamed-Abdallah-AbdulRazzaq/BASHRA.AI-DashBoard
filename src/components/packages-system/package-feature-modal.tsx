"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, RefreshCw } from "lucide-react";
import { addPackageFeature, updatePackageFeature } from "@/lib/admin-packages";
import { AdminFeature, PackageFeatureRelation } from "@/types/admin-packages";
import { getApiErrorMessage } from "@/lib/error-utils";

interface PackageFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: any;
  editData?: PackageFeatureRelation | null;
  selectedPackageId: string;
  featuresList: AdminFeature[]; 
}

export const PackageFeatureModal = ({ isOpen, onClose, onSuccess, t, editData, selectedPackageId, featuresList }: PackageFeatureModalProps) => {
  const [formData, setFormData] = useState({
    feature_id: "",
    feature_value: "",
    is_included: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        feature_id: editData.feature_id ? editData.feature_id.toString() : "",
        feature_value: editData.feature_value || "",
        is_included: editData.is_included ? true : false
      });
    } else {
      setFormData({ feature_id: "", feature_value: "", is_included: true });
    }
    setError(null);
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;
  const title = isEditing ? (t.packages?.edit_mapping || "Edit Feature Mapping") : (t.packages?.assign_feature || "Assign Feature to Package");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let res;
      if (isEditing && editData?.id) {
        res = await updatePackageFeature(editData.id, {
          feature_value: formData.feature_value,
          is_included: formData.is_included
        });
      } else {
        res = await addPackageFeature({
          package_id: parseInt(selectedPackageId),
          feature_id: parseInt(formData.feature_id),
          feature_value: formData.feature_value,
          is_included: formData.is_included
        });
      }

      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || t.common?.error_occurred || "Operation failed");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={!isSubmitting ? onClose : undefined} />
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto custom-scrollbar z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">{title}</h3>
          <button onClick={onClose} disabled={isSubmitting} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[13px] rounded-[8px]">
              {error}
            </div>
          )}

          {/* Feature Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.select_feature || "Select Feature"} <span className="text-[#EF1E1E]">*</span></label>
            <div className="relative">
              <select required disabled={isEditing || isSubmitting} value={formData.feature_id} onChange={e => setFormData({...formData, feature_id: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] appearance-none focus:outline-none focus:border-[#2E37A4] transition-colors cursor-pointer disabled:bg-[#F5F6F8] disabled:cursor-not-allowed">
                <option value="" disabled>{t.packages?.select_feature || "Select Feature"}</option>
                {featuresList.map(feat => (
                  <option key={feat.id} value={feat.id.toString()}>{feat.name_en || feat.name_ar}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0] pointer-events-none" />
            </div>
          </div>

          {/* Feature Value */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.feature_value || "Feature Value"} <span className="text-[#EF1E1E]">*</span></label>
            <input type="text" required value={formData.feature_value} onChange={e => setFormData({...formData, feature_value: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" placeholder={t.packages?.feature_value_placeholder || "e.g., 10, Unlimited, Yes"} />
            <span className="text-[11px] text-[#6C7688]">This value will be displayed to users (e.g., "10", "Unlimited", "✓").</span>
          </div>

          {/* Is Included Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#F5F6F8] rounded-[8px] border border-[#E7E8EB] mt-2">
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.is_included || "Is Included?"}</span>
              <span className="text-[11px] text-[#6C7688]">If off, feature appears crossed out in pricing tables.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto rtl:mr-auto rtl:ml-0 shrink-0">
              <input type="checkbox" className="sr-only peer" checked={formData.is_included} onChange={(e) => setFormData({...formData, is_included: e.target.checked})} disabled={isSubmitting} />
              <div className="w-11 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
              <span className={cn("ml-3 rtl:mr-3 rtl:ml-0 text-[13px] font-bold", formData.is_included ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                {formData.is_included ? (t.packages?.included || "Included") : (t.packages?.not_included || "Not Included")}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E7E8EB]">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[8px] hover:bg-[#E7E8EB] transition-colors border border-[#E7E8EB] disabled:opacity-50">
              {t.common?.close || "Close"}
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : null}
              {isEditing ? (t.packages?.save_changes || "Save Changes") : (t.packages?.assign_feature || "Assign Feature")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
