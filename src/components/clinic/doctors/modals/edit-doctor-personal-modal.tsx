"use client";

import React, { useState } from "react";
import type { DoctorPersonalData, UpdateDoctorPersonalDataPayload } from "@/types/admin-doctors";

interface EditDoctorPersonalModalProps {
  t: any;
  initialData: DoctorPersonalData;
  onClose: () => void;
  onConfirm: (payload: UpdateDoctorPersonalDataPayload) => Promise<void>;
}

export function EditDoctorPersonalModal({ t, initialData, onClose, onConfirm }: EditDoctorPersonalModalProps) {
  const [formData, setFormData] = useState<UpdateDoctorPersonalDataPayload>({
    email: initialData.email || "",
    phone: initialData.phone || "",
    date_of_birth: initialData.date_of_birth || "",
    gender: initialData.gender || "",
    nationality: initialData.nationality || "",
    emergency_contact_phone: initialData.emergency_contact_phone || "",
    timezone: initialData.timezone || "",
    language_preference: initialData.language_preference || "",
    translations: {
      en: {
        full_name: initialData.translations?.en?.full_name || "",
        emergency_contact_name: initialData.translations?.en?.emergency_contact_name || "",
        emergency_contact_relationship: initialData.translations?.en?.emergency_contact_relationship || "",
      },
      ar: {
        full_name: initialData.translations?.ar?.full_name || "",
        emergency_contact_name: initialData.translations?.ar?.emergency_contact_name || "",
        emergency_contact_relationship: initialData.translations?.ar?.emergency_contact_relationship || "",
      }
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Valid email is required");
      return;
    }
    if (!formData.phone) {
      setError("Phone is required");
      return;
    }
    if (formData.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(formData.date_of_birth)) {
      setError("Date of birth must be YYYY-MM-DD");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onConfirm(formData);
    } catch (err: any) {
      setError(err?.message || t.clinic?.action_failed || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (lang: "en" | "ar", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...(prev.translations?.[lang] || {}),
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[12px] shadow-lg w-full max-w-[800px] my-auto animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-[#E7E8EB] sticky top-0 bg-white z-10 rounded-t-[12px]">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">
            {t.clinic?.edit_personal_data || "Edit Personal Data"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#EF1E1E] rounded-[6px] text-[#EF1E1E] text-[13px]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.email || "Email"}</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.phone || "Phone"}</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.dob || "Date of Birth"} (YYYY-MM-DD)</label>
              <input type="text" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.gender || "Gender"}</label>
              <input type="text" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.nationality || "Nationality"}</label>
              <input type="text" value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.emergency_contact || "Emergency Contact Phone"}</label>
              <input type="text" value={formData.emergency_contact_phone} onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.timezone || "Timezone"}</label>
              <input type="text" value={formData.timezone} onChange={(e) => setFormData({...formData, timezone: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.system_language || "Language Preference"}</label>
              <input type="text" value={formData.language_preference} onChange={(e) => setFormData({...formData, language_preference: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
          </div>

          <div className="w-full h-px bg-[#E7E8EB]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Translations */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[14px] font-bold text-[#2E37A4]">English Data</h4>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">Full Name</label>
                <input type="text" value={formData.translations?.en?.full_name} onChange={(e) => handleTranslationChange("en", "full_name", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">Emergency Contact Name</label>
                <input type="text" value={formData.translations?.en?.emergency_contact_name} onChange={(e) => handleTranslationChange("en", "emergency_contact_name", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">Emergency Contact Relationship</label>
                <input type="text" value={formData.translations?.en?.emergency_contact_relationship} onChange={(e) => handleTranslationChange("en", "emergency_contact_relationship", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
            </div>

            {/* Arabic Translations */}
            <div className="flex flex-col gap-4" dir="rtl">
              <h4 className="text-[14px] font-bold text-[#2E37A4]">البيانات بالعربية</h4>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">الاسم الكامل</label>
                <input type="text" value={formData.translations?.ar?.full_name} onChange={(e) => handleTranslationChange("ar", "full_name", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">اسم جهة الاتصال للطوارئ</label>
                <input type="text" value={formData.translations?.ar?.emergency_contact_name} onChange={(e) => handleTranslationChange("ar", "emergency_contact_name", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">صلة القرابة</label>
                <input type="text" value={formData.translations?.ar?.emergency_contact_relationship} onChange={(e) => handleTranslationChange("ar", "emergency_contact_relationship", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E8EB] sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-[14px] font-medium text-[#6C7688] hover:text-[#0A1B39] transition-colors disabled:opacity-50"
            >
              {t.settings?.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#2E37A4] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#252E8A] transition-colors disabled:opacity-50"
            >
              {loading ? (t.common?.loading || "Loading...") : (t.clinic?.save_changes || "Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
