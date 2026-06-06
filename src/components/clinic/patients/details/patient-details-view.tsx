"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { PatientDetailsHeader } from "./patient-details-header";
import { GeneralInfoTab } from "./tabs/general-info-tab";
import { MedicalRecordsTab } from "./tabs/medical-records-tab";
import { PrescriptionsTab } from "./tabs/prescriptions-tab";
import { PatientProfilesTab } from "./tabs/patient-profiles-tab";
import { AiDiagnosisTab } from "./tabs/ai-diagnosis-tab";
import { AppointmentsTab } from "./tabs/appointments-tab";
import { TransactionsTab } from "./tabs/transactions-tab";
import { getAdminUserById, getAdminUserMedicalProfile, getAdminUserLogs, getPatientProfileByUserId, updateAdminUserStatus } from "@/lib/admin-users";
import { ApiError } from "@/lib/api";
import type { AdminUserDetailsData, AdminUserMedicalProfileData, AdminUserLog, PatientProfileDetailResponse, UserStatus } from "@/types/admin-users";

interface PatientDetailsViewProps {
  t: any;
}

export default function PatientDetailsView({ t }: PatientDetailsViewProps) {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id");
  const idNum = patientId ? parseInt(patientId, 10) : null;

  const [patient, setPatient] = useState<AdminUserDetailsData | null>(null);
  const [medicalProfile, setMedicalProfile] = useState<AdminUserMedicalProfileData | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfileDetailResponse | null>(null);
  const [logs, setLogs] = useState<AdminUserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [activeTab, setActiveTab] = useState("general");

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<UserStatus>("active");
  const [reason, setReason] = useState("");

  const tabs = [
    { id: "general", label: t.clinic.tab_general_info },
    { id: "medical_records", label: t.clinic.tab_medical_records },
    { id: "prescriptions", label: t.clinic.tab_prescriptions },
    { id: "profiles", label: t.clinic.tab_patient_profiles },
    { id: "ai_diagnosis", label: t.clinic.tab_ai_diagnosis },
    { id: "appointments", label: t.clinic.tab_appointments },
    { id: "transactions", label: t.clinic.tab_transactions },
  ];

  const fetchData = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const [userData, medicalData, patientProfileData, logsData] = await Promise.all([
        getAdminUserById(id),
        getAdminUserMedicalProfile(id).catch(() => null),
        getPatientProfileByUserId(id).catch(() => null),
        getAdminUserLogs(id, { page: 1, limit: 10 }).catch(() => []),
      ]);
      setPatient(userData);
      setMedicalProfile(medicalData);
      setPatientProfile(patientProfileData);
      setLogs(logsData);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 404) setNotFound(true);
        else setError(err.getDisplayMessage());
      } else {
        setError(t.clinic.patient_details_load_error || "Failed to load patient details");
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (idNum) fetchData(idNum);
    else setLoading(false);
  }, [idNum, fetchData]);

  const handleStatusUpdate = async () => {
    if (!patient || !idNum) return;
    if (reason.trim().length < 10 || reason.trim().length > 500) {
      alert(t.clinic.reason_required || "Reason must be between 10 and 500 characters");
      return;
    }
    setStatusUpdating(true);
    try {
      await updateAdminUserStatus(idNum, { status: newStatus, reason: reason.trim() });
      setStatusModal(false);
      setReason("");
      await fetchData(idNum);
      alert(t.clinic.status_update_success || "Patient status updated successfully");
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 403) {
        alert(t.clinic.permission_denied || "You do not have permission to perform this action");
      } else {
        const msg = err instanceof ApiError ? err.getDisplayMessage() : (t.clinic.status_update_error || "Failed");
        alert(msg);
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  if (!idNum) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[#F5F6F8]">
        <span className="text-[14px] text-[#9DA4B0]">{t.clinic.not_found || "Patient not found"}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6C7688]">{t.clinic.loading_patients || "Loading..."}</span>
        </div>
      </div>
    );
  }

  if (notFound || !patient) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[#F5F6F8]">
        <span className="text-[14px] text-[#9DA4B0]">{t.clinic.not_found || "Patient not found"}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[#F5F6F8]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[14px] text-[#EF1E1E] font-medium">{error}</span>
          <button
            onClick={() => idNum && fetchData(idNum)}
            className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88]"
          >
            {t.clinic.retry || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <PatientDetailsHeader t={t} patient={patient} />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setStatusModal(true)}
          className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88]"
        >
          {t.clinic.update_status || "Update Status"}
        </button>
      </div>

      <div className="w-full border-b border-[#E7E8EB] flex items-center gap-6 overflow-x-auto custom-scrollbar mt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-[14px] font-bold whitespace-nowrap border-b-2 transition-all",
              activeTab === tab.id 
                ? "border-[#2E37A4] text-[#2E37A4]" 
                : "border-transparent text-[#6C7688] hover:text-[#0A1B39]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full mt-2">
        {activeTab === "general" && <GeneralInfoTab t={t} patient={patient} medicalProfile={medicalProfile} logs={logs} />}
        {activeTab === "medical_records" && <MedicalRecordsTab t={t} patient={patient} />}
        {activeTab === "prescriptions" && <PrescriptionsTab t={t} patient={patient} />}
        {activeTab === "profiles" && <PatientProfilesTab t={t} patient={patient} medicalProfile={medicalProfile} patientProfile={patientProfile} />}
        {activeTab === "ai_diagnosis" && <AiDiagnosisTab t={t} patient={patient} />}
        {activeTab === "appointments" && <AppointmentsTab t={t} patient={patient} />}
        {activeTab === "transactions" && <TransactionsTab t={t} patient={patient} />}
      </div>

      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[12px] p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-4">{t.clinic.update_status || "Update Status"}</h3>
            <div className="flex flex-col gap-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39]"
              >
                <option value="active">{t.clinic.active || "Active"}</option>
                <option value="inactive">{t.clinic.status_inactive || "Inactive"}</option>
                <option value="suspended">{t.clinic.status_suspended || "Suspended"}</option>
                <option value="pending_verification">{t.clinic.status_pending_verification || "Pending Verification"}</option>
              </select>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.clinic.reason_required || "Reason (10-500 characters)"}
                className="w-full h-24 px-3 py-2 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] resize-none"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setStatusModal(false); setReason(""); }}
                  className="px-4 py-2 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[6px]"
                >
                  {t.clinic.close || "Cancel"}
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={statusUpdating}
                  className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] disabled:opacity-50"
                >
                  {statusUpdating ? "..." : (t.clinic.apply || "Update")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
