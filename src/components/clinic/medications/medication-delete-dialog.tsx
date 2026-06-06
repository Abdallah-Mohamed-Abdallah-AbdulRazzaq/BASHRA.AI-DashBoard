"use client";

import React, { useState } from "react";
import { Medication } from "@/types/admin-medications";
import { adminMedicationsService } from "@/lib/admin-medications";
import { getApiErrorMessage } from "@/lib/error-utils";
import { X, Loader2, AlertTriangle } from "lucide-react";

interface MedicationDeleteDialogProps {
  t: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  medication: Medication | null;
}

export function MedicationDeleteDialog({ t, isOpen, onClose, onSuccess, medication }: MedicationDeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !medication) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminMedicationsService.deleteMedication(medication.id);
      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
      setLoading(false); // Modal remains open on error as requested
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E8EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#0A1B39]">
              {t.clinic.delete_medication || "Delete Medication"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-[#6C7688] hover:bg-[#F5F6F8] rounded-full transition-colors" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-[#6C7688] text-[15px] leading-relaxed mb-6">
            Are you sure you want to delete <span className="font-semibold text-[#0A1B39]">{medication.name_en}</span>? 
            This action cannot be undone.
          </p>

          {error && (
            <div className="p-4 mb-2 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
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
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t.common.delete || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
