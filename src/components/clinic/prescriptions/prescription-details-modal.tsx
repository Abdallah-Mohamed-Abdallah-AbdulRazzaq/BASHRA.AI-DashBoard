"use client";

import React, { useEffect, useState } from "react";
import { Prescription } from "@/types/admin-prescriptions";
import { adminPrescriptionsService } from "@/lib/admin-prescriptions";
import { X, Loader2, FileText, User, Stethoscope, Clock } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-utils";

interface PrescriptionDetailsModalProps {
  t: any;
  lang: string;
  isOpen: boolean;
  onClose: () => void;
  prescriptionId: number | null;
}

export function PrescriptionDetailsModal({ t, lang, isOpen, onClose, prescriptionId }: PrescriptionDetailsModalProps) {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && prescriptionId) {
      fetchDetails(prescriptionId);
    } else {
      setPrescription(null);
    }
  }, [isOpen, prescriptionId]);

  const fetchDetails = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminPrescriptionsService.getPrescriptionById(id);
      setPrescription(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E8EB]">
          <h2 className="text-xl font-bold text-[#0A1B39]">
            {t.clinic?.prescription_details || "Prescription Details"} #{prescriptionId}
          </h2>
          <button onClick={onClose} className="p-2 text-[#6C7688] hover:bg-[#F5F6F8] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#2E37A4] animate-spin mb-4" />
              <p className="text-[#6C7688]">Loading details...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          ) : prescription ? (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F5F6F8] p-4 rounded-xl flex items-start gap-3">
                  <User className="w-5 h-5 text-[#2E37A4] mt-0.5" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#6C7688] uppercase tracking-wider mb-1">
                      {t.sidebar?.patient_name || "Patient"}
                    </p>
                    <p className="text-[14px] font-medium text-[#0A1B39]">
                      {prescription.patient?.full_name || `ID: ${prescription.patient_id}`}
                    </p>
                  </div>
                </div>
                <div className="bg-[#F5F6F8] p-4 rounded-xl flex items-start gap-3">
                  <Stethoscope className="w-5 h-5 text-[#2E37A4] mt-0.5" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#6C7688] uppercase tracking-wider mb-1">
                      {t.sidebar?.doctor_name || "Doctor"}
                    </p>
                    <p className="text-[14px] font-medium text-[#0A1B39]">
                      {prescription.doctor?.full_name || `ID: ${prescription.doctor_id}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#E7E8EB] rounded-xl overflow-hidden">
                <div className="bg-[#FAFAFA] px-4 py-3 border-b border-[#E7E8EB] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#6C7688]" />
                  <h3 className="font-semibold text-[#0A1B39]">Medication Info</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">{t.clinic?.medication_name || "Medication Name"}</p>
                    <p className="font-medium text-[#0A1B39]">{prescription.medication_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">{t.clinic?.status || "Status"}</p>
                    <p className="font-medium text-[#0A1B39] capitalize">{prescription.status || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">Dosage</p>
                    <p className="font-medium text-[#0A1B39]">{prescription.dosage || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">Frequency</p>
                    <p className="font-medium text-[#0A1B39]">{prescription.frequency || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">Duration</p>
                    <p className="font-medium text-[#0A1B39]">{prescription.duration || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">Quantity</p>
                    <p className="font-medium text-[#0A1B39]">{prescription.quantity || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">Refills Allowed</p>
                    <p className="font-medium text-[#0A1B39]">{prescription.refills_allowed ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#6C7688] mb-1">Expiry Date</p>
                    <p className="font-medium text-[#0A1B39]">
                      {prescription.expiry_date ? new Date(prescription.expiry_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {prescription.translations && (
                <div className="border border-[#E7E8EB] rounded-xl overflow-hidden">
                  <div className="bg-[#FAFAFA] px-4 py-3 border-b border-[#E7E8EB] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#6C7688]" />
                    <h3 className="font-semibold text-[#0A1B39]">Instructions</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {prescription.translations.en && (
                      <div>
                        <p className="text-[12px] font-semibold text-[#6C7688] mb-1">English (EN)</p>
                        <p className="text-[14px] text-[#0A1B39] bg-[#F5F6F8] p-3 rounded-lg">
                          {prescription.translations.en.instructions || "No instructions provided."}
                        </p>
                      </div>
                    )}
                    {prescription.translations.ar && (
                      <div dir="rtl">
                        <p className="text-[12px] font-semibold text-[#6C7688] mb-1">Arabic (AR)</p>
                        <p className="text-[14px] text-[#0A1B39] bg-[#F5F6F8] p-3 rounded-lg">
                          {prescription.translations.ar.instructions || "No instructions provided."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-[12px] text-[#6C7688]">
                <Clock className="w-4 h-4" />
                <span>Created At: {prescription.created_at ? new Date(prescription.created_at).toLocaleString() : "—"}</span>
              </div>

            </div>
          ) : null}
        </div>

        <div className="p-6 border-t border-[#E7E8EB] flex items-center justify-end bg-[#F5F6F8]">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-white bg-[#2E37A4] hover:bg-[#1A227E] rounded-lg transition-colors"
          >
            {t.common?.close || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
