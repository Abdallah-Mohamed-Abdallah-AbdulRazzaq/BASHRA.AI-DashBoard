"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  editData?: any | null;
}

export const FeatureModal = ({ isOpen, onClose, t, editData }: FeatureModalProps) => {
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    unit_en: "",
    unit_ar: "",
    is_active: true
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name_en: editData.name_en || "",
        name_ar: editData.name_ar || "",
        unit_en: editData.unit_en || "",
        unit_ar: editData.unit_ar || "",
        is_active: editData.is_active ?? true
      });
    } else {
      setFormData({ name_en: "", name_ar: "", unit_en: "", unit_ar: "", is_active: true });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;
  const title = isEditing ? t.packages.edit_feature : t.packages.add_new_feature;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Feature Data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[650px] max-h-[90vh] overflow-y-auto custom-scrollbar z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.feature_name_en} <span className="text-[#EF1E1E]">*</span></label>
              <input type="text" required value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="e.g. Doctor Accounts" dir="ltr" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.feature_name_ar} <span className="text-[#EF1E1E]">*</span></label>
              <input type="text" required value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="مثال: حسابات الأطباء" dir="rtl" />
            </div>
          </div>

          {/* Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.feature_unit_en}</label>
              <input type="text" value={formData.unit_en} onChange={e => setFormData({...formData, unit_en: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="e.g. Accounts / GB / SMS" dir="ltr" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.feature_unit_ar}</label>
              <input type="text" value={formData.unit_ar} onChange={e => setFormData({...formData, unit_ar: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="مثال: حساب / جيجابايت / رسالة" dir="rtl" />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#F5F6F8] rounded-[8px] border border-[#E7E8EB]">
            <span className="text-[13px] font-semibold text-[#0A1B39]">{t.packages.status}</span>
            <label className="relative inline-flex items-center cursor-pointer ml-auto rtl:mr-auto rtl:ml-0">
              <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
              <div className="w-11 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
              <span className={cn("ml-3 rtl:mr-3 rtl:ml-0 text-[13px] font-bold", formData.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                {formData.is_active ? t.packages.active : t.packages.inactive}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E7E8EB]">
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[8px] hover:bg-[#E7E8EB] transition-colors border border-[#E7E8EB]">
              {t.common?.close || "Close"}
            </button>
            <button type="submit" className="px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm">
              {isEditing ? "Save Changes" : "Create Feature"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};