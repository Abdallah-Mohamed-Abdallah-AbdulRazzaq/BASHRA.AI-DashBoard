"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MedicalArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
  editData?: any | null;
}

export const MedicalArticleModal = ({ isOpen, onClose, t, editData }: MedicalArticleModalProps) => {
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    sub_title_en: "",
    sub_title_ar: "",
    description_en: "",
    description_ar: "",
    is_active: true
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title_en: editData.title_en || "",
        title_ar: editData.title_ar || "",
        sub_title_en: editData.sub_title_en || "",
        sub_title_ar: editData.sub_title_ar || "",
        description_en: editData.description_en || "",
        description_ar: editData.description_ar || "",
        is_active: editData.is_active ?? true
      });
    } else {
      setFormData({ title_en: "", title_ar: "", sub_title_en: "", sub_title_ar: "", description_en: "", description_ar: "", is_active: true });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;
  const title = isEditing ? t.health_tips.edit_article : t.health_tips.add_new_article;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Article Data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[800px] max-h-[90vh] overflow-y-auto custom-scrollbar z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          {/* Main Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.title_en} <span className="text-[#EF1E1E]">*</span></label>
              <input type="text" required value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="e.g. Benefits of Vitamin C" dir="ltr" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.title_ar} <span className="text-[#EF1E1E]">*</span></label>
              <input type="text" required value={formData.title_ar} onChange={e => setFormData({...formData, title_ar: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="مثال: فوائد فيتامين سي" dir="rtl" />
            </div>
          </div>

          {/* Sub Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.sub_title_en} <span className="text-[#EF1E1E]">*</span></label>
              <input type="text" required value={formData.sub_title_en} onChange={e => setFormData({...formData, sub_title_en: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="e.g. How it affects your skin" dir="ltr" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.sub_title_ar} <span className="text-[#EF1E1E]">*</span></label>
              <input type="text" required value={formData.sub_title_ar} onChange={e => setFormData({...formData, sub_title_ar: e.target.value})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors" placeholder="مثال: كيف يؤثر على بشرتك" dir="rtl" />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.desc_en} <span className="text-[#EF1E1E]">*</span></label>
              <textarea required value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} className="w-full min-h-[120px] p-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors resize-y custom-scrollbar" placeholder="Enter article content..." dir="ltr" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.desc_ar} <span className="text-[#EF1E1E]">*</span></label>
              <textarea required value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} className="w-full min-h-[120px] p-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors resize-y custom-scrollbar" placeholder="أدخل محتوى المقال..." dir="rtl" />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#F5F6F8] rounded-[8px] border border-[#E7E8EB]">
            <span className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.status}</span>
            <label className="relative inline-flex items-center cursor-pointer ml-auto rtl:mr-auto rtl:ml-0">
              <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
              <div className="w-11 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
              <span className={cn("ml-3 rtl:mr-3 rtl:ml-0 text-[13px] font-bold", formData.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                {formData.is_active ? t.health_tips.active : t.health_tips.inactive}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E7E8EB]">
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[8px] hover:bg-[#E7E8EB] transition-colors">
              {t.common?.close || "Close"}
            </button>
            <button type="submit" className="px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm">
              {isEditing ? "Save Changes" : "Create Article"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};