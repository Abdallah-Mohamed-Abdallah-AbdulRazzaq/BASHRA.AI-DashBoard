"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getDoctorById, getDoctorProfileComplete, getDoctorPersonalData, getDoctorProfessionalData, getDoctorDocuments, getDoctorDocumentsSummary, getDoctorContactDetailsByDoctorId, approveDoctor, rejectDoctor, suspendDoctor, updateDoctorStatus, verifyDoctor, updateDoctorApprovalStatus } from "@/lib/admin-doctors";
import { getApiErrorMessage, isForbiddenError } from "@/lib/error-utils";
import type { DoctorDetailData, DoctorProfileCompleteData, DoctorPersonalData, DoctorProfessionalData, DoctorDocumentsData, DoctorDocumentsSummaryData, DoctorContactDetailsData, DoctorStatus, DoctorApprovalStatus } from "@/types/admin-doctors";
import { DoctorDetailsHeader } from "./doctor-details-header";
import { GeneralInfoTab } from "./tabs/general-info-tab";
import { ProfileDetailsTab } from "./tabs/profile-details-tab";
import { ContactDetailsTab } from "./tabs/contact-details-tab";

interface DoctorDetailsViewProps {
  t: any;
}

export default function DoctorDetailsView({ t }: DoctorDetailsViewProps) {
  const params = useParams();
  const lang = params.lang as string;
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("id");

  const [doctor, setDoctor] = useState<DoctorDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [profileComplete, setProfileComplete] = useState<DoctorProfileCompleteData | null>(null);
  const [personalData, setPersonalData] = useState<DoctorPersonalData | null>(null);
  const [professionalData, setProfessionalData] = useState<DoctorProfessionalData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [documentsData, setDocumentsData] = useState<DoctorDocumentsData | null>(null);
  const [documentsSummary, setDocumentsSummary] = useState<DoctorDocumentsSummaryData | null>(null);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<DoctorContactDetailsData | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const [actionModal, setActionModal] = useState<{ type: 'approve' | 'reject' | 'suspend' | 'status' | 'verify' | 'approval_status'; label: string } | null>(null);
  const [actionStatus, setActionStatus] = useState<DoctorStatus>('active');
  const [actionApprovalStatus, setActionApprovalStatus] = useState<DoctorApprovalStatus>('approved');
  const [actionIsVerified, setActionIsVerified] = useState(true);
  const [actionReason, setActionReason] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const tabs = [
    { id: "general", label: t.clinic.tab_general_info },
    { id: "contact", label: t.clinic.tab_contact_details },
    { id: "subscriptions", label: t.clinic.tab_subscriptions },
    { id: "schedules", label: t.clinic.tab_schedules },
    { id: "profile", label: t.clinic.tab_profile_details },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const PLACEHOLDER = "This section will be connected in a later phase.";

  const fetchDoctor = useCallback(async () => {
    if (!doctorId) {
      setError(t?.clinic?.doctor_id_missing || "Doctor ID is missing in the URL");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setNotFound(false);
    setProfileLoading(true);
    setProfileError(null);
    setDocumentsError(null);
    setContactLoading(true);
    setContactError(null);
    try {
      const response = await getDoctorById(Number(doctorId));
      if (!response.success || !response.data) {
        setNotFound(true);
        setProfileLoading(false);
        setContactLoading(false);
        return;
      }
      setDoctor(response.data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(getApiErrorMessage(err));
      }
      setProfileLoading(false);
      setContactLoading(false);
      return;
    } finally {
      setLoading(false);
    }
    const results = await Promise.allSettled([
      getDoctorProfileComplete(Number(doctorId)),
      getDoctorPersonalData(Number(doctorId)),
      getDoctorProfessionalData(Number(doctorId)),
      getDoctorDocuments(Number(doctorId)),
      getDoctorDocumentsSummary(Number(doctorId)),
      getDoctorContactDetailsByDoctorId(Number(doctorId)),
    ]);
    if (results[0].status === 'fulfilled' && results[0].value?.success) {
      setProfileComplete(results[0].value.data ?? null);
    }
    if (results[1].status === 'fulfilled' && results[1].value?.success) {
      setPersonalData(results[1].value.data ?? null);
    }
    if (results[2].status === 'fulfilled' && results[2].value?.success) {
      setProfessionalData(results[2].value.data ?? null);
    }
    if (results[3].status === 'fulfilled' && results[3].value?.success) {
      setDocumentsData(results[3].value.data ?? null);
    }
    if (results[4].status === 'fulfilled' && results[4].value?.success) {
      setDocumentsSummary(results[4].value.data ?? null);
    }
    if ([results[3], results[4]].every(r => r.status === 'rejected')) {
      setDocumentsError("Failed to load documents data");
    }
    if (results[5].status === 'fulfilled' && results[5].value?.success) {
      setContactDetails(results[5].value.data ?? null);
    }
    if (results[5].status === 'rejected') {
      setContactError("Failed to load contact details");
    }
    if ([results[0], results[1], results[2]].every(r => r.status === 'rejected')) {
      setProfileError("Failed to load profile data");
    }
    setProfileLoading(false);
    setContactLoading(false);
  }, [doctorId, t]);

  const openActionModal = (type: 'approve' | 'reject' | 'suspend' | 'status' | 'verify' | 'approval_status') => {
    setActionReason('');
    setActionStatus(doctor?.status || 'active');
    setActionApprovalStatus(doctor?.approval_status || 'approved');
    setActionIsVerified(!doctor?.is_verified);
    const labels: Record<string, string> = {
      approve: t.clinic?.approve_doctor || 'Approve Doctor',
      reject: t.clinic?.reject_doctor || 'Reject Doctor',
      suspend: t.clinic?.suspend_doctor || 'Suspend Doctor',
      status: t.clinic?.update_status || 'Update Status',
      verify: doctor?.is_verified ? (t.clinic?.unverify_doctor || 'Unverify Doctor') : (t.clinic?.verify_doctor || 'Verify Doctor'),
      approval_status: t.clinic?.update_approval_status || 'Update Approval Status',
    };
    setActionModal({ type, label: labels[type] });
  };

  const handleAction = async () => {
    if (!doctor || !doctorId || !actionModal) return;
    const requiresReason: Record<string, boolean> = { approve: false, reject: true, suspend: true, status: true, verify: true, approval_status: true };
    if (requiresReason[actionModal.type]) {
      const trimmed = actionReason.trim();
      if (trimmed.length < 10 || trimmed.length > 500) {
        alert(t.clinic?.reason_required || "Reason must be between 10 and 500 characters");
        return;
      }
    }
    setActionSubmitting(true);
    try {
      const id = Number(doctorId);
      const reason = actionReason.trim();
      switch (actionModal.type) {
        case 'approve': await approveDoctor(id, { reason }); break;
        case 'reject': await rejectDoctor(id, { reason }); break;
        case 'suspend': await suspendDoctor(id, { reason }); break;
        case 'status': await updateDoctorStatus(id, { status: actionStatus, reason }); break;
        case 'verify': await verifyDoctor(id, { is_verified: actionIsVerified, reason }); break;
        case 'approval_status': await updateDoctorApprovalStatus(id, { approval_status: actionApprovalStatus, reason }); break;
      }
      setActionModal(null);
      setActionReason('');
      await fetchDoctor();
      alert(t.clinic?.action_success || "Action completed successfully");
    } catch (err: unknown) {
      if (isForbiddenError(err)) {
        alert(t.clinic?.permission_denied || "You do not have permission to perform this action");
      } else {
        alert(getApiErrorMessage(err));
      }
    } finally {
      setActionSubmitting(false);
    }
  };

  useEffect(() => { fetchDoctor(); }, [fetchDoctor]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !doctorId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#EF1E1E] mb-2">{error}</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#0A1B39] mb-2">
            {t?.clinic?.doctor_not_found || "Doctor not found"}
          </p>
          <p className="text-[13px] text-[#6C7688]">
            {t?.clinic?.doctor_not_found_desc || "The doctor you are looking for does not exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#EF1E1E] mb-2">{error}</p>
          <button
            onClick={fetchDoctor}
            className="mt-4 px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#252D88] transition-colors"
          >
            {t?.clinic?.retry || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <DoctorDetailsHeader t={t} doctor={doctor!} />

      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-[14px] font-bold text-[#0A1B39] whitespace-nowrap">{t.clinic?.doctor_actions || 'Doctor Actions'}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold text-[#6C7688] uppercase">{t.clinic?.quick_actions || 'Quick'}</span>
            <button onClick={() => openActionModal('approve')} className="px-3 py-1.5 bg-[#F0FDF4] text-[#27AE60] text-[12px] font-semibold rounded-[6px] border border-[#27AE60]/20 hover:bg-[#E0F7E4] transition-colors">{t.clinic?.approve_doctor || 'Approve'}</button>
            <button onClick={() => openActionModal('reject')} className="px-3 py-1.5 bg-[#FEF2F2] text-[#EF1E1E] text-[12px] font-semibold rounded-[6px] border border-[#EF1E1E]/20 hover:bg-[#FEE2E2] transition-colors">{t.clinic?.reject_doctor || 'Reject'}</button>
            <button onClick={() => openActionModal('suspend')} className="px-3 py-1.5 bg-[#FFF9F2] text-[#F2994A] text-[12px] font-semibold rounded-[6px] border border-[#F2994A]/20 hover:bg-[#FEF3E2] transition-colors">{t.clinic?.suspend_doctor || 'Suspend'}</button>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[#E7E8EB]" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold text-[#6C7688] uppercase">{t.clinic?.advanced_actions || 'Advanced'}</span>
            <button onClick={() => openActionModal('status')} className="px-3 py-1.5 bg-[#F5F6F8] text-[#0A1B39] text-[12px] font-semibold rounded-[6px] border border-[#E7E8EB] hover:bg-[#EEF0F2] transition-colors">{t.clinic?.update_status || 'Status'}</button>
            <button onClick={() => openActionModal('verify')} className="px-3 py-1.5 bg-[#F5F6F8] text-[#0A1B39] text-[12px] font-semibold rounded-[6px] border border-[#E7E8EB] hover:bg-[#EEF0F2] transition-colors">{doctor?.is_verified ? (t.clinic?.unverify_doctor || 'Unverify') : (t.clinic?.verify_doctor || 'Verify')}</button>
            <button onClick={() => openActionModal('approval_status')} className="px-3 py-1.5 bg-[#F5F6F8] text-[#0A1B39] text-[12px] font-semibold rounded-[6px] border border-[#E7E8EB] hover:bg-[#EEF0F2] transition-colors">{t.clinic?.update_approval_status || 'Approval'}</button>
          </div>
        </div>
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
        {activeTab === "general" && <GeneralInfoTab t={t} doctor={doctor!} lang={lang} />}
        {activeTab === "contact" && (
          <ContactDetailsTab
            t={t}
            doctor={doctor!}
            contactDetails={contactDetails}
            contactLoading={contactLoading}
            contactError={contactError}
          />
        )}
        {activeTab === "subscriptions" && (
          <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center text-[13px] text-[#6C7688]">
            {PLACEHOLDER}
          </div>
        )}
        {activeTab === "schedules" && (
          <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center text-[13px] text-[#6C7688]">
            {PLACEHOLDER}
          </div>
        )}
        {activeTab === "profile" && (
          <ProfileDetailsTab
            t={t}
            lang={lang}
            doctor={doctor!}
            profileComplete={profileComplete}
            personalData={personalData}
            professionalData={professionalData}
            profileLoading={profileLoading}
            profileError={profileError}
            documentsData={documentsData}
            documentsSummary={documentsSummary}
            documentsError={documentsError}
          />
        )}
      </div>
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[12px] p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-4">{actionModal.label}</h3>
            <div className="flex flex-col gap-4">
              {actionModal.type === 'status' && (
                <select value={actionStatus} onChange={(e) => setActionStatus(e.target.value as DoctorStatus)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39]">
                  <option value="active">{t.clinic?.active || 'Active'}</option>
                  <option value="inactive">{t.clinic?.status_inactive || 'Inactive'}</option>
                  <option value="suspended">{t.clinic?.status_suspended || 'Suspended'}</option>
                  <option value="pending_verification">{t.clinic?.status_pending_verification || 'Pending Verification'}</option>
                </select>
              )}
              {actionModal.type === 'approval_status' && (
                <select value={actionApprovalStatus} onChange={(e) => setActionApprovalStatus(e.target.value as DoctorApprovalStatus)} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39]">
                  <option value="approved">{t.clinic?.approved || 'Approved'}</option>
                  <option value="pending">{t.clinic?.pending || 'Pending'}</option>
                  <option value="rejected">{t.clinic?.reject_doctor || 'Rejected'}</option>
                  <option value="suspended">{t.clinic?.status_suspended || 'Suspended'}</option>
                </select>
              )}
              {actionModal.type === 'verify' && (
                <select value={actionIsVerified ? 'true' : 'false'} onChange={(e) => setActionIsVerified(e.target.value === 'true')} className="w-full h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39]">
                  <option value="true">{t.clinic?.verified || 'Verified'}</option>
                  <option value="false">{t.clinic?.unverified || 'Unverified'}</option>
                </select>
              )}
              <textarea value={actionReason} onChange={(e) => setActionReason(e.target.value)} placeholder={actionModal.type === 'approve' ? (t.clinic?.action_reason || 'Reason (optional)') : (t.clinic?.reason_required || 'Reason (10-500 char)')} className="w-full h-24 px-3 py-2 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] resize-none" />
              <div className="flex justify-end gap-3">
                <button onClick={() => { setActionModal(null); setActionReason(''); }} className="px-4 py-2 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[6px]">{t.clinic?.close || 'Cancel'}</button>
                <button onClick={handleAction} disabled={actionSubmitting} className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] disabled:opacity-50">{actionSubmitting ? '...' : (t.clinic?.confirm_action || 'Confirm')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}