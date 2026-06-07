"use client";

import React, { useState } from "react";
import { XIcon, PlusIcon } from "lucide-react";
import type { DoctorProfessionalData, UpdateDoctorProfessionalDataPayload } from "@/types/admin-doctors";

interface EditDoctorProfessionalModalProps {
  t: any;
  initialData: DoctorProfessionalData;
  onClose: () => void;
  onConfirm: (payload: UpdateDoctorProfessionalDataPayload) => Promise<void>;
}

export function EditDoctorProfessionalModal({ t, initialData, onClose, onConfirm }: EditDoctorProfessionalModalProps) {
  const [formData, setFormData] = useState<UpdateDoctorProfessionalDataPayload>({
    license_number: initialData.license_number || "",
    years_of_experience: initialData.years_of_experience || 0,
    medical_school: initialData.medical_school || "",
    graduation_year: initialData.graduation_year || 0,
    board_certifications: initialData.board_certifications || [],
    languages_spoken: initialData.languages_spoken || [],
    translations: {
      en: {
        specialty: initialData.translations?.en?.specialty || "",
        sub_specialty: initialData.translations?.en?.sub_specialty || "",
        biography: initialData.translations?.en?.biography || "",
      },
      ar: {
        specialty: initialData.translations?.ar?.specialty || "",
        sub_specialty: initialData.translations?.ar?.sub_specialty || "",
        biography: initialData.translations?.ar?.biography || "",
      }
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newCert, setNewCert] = useState("");
  const [newLang, setNewLang] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.years_of_experience && formData.years_of_experience < 0) {
      setError("Years of experience cannot be negative");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        license_number: formData.license_number?.trim(),
        medical_school: formData.medical_school?.trim(),
        graduation_year: formData.graduation_year ? Number(formData.graduation_year) : undefined,
        years_of_experience: formData.years_of_experience ? Number(formData.years_of_experience) : undefined,
      };
      await onConfirm(payload);
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

  const addCert = () => {
    if (newCert.trim()) {
      setFormData(prev => ({ ...prev, board_certifications: [...(prev.board_certifications || []), newCert.trim()] }));
      setNewCert("");
    }
  };

  const removeCert = (index: number) => {
    setFormData(prev => {
      const newCerts = [...(prev.board_certifications || [])];
      newCerts.splice(index, 1);
      return { ...prev, board_certifications: newCerts };
    });
  };

  const addLang = () => {
    if (newLang.trim()) {
      setFormData(prev => ({ ...prev, languages_spoken: [...(prev.languages_spoken || []), newLang.trim()] }));
      setNewLang("");
    }
  };

  const removeLang = (index: number) => {
    setFormData(prev => {
      const newLangs = [...(prev.languages_spoken || [])];
      newLangs.splice(index, 1);
      return { ...prev, languages_spoken: newLangs };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[12px] shadow-lg w-full max-w-[800px] my-auto animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-[#E7E8EB] sticky top-0 bg-white z-10 rounded-t-[12px]">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">
            {t.clinic?.edit_professional_data || "Edit Professional Data"}
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
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.medical_license || "License Number"}</label>
              <input type="text" value={formData.license_number} onChange={(e) => setFormData({...formData, license_number: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.years_of_experience || "Years of Experience"}</label>
              <input type="number" min={0} value={formData.years_of_experience} onChange={(e) => setFormData({...formData, years_of_experience: Number(e.target.value)})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.medical_school || "Medical School"}</label>
              <input type="text" value={formData.medical_school} onChange={(e) => setFormData({...formData, medical_school: e.target.value})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.graduation_year || "Graduation Year"}</label>
              <input type="number" value={formData.graduation_year} onChange={(e) => setFormData({...formData, graduation_year: Number(e.target.value)})} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.board_certifications || "Board Certifications"}</label>
              <div className="flex gap-2">
                <input type="text" value={newCert} onChange={e => setNewCert(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter'){ e.preventDefault(); addCert(); }}} className="flex-1 h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" placeholder="Add certification" />
                <button type="button" onClick={addCert} className="w-10 h-10 flex items-center justify-center bg-[#F5F6F8] rounded-[6px] border border-[#E7E8EB] text-[#2E37A4]"><PlusIcon className="w-4 h-4" /></button>
              </div>
              {formData.board_certifications && formData.board_certifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.board_certifications.map((cert, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-[#F5F6F8] text-[12px] font-medium text-[#0A1B39] rounded-[4px] border border-[#E7E8EB]">
                      {cert}
                      <button type="button" onClick={() => removeCert(idx)} className="text-[#EF1E1E] ml-1"><XIcon className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#0A1B39]">{t.clinic?.languages_spoken || "Languages Spoken"}</label>
              <div className="flex gap-2">
                <input type="text" value={newLang} onChange={e => setNewLang(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter'){ e.preventDefault(); addLang(); }}} className="flex-1 h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" placeholder="Add language" />
                <button type="button" onClick={addLang} className="w-10 h-10 flex items-center justify-center bg-[#F5F6F8] rounded-[6px] border border-[#E7E8EB] text-[#2E37A4]"><PlusIcon className="w-4 h-4" /></button>
              </div>
              {formData.languages_spoken && formData.languages_spoken.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.languages_spoken.map((lang, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-[#F0FDF4] text-[12px] font-bold text-[#27AE60] rounded-[4px] border border-[#27AE60]/20">
                      {lang}
                      <button type="button" onClick={() => removeLang(idx)} className="text-[#EF1E1E] ml-1"><XIcon className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-px bg-[#E7E8EB]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Translations */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[14px] font-bold text-[#2E37A4]">English Data</h4>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">Specialty</label>
                <input type="text" value={formData.translations?.en?.specialty} onChange={(e) => handleTranslationChange("en", "specialty", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">Sub Specialty</label>
                <input type="text" value={formData.translations?.en?.sub_specialty} onChange={(e) => handleTranslationChange("en", "sub_specialty", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">Biography</label>
                <textarea value={formData.translations?.en?.biography} onChange={(e) => handleTranslationChange("en", "biography", e.target.value)} className="w-full h-24 p-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39] resize-none custom-scrollbar" />
              </div>
            </div>

            {/* Arabic Translations */}
            <div className="flex flex-col gap-4" dir="rtl">
              <h4 className="text-[14px] font-bold text-[#2E37A4]">البيانات بالعربية</h4>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">التخصص</label>
                <input type="text" value={formData.translations?.ar?.specialty} onChange={(e) => handleTranslationChange("ar", "specialty", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">التخصص الدقيق</label>
                <input type="text" value={formData.translations?.ar?.sub_specialty} onChange={(e) => handleTranslationChange("ar", "sub_specialty", e.target.value)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold text-[#6C7688]">السيرة الذاتية</label>
                <textarea value={formData.translations?.ar?.biography} onChange={(e) => handleTranslationChange("ar", "biography", e.target.value)} className="w-full h-24 p-3 border border-[#E7E8EB] rounded-[6px] text-[14px] text-[#0A1B39] resize-none custom-scrollbar" />
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
