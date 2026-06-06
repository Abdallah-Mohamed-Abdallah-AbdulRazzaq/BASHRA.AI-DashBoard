"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createAdminPackage, updateAdminPackage } from "@/lib/admin-packages";
import { AdminPackage } from "@/types/admin-packages";
import { getApiErrorMessage } from "@/lib/error-utils";
import { RefreshCw } from "lucide-react";

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: any;
  editData?: AdminPackage | null;
}

export const PackageModal = ({ isOpen, onClose, onSuccess, t, editData }: PackageModalProps) => {
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    secondary_name_en: "",
    secondary_name_ar: "",
    duration_days: "",
    price: "",
    currency_code: "EGP",
    is_active: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        name_en: editData.name_en || "",
        name_ar: editData.name_ar || "",
        secondary_name_en: editData.secondary_name_en || "",
        secondary_name_ar: editData.secondary_name_ar || "",
        duration_days: editData.duration_days ? editData.duration_days.toString() : "",
        price: editData.price !== undefined && editData.price !== null ? editData.price.toString() : "",
        currency_code: editData.currency_code || "EGP",
        is_active: editData.is_active ? true : false
      });
    } else {
      setFormData({ 
        name_en: "", name_ar: "", secondary_name_en: "", secondary_name_ar: "", 
        duration_days: "", price: "", currency_code: "EGP", is_active: true 
      });
    }
    setError(null);
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;
  const title = isEditing ? (t.packages?.edit_package || "Edit Package") : (t.packages?.add_new_package || "Add New Package");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name_ar: formData.name_ar,
      name_en: formData.name_en,
      secondary_name_ar: formData.secondary_name_ar,
      secondary_name_en: formData.secondary_name_en,
      duration_days: parseInt(formData.duration_days),
      price: parseFloat(formData.price),
      currency_code: formData.currency_code,
      is_active: formData.is_active
    };

    try {
      let res;
      if (isEditing && editData?.id) {
        res = await updateAdminPackage(editData.id, payload);
      } else {
        res = await createAdminPackage(payload);
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
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto custom-scrollbar z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">{title}</h3>
          <button onClick={onClose} disabled={isSubmitting} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[13px] rounded-[8px]">
              {error}
            </div>
          )}

          {/* Main Names */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold text-[#2E37A4] uppercase tracking-wider border-b border-[#E7E8EB] pb-1">1. {t.packages?.package_details || "Package Details"}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.package_name_en || "Package Name (EN)"}</label>
                <input type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" placeholder="e.g. Basic Plan" dir="ltr" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.package_name_ar || "Package Name (AR)"} <span className="text-[#EF1E1E]">*</span></label>
                <input type="text" required value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" placeholder="مثال: الباقة الأساسية" dir="rtl" />
              </div>
            </div>
          </div>

          {/* Secondary Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.secondary_name_en || "Secondary Name (EN)"}</label>
              <input type="text" value={formData.secondary_name_en} onChange={e => setFormData({...formData, secondary_name_en: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" placeholder="e.g. Best for individuals" dir="ltr" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.secondary_name_ar || "Secondary Name (AR)"}</label>
              <input type="text" value={formData.secondary_name_ar} onChange={e => setFormData({...formData, secondary_name_ar: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" placeholder="مثال: الأفضل للأفراد" dir="rtl" />
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="flex flex-col gap-3 mt-2">
            <span className="text-[12px] font-bold text-[#27AE60] uppercase tracking-wider border-b border-[#E7E8EB] pb-1">2. {t.packages?.pricing_duration || "Pricing & Duration"}</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.duration_days || "Duration (Days)"} <span className="text-[#EF1E1E]">*</span></label>
                <input type="number" required value={formData.duration_days} onChange={e => setFormData({...formData, duration_days: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" placeholder="e.g. 30" dir="ltr" min="1" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.price || "Price"} <span className="text-[#EF1E1E]">*</span></label>
                <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" placeholder="e.g. 99.99" dir="ltr" min="0" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.currency_code || "Currency Code"}</label>
                <input type="text" maxLength={3} value={formData.currency_code} onChange={e => setFormData({...formData, currency_code: e.target.value.toUpperCase()})} disabled={isSubmitting} className="w-full h-10 px-3 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] font-bold focus:outline-none focus:border-[#2E37A4] transition-colors uppercase disabled:bg-gray-100" placeholder="EGP" dir="ltr" />
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#F5F6F8] rounded-[8px] border border-[#E7E8EB] mt-2">
            <span className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.status || "Status"}</span>
            <label className="relative inline-flex items-center cursor-pointer ml-auto rtl:mr-auto rtl:ml-0">
              <input type="checkbox" className="sr-only peer" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} disabled={isSubmitting} />
              <div className="w-11 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
              <span className={cn("ml-3 rtl:mr-3 rtl:ml-0 text-[13px] font-bold", formData.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                {formData.is_active ? (t.packages?.active || "Active") : (t.packages?.inactive || "Inactive")}
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
              {isEditing ? (t.packages?.save_changes || "Save Changes") : (t.packages?.create_package || "Create Package")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
