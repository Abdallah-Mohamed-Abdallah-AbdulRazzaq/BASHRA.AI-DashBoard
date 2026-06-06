import React, { useState, useEffect } from "react";
import { getAdminMedicalRecordById } from "@/lib/admin-medical-records";
import type { MedicalRecordDetails } from "@/types/admin-medical-records";

interface MedicalRecordDetailsModalProps {
  t: any;
  recordId: number;
  onClose: () => void;
}

export function MedicalRecordDetailsModal({ t, recordId, onClose }: MedicalRecordDetailsModalProps) {
  const [details, setDetails] = useState<MedicalRecordDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getAdminMedicalRecordById(recordId)
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setDetails(res.data);
        } else if (isMounted) {
          setError(t.clinic?.not_found || "Record not found");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "Failed to load details");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [recordId, t]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-[16px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#E7E8EB] flex justify-between items-center">
          <h2 className="text-[18px] font-bold text-[#0A1B39]">{t.clinic?.medical_record_details || "Medical Record Details"}</h2>
          <button onClick={onClose} className="text-[#6C7688] hover:text-[#0A1B39]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-[#F9FAFB]">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
            </div>
          ) : error ? (
            <div className="flex justify-center py-10 text-[#EB5757]">
              {error}
            </div>
          ) : details ? (
            <div className="flex flex-col gap-6">
              {/* Basic Info */}
              <div className="bg-white p-4 rounded-[12px] border border-[#E7E8EB] grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[12px] text-[#6C7688]">{t.clinic?.patient || "Patient"}</span>
                  <p className="text-[14px] font-medium text-[#0A1B39]">{details.patient?.full_name || details.patient_id || "—"}</p>
                </div>
                <div>
                  <span className="text-[12px] text-[#6C7688]">{t.clinic?.doctor || "Doctor"}</span>
                  <p className="text-[14px] font-medium text-[#0A1B39]">{details.doctor?.full_name || details.doctor_id || "—"}</p>
                </div>
                <div>
                  <span className="text-[12px] text-[#6C7688]">{t.clinic?.visit_date || "Visit Date"}</span>
                  <p className="text-[14px] font-medium text-[#0A1B39]">{details.visit_date || "—"}</p>
                </div>
                <div>
                  <span className="text-[12px] text-[#6C7688]">{t.clinic?.record_status || "Status"}</span>
                  <p className="text-[14px] font-medium text-[#0A1B39]">{details.record_status || "—"}</p>
                </div>
                <div>
                  <span className="text-[12px] text-[#6C7688]">{t.clinic?.follow_up_required || "Follow-up Required"}</span>
                  <p className="text-[14px] font-medium text-[#0A1B39]">{details.follow_up_required ? "Yes" : "No"}</p>
                </div>
                {details.follow_up_required && (
                  <div>
                    <span className="text-[12px] text-[#6C7688]">{t.clinic?.follow_up_date || "Follow-up Date"}</span>
                    <p className="text-[14px] font-medium text-[#0A1B39]">{details.follow_up_date || "—"}</p>
                  </div>
                )}
              </div>

              {/* Translations/Notes */}
              <div className="bg-white p-4 rounded-[12px] border border-[#E7E8EB] flex flex-col gap-4">
                <h3 className="text-[14px] font-bold text-[#0A1B39]">{t.clinic?.clinical_notes || "Clinical Notes"}</h3>
                
                {(() => {
                  let translation: any = null;
                  if (Array.isArray(details.translations) && details.translations.length > 0) {
                    translation = details.translations[0];
                  } else if (details.translations && typeof details.translations === 'object') {
                    translation = Object.values(details.translations)[0];
                  }

                  return (
                    <>
                      <div>
                        <span className="text-[12px] text-[#6C7688]">{t.clinic?.chief_complaint || "Chief Complaint"}</span>
                        <p className="text-[14px] text-[#0A1B39] mt-1 whitespace-pre-wrap">{translation?.chief_complaint || "—"}</p>
                      </div>
                      <div>
                        <span className="text-[12px] text-[#6C7688]">{t.clinic?.symptoms_description || "Symptoms"}</span>
                        <p className="text-[14px] text-[#0A1B39] mt-1 whitespace-pre-wrap">{translation?.symptoms_description || "—"}</p>
                      </div>
                      <div>
                        <span className="text-[12px] text-[#6C7688]">{t.clinic?.diagnosis || "Diagnosis"}</span>
                        <p className="text-[14px] text-[#0A1B39] mt-1 whitespace-pre-wrap">{translation?.diagnosis || "—"}</p>
                      </div>
                      <div>
                        <span className="text-[12px] text-[#6C7688]">{t.clinic?.treatment_plan || "Treatment Plan"}</span>
                        <p className="text-[14px] text-[#0A1B39] mt-1 whitespace-pre-wrap">{translation?.treatment_plan || "—"}</p>
                      </div>
                      <div>
                        <span className="text-[12px] text-[#6C7688]">{t.clinic?.recommendations || "Recommendations"}</span>
                        <p className="text-[14px] text-[#0A1B39] mt-1 whitespace-pre-wrap">{translation?.recommendations || "—"}</p>
                      </div>
                      <div>
                        <span className="text-[12px] text-[#6C7688]">{t.clinic?.notes || "Notes"}</span>
                        <p className="text-[14px] text-[#0A1B39] mt-1 whitespace-pre-wrap">{translation?.notes || "—"}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : null}
        </div>
        
        <div className="p-4 border-t border-[#E7E8EB] flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-[#F5F6F8] text-[#0A1B39] rounded-[8px] text-[13px] font-medium hover:bg-[#E7E8EB] transition-colors">
            {t.clinic?.close || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
