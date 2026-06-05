"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface PackageFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  editData?: any | null;
  packagesList: any[]; // لتعبئة القائمة المنسدلة
  featuresList: any[]; // لتعبئة القائمة المنسدلة
}

export const PackageFeatureModal = ({ isOpen, onClose, t, editData, packagesList, featuresList }: PackageFeatureModalProps) => {
  const [formData, setFormData] = useState({
    package_id: "",
    feature_id: "",
    feature_value: "",
    is_included: true
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        package_id: editData.package_id || "",
        feature_id: editData.feature_id || "",
        feature_value: editData.feature_value || "",
        is_included: editData.is_included ?? true
      });
    } else {
      setFormData({ package_id: "", feature_id: "", feature_value: "", is_included: true });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;
  const title = isEditing ? t.packages.edit_mapping : t.packages.assign_feature;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Mapping Data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[550px] max-h-[90vh] overflow-y-auto custom-scrollbar z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {/* Package Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.select_package} <span className="text-[#EF1E1E]">*</span></label>
            <div className="relative">
              <select required disabled={isEditing} value={formData.package_id} onChange={e => setFormData({...formData, package_id: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] appearance-none focus:outline-none focus:border-[#2E37A4] transition-colors cursor-pointer disabled:bg-[#F5F6F8] disabled:cursor-not-allowed">
                <option value="" disabled>{t.packages.select_package}</option>
                {packagesList.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name_en} - {pkg.name_ar}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0] pointer-events-none" />
            </div>
          </div>

          {/* Feature Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.select_feature} <span className="text-[#EF1E1E]">*</span></label>
            <div className="relative">
              <select required disabled={isEditing} value={formData.feature_id} onChange={e => setFormData({...formData, feature_id: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] appearance-none focus:outline-none focus:border-[#2E37A4] transition-colors cursor-pointer disabled:bg-[#F5F6F8] disabled:cursor-not-allowed">
                <option value="" disabled>{t.packages.select_feature}</option>
                {featuresList.map(feat => (
                  <option key={feat.id} value={feat.id}>{feat.name_en} - {feat.name_ar}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0] pointer-events-none" />
            </div>
          </div>

          {/* Feature Value */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.feature_value} <span className="text-[#EF1E1E]">*</span></label>
            <input type="text" required value={formData.feature_value} onChange={e => setFormData({...formData, feature_value: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder={t.packages.feature_value_placeholder} />
            <span className="text-[11px] text-[#6C7688]">This value will be displayed to users (e.g., "10", "Unlimited", "✓").</span>
          </div>

          {/* Is Included Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#F5F6F8] rounded-[8px] border border-[#E7E8EB] mt-2">
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.is_included}</span>
              <span className="text-[11px] text-[#6C7688]">If off, feature appears crossed out in pricing tables.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-auto rtl:mr-auto rtl:ml-0 shrink-0">
              <input type="checkbox" className="sr-only peer" checked={formData.is_included} onChange={(e) => setFormData({...formData, is_included: e.target.checked})} />
              <div className="w-11 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
              <span className={cn("ml-3 rtl:mr-3 rtl:ml-0 text-[13px] font-bold", formData.is_included ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                {formData.is_included ? t.packages.included : t.packages.not_included}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E7E8EB]">
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[8px] hover:bg-[#E7E8EB] transition-colors border border-[#E7E8EB]">
              {t.common?.close || "Close"}
            </button>
            <button type="submit" className="px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm">
              {isEditing ? "Save Changes" : "Assign Feature"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};