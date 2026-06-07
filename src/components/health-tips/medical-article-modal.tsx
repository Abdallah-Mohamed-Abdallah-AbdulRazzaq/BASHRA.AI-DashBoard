"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createMedicalArticle, updateMedicalArticle } from "@/lib/admin-content";
import { MedicalArticle, MedicalArticlePayload } from "@/types/admin-content";
import { getApiErrorMessage } from "@/lib/error-utils";

interface MedicalArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: any;
  editData?: MedicalArticle | null;
}

const TITLE_AR_MIN = 3;
const TITLE_AR_MAX = 255;
const DESC_AR_MIN = 10;

export const MedicalArticleModal = ({ isOpen, onClose, onSuccess, t, editData }: MedicalArticleModalProps) => {
  const [formData, setFormData] = useState<MedicalArticlePayload>({
    title_en: "",
    title_ar: "",
    sub_title_en: "",
    sub_title_ar: "",
    description_en: "",
    description_ar: "",
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        title_en: editData.title_en || "",
        title_ar: editData.title_ar || "",
        sub_title_en: editData.sub_title_en || "",
        sub_title_ar: editData.sub_title_ar || "",
        description_en: editData.description_en || "",
        description_ar: editData.description_ar || "",
        is_active: editData.is_active ?? true,
      });
      setErrors({});
      setApiError(null);
    } else if (isOpen) {
      setFormData({
        title_en: "", title_ar: "", sub_title_en: "", sub_title_ar: "",
        description_en: "", description_ar: "", is_active: true,
      });
      setErrors({});
      setApiError(null);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!editData;
  const modalTitle = isEditing ? t.health_tips.edit_article : t.health_tips.add_new_article;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title_ar || formData.title_ar.length < TITLE_AR_MIN) {
      newErrors.title_ar = `Arabic title is required (min ${TITLE_AR_MIN} characters).`;
    } else if (formData.title_ar.length > TITLE_AR_MAX) {
      newErrors.title_ar = `Arabic title must be at most ${TITLE_AR_MAX} characters.`;
    }
    if (!formData.description_ar || formData.description_ar.length < DESC_AR_MIN) {
      newErrors.description_ar = `Arabic description is required (min ${DESC_AR_MIN} characters).`;
    }
    if (formData.title_en && formData.title_en.length > 255) {
      newErrors.title_en = "English title must be at most 255 characters.";
    }
    if (formData.description_en && formData.description_en.length < 10) {
      newErrors.description_en = "English description must be at least 10 characters if provided.";
    }
    if (formData.sub_title_ar && formData.sub_title_ar.length > 255) {
      newErrors.sub_title_ar = "Arabic sub-title must be at most 255 characters.";
    }
    if (formData.sub_title_en && formData.sub_title_en.length > 255) {
      newErrors.sub_title_en = "English sub-title must be at most 255 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setApiError(null);

      // Build payload exactly as documented fields
      const payload: MedicalArticlePayload = {
        title_ar: formData.title_ar.trim(),
        description_ar: formData.description_ar.trim(),
        title_en: formData.title_en?.trim() || undefined,
        description_en: formData.description_en?.trim() || undefined,
        sub_title_ar: formData.sub_title_ar?.trim() || undefined,
        sub_title_en: formData.sub_title_en?.trim() || undefined,
        is_active: formData.is_active,
      };

      let res;
      if (isEditing && editData?.id) {
        res = await updateMedicalArticle(editData.id, payload);
      } else {
        res = await createMedicalArticle(payload);
      }

      if (res.success) {
        onSuccess();
      } else {
        setApiError(res.message || t.common?.error || "Failed to save article.");
      }
    } catch (err: any) {
      setApiError(getApiErrorMessage(err, "en"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full h-11 px-3.5 bg-white border rounded-[10px] text-[13px] text-[#0A1B39] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:bg-[#F5F6F8]";
  const inputNormal = cn(inputBase, "border-[#E7E8EB] focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/10");
  const inputError = cn(inputBase, "border-[#EF1E1E] focus:border-[#EF1E1E] focus:ring-2 focus:ring-[#EF1E1E]/10");
  const textareaBase =
    "w-full p-3.5 bg-white border rounded-[10px] text-[13px] text-[#0A1B39] focus:outline-none transition-all duration-200 resize-none disabled:opacity-50 disabled:bg-[#F5F6F8]";

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <span className="text-[11px] font-medium text-[#EF1E1E] mt-0.5">{errors[field]}</span>
    ) : null;

  const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2">
      <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#2F80ED] to-[#56A1F7]" />
      <span className="text-[12px] font-bold text-[#6C7688] uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div className="bg-white rounded-[18px] shadow-2xl w-full max-w-[740px] max-h-[92vh] overflow-y-auto z-10 relative flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E8EB] bg-gradient-to-r from-[#FAFBFC] to-[#EFF6FF] sticky top-0 z-20 flex justify-between items-center rounded-t-[18px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-gradient-to-br from-[#2F80ED] to-[#56A1F7] text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-[#0A1B39]">{modalTitle}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#9DA4B0] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all duration-150 disabled:opacity-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

          {apiError && (
            <div className="bg-[#FEF2F2] border border-[#EF1E1E]/30 text-[#EF1E1E] p-3.5 rounded-[10px] text-[13px] font-medium flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {apiError}
            </div>
          )}

          {/* Title section */}
          <SectionLabel label="Title / العنوان" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* EN Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0A1B39]">
                {t.health_tips.title_en}
                <span className="ml-1 text-[10px] font-normal text-[#9DA4B0]">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.title_en || ""}
                onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                className={errors.title_en ? inputError : inputNormal}
                placeholder="e.g. Sensitive Skin Care"
                dir="ltr"
                disabled={isSubmitting}
                maxLength={255}
              />
              <FieldError field="title_en" />
            </div>
            {/* AR Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0A1B39]">
                {t.health_tips.title_ar} <span className="text-[#EF1E1E]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title_ar}
                onChange={e => setFormData({ ...formData, title_ar: e.target.value })}
                className={errors.title_ar ? inputError : inputNormal}
                placeholder="مثال: رعاية البشرة الحساسة"
                dir="rtl"
                disabled={isSubmitting}
                maxLength={255}
              />
              <div className="flex justify-between">
                <FieldError field="title_ar" />
                <span className={cn("text-[10px] font-medium ms-auto", formData.title_ar.length < TITLE_AR_MIN ? "text-[#9DA4B0]" : "text-[#27AE60]")}>
                  {formData.title_ar.length}/{TITLE_AR_MAX}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-title section */}
          <SectionLabel label="Sub-Title / العنوان الفرعي" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* EN Sub-Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0A1B39]">
                {t.health_tips.sub_title_en}
                <span className="ml-1 text-[10px] font-normal text-[#9DA4B0]">(Optional, max 255)</span>
              </label>
              <input
                type="text"
                value={formData.sub_title_en || ""}
                onChange={e => setFormData({ ...formData, sub_title_en: e.target.value })}
                className={errors.sub_title_en ? inputError : inputNormal}
                placeholder="e.g. Daily skin routines"
                dir="ltr"
                disabled={isSubmitting}
                maxLength={255}
              />
              <FieldError field="sub_title_en" />
            </div>
            {/* AR Sub-Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0A1B39]">
                {t.health_tips.sub_title_ar}
                <span className="ml-1 text-[10px] font-normal text-[#9DA4B0]">(اختياري، أقصى 255)</span>
              </label>
              <input
                type="text"
                value={formData.sub_title_ar || ""}
                onChange={e => setFormData({ ...formData, sub_title_ar: e.target.value })}
                className={errors.sub_title_ar ? inputError : inputNormal}
                placeholder="مثال: روتين يومي للعناية"
                dir="rtl"
                disabled={isSubmitting}
                maxLength={255}
              />
              <FieldError field="sub_title_ar" />
            </div>
          </div>

          {/* Description section */}
          <SectionLabel label="Description / الوصف" />
          <div className="grid grid-cols-1 gap-4">
            {/* EN Desc */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0A1B39]">
                {t.health_tips.desc_en}
                <span className="ml-1 text-[10px] font-normal text-[#9DA4B0]">(Optional, min 10 if provided)</span>
              </label>
              <textarea
                value={formData.description_en || ""}
                onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                className={cn(textareaBase, "min-h-[100px]", errors.description_en ? "border-[#EF1E1E] focus:ring-2 focus:ring-[#EF1E1E]/10" : "border-[#E7E8EB] focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/10")}
                placeholder="Enter article content in English..."
                dir="ltr"
                disabled={isSubmitting}
              />
              <FieldError field="description_en" />
            </div>
            {/* AR Desc */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#0A1B39]">
                {t.health_tips.desc_ar} <span className="text-[#EF1E1E]">*</span>
                <span className="ml-1 text-[10px] font-normal text-[#9DA4B0]">(min 10 chars)</span>
              </label>
              <textarea
                required
                value={formData.description_ar}
                onChange={e => setFormData({ ...formData, description_ar: e.target.value })}
                className={cn(textareaBase, "min-h-[100px]", errors.description_ar ? "border-[#EF1E1E] focus:ring-2 focus:ring-[#EF1E1E]/10" : "border-[#E7E8EB] focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/10")}
                placeholder="أدخل محتوى المقال بالعربية..."
                dir="rtl"
                disabled={isSubmitting}
              />
              <div className="flex justify-between">
                <FieldError field="description_ar" />
                <span className={cn("text-[10px] font-medium ms-auto", formData.description_ar.length < DESC_AR_MIN ? "text-[#9DA4B0]" : "text-[#27AE60]")}>
                  {formData.description_ar.length} chars
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F5F6F8] to-[#ECEDF0] rounded-[12px] border border-[#E7E8EB]">
            <div>
              <span className="text-[13px] font-semibold text-[#0A1B39]">{t.health_tips.status}</span>
              <p className="text-[11px] text-[#9DA4B0] mt-0.5">
                {formData.is_active ? "This article will be visible to users" : "This article will be hidden from users"}
              </p>
            </div>
            <label className={cn("relative inline-flex items-center cursor-pointer gap-2.5", isSubmitting && "opacity-50 pointer-events-none")}>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                disabled={isSubmitting}
              />
              <div className="w-12 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#27AE60] shadow-inner" />
              <span className={cn("text-[12px] font-bold", formData.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                {formData.is_active ? t.health_tips.active : t.health_tips.inactive}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E7E8EB]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-semibold rounded-[10px] hover:bg-[#ECEDF0] transition-colors duration-150 disabled:opacity-50"
            >
              {t.common?.close || "Close"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 bg-gradient-to-r from-[#2F80ED] to-[#56A1F7] text-white text-[13px] font-semibold rounded-[10px] hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isEditing ? t.common?.save_changes || "Save Changes" : t.common?.create || "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};