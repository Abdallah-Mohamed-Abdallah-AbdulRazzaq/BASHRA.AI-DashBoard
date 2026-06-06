"use client";

import React, { useState, useEffect } from "react";
import { Medication, CreateMedicationPayload, UpdateMedicationPayload } from "@/types/admin-medications";
import { adminMedicationsService } from "@/lib/admin-medications";
import { getApiErrorMessage } from "@/lib/error-utils";
import { X, Loader2 } from "lucide-react";

interface MedicationModalProps {
  t: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  medication?: Medication | null; // null for create, object for edit
}

const FORM_TYPES = [
  "tablet", "capsule", "syrup", "cream", "ointment", 
  "injection", "drops", "inhaler", "suppository", "sachet", "other"
];

export function MedicationModal({ t, isOpen, onClose, onSuccess, medication }: MedicationModalProps) {
  const isEdit = !!medication;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    scientific_name: "",
    category: "",
    form_type: "",
    available_dosages: "",
    indications: "",
    warning_alert: "",
    is_active: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (medication) {
        setFormData({
          name_ar: medication.name_ar || "",
          name_en: medication.name_en || "",
          scientific_name: medication.scientific_name || "",
          category: medication.category || "",
          form_type: medication.form_type || "",
          available_dosages: medication.available_dosages ? medication.available_dosages.join(", ") : "",
          indications: medication.indications || "",
          warning_alert: medication.warning_alert || "",
          is_active: medication.is_active === 1 || medication.is_active === true,
        });
      } else {
        setFormData({
          name_ar: "",
          name_en: "",
          scientific_name: "",
          category: "",
          form_type: "",
          available_dosages: "",
          indications: "",
          warning_alert: "",
          is_active: true,
        });
      }
      setError(null);
    }
  }, [isOpen, medication]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dosagesArray = formData.available_dosages
        .split(",")
        .map(d => d.trim())
        .filter(d => d.length > 0);

      if (isEdit) {
        const payload: UpdateMedicationPayload = {
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          scientific_name: formData.scientific_name,
          category: formData.category,
          form_type: formData.form_type,
          available_dosages: dosagesArray,
          indications: formData.indications,
          warning_alert: formData.warning_alert,
          is_active: formData.is_active,
        };
        await adminMedicationsService.updateMedication(medication.id, payload);
      } else {
        const payload: CreateMedicationPayload = {
          name_ar: formData.name_ar,
          name_en: formData.name_en,
          scientific_name: formData.scientific_name,
          category: formData.category,
          form_type: formData.form_type,
          available_dosages: dosagesArray,
          indications: formData.indications,
          warning_alert: formData.warning_alert,
          is_active: formData.is_active,
        };
        await adminMedicationsService.createMedication(payload);
      }
      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E8EB]">
          <h2 className="text-xl font-bold text-[#0A1B39]">
            {isEdit ? t.clinic.edit_medication || "Edit Medication" : t.clinic.create_medication || "Create Medication"}
          </h2>
          <button onClick={onClose} className="p-2 text-[#6C7688] hover:bg-[#F5F6F8] rounded-full transition-colors" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <form id="medication-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0A1B39]">{t.clinic.medication_name || "Name"} (AR) *</label>
                <input
                  type="text"
                  required
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0A1B39]">{t.clinic.medication_name || "Name"} (EN) *</label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0A1B39]">{t.clinic.generic_name || "Scientific Name"}</label>
                <input
                  type="text"
                  value={formData.scientific_name}
                  onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0A1B39]">{t.clinic.category || "Category"}</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0A1B39]">{t.clinic.dosage_form || "Form Type"}</label>
                <select
                  value={formData.form_type}
                  onChange={(e) => setFormData({ ...formData, form_type: e.target.value })}
                  className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                >
                  <option value="">Select form type...</option>
                  {FORM_TYPES.map(ft => (
                    <option key={ft} value={ft} className="capitalize">{ft}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#0A1B39]">
                  Available Dosages <span className="text-xs text-gray-400">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.available_dosages}
                  onChange={(e) => setFormData({ ...formData, available_dosages: e.target.value })}
                  placeholder="e.g. 5mg, 10mg"
                  className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0A1B39]">Indications</label>
              <textarea
                value={formData.indications}
                onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
                className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4] resize-none h-20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0A1B39]">Warning Alert</label>
              <textarea
                value={formData.warning_alert}
                onChange={(e) => setFormData({ ...formData, warning_alert: e.target.value })}
                className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4] resize-none h-20"
              />
            </div>

            {!isEdit && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#2E37A4] border-gray-300 rounded focus:ring-[#2E37A4]"
                />
                <label htmlFor="is_active" className="text-sm text-[#0A1B39]">
                  Is Active
                </label>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-[#E7E8EB] flex items-center justify-end gap-3 bg-[#F5F6F8]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 text-sm font-semibold text-[#6C7688] hover:text-[#0A1B39] transition-colors"
          >
            {t.common.cancel || "Cancel"}
          </button>
          <button
            type="submit"
            form="medication-form"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#2E37A4] hover:bg-[#1A227E] rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t.common.save || "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
