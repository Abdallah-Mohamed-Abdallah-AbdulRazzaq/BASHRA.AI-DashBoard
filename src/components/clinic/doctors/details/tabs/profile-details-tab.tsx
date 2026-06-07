"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ShieldCheckOutlineIcon, StethoscopeOutlineIcon, FileTextOutlineIcon,
  UsersOutlineIcon, AlertCircleOutlineIcon, SettingsOutlineIcon
} from "@/components/ui/icons/dashboard-icons";
import type { DoctorDetailData, DoctorProfileCompleteData, DoctorPersonalData, DoctorProfessionalData, DoctorDocumentsData, DoctorDocumentsSummaryData } from "@/types/admin-doctors";

interface ProfileDetailsTabProps {
  t: any;
  lang: string;
  doctor: DoctorDetailData;
  profileComplete: DoctorProfileCompleteData | null;
  personalData: DoctorPersonalData | null;
  professionalData: DoctorProfessionalData | null;
  profileLoading: boolean;
  profileError: string | null;
  documentsData: DoctorDocumentsData | null;
  documentsSummary: DoctorDocumentsSummaryData | null;
  documentsError: string | null;
  onEditPersonalClick?: () => void;
  onEditProfessionalClick?: () => void;
  onReviewDocumentClick?: (docId: number, status: "approved" | "rejected") => void;
  onProfileApproveClick?: () => void;
  onProfileRejectClick?: () => void;
  onProfileDeleteClick?: () => void;
}

const SectionCard = ({ title, icon, action, children }: { title: string, icon: React.ReactNode, action?: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC]">
      <div className="flex items-center gap-2.5">
        <div className="text-[#2E37A4]">{icon}</div>
        <h3 className="text-[15px] font-bold text-[#0A1B39]">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className="p-5 flex flex-col">
      {children}
    </div>
  </div>
);

const DataRow = ({ label, value, dir = "auto" }: { label: string, value: React.ReactNode, dir?: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-[#E7E8EB] border-dashed last:border-0 last:pb-0 first:pt-0 gap-1 sm:gap-4">
    <span className="text-[13px] text-[#6C7688] font-medium min-w-[140px]">{label}</span>
    <div className="text-[14px] font-semibold text-[#0A1B39] text-start sm:text-end" dir={dir}>
      {value || "—"}
    </div>
  </div>
);

export const ProfileDetailsTab = ({
  t, lang, doctor,
  profileComplete, personalData, professionalData,
  profileLoading, profileError,
  documentsData, documentsSummary, documentsError,
  onEditPersonalClick, onEditProfessionalClick, onReviewDocumentClick,
  onProfileApproveClick, onProfileRejectClick, onProfileDeleteClick
}: ProfileDetailsTabProps) => {

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] w-full">
        <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileError && !personalData && !professionalData && !profileComplete) {
    return (
      <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center">
        <p className="text-[14px] font-semibold text-[#EF1E1E] mb-1">{profileError}</p>
        <p className="text-[13px] text-[#6C7688]">Profile data is not available at this time.</p>
      </div>
    );
  }

  const pTrans = professionalData?.translations?.[lang];
  const pTransFallbackAr = professionalData?.translations?.["ar"];
  const pTransFallbackEn = professionalData?.translations?.["en"];
  const profSpecialty = pTrans?.specialty || pTransFallbackAr?.specialty || pTransFallbackEn?.specialty || doctor.translations?.[lang]?.specialty || "—";
  const profSubSpecialty = pTrans?.sub_specialty || pTransFallbackAr?.sub_specialty || pTransFallbackEn?.sub_specialty || "—";

  const perTrans = personalData?.translations?.[lang];
  const perTransFallbackAr = personalData?.translations?.["ar"];
  const perTransFallbackEn = personalData?.translations?.["en"];
  const perFullName = perTrans?.full_name || perTransFallbackAr?.full_name || perTransFallbackEn?.full_name || doctor.translations?.[lang]?.full_name || "—";
  const perEmergName = perTrans?.emergency_contact_name || perTransFallbackAr?.emergency_contact_name || perTransFallbackEn?.emergency_contact_name || "—";
  const perEmergRel = perTrans?.emergency_contact_relationship || perTransFallbackAr?.emergency_contact_relationship || perTransFallbackEn?.emergency_contact_relationship || "—";

  const docSummary = documentsSummary || profileComplete?.documents_summary;
  const docsList = documentsData || profileComplete?.documents;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {profileError && (
        <div className="lg:col-span-2 px-5 py-3 bg-[#FFF9F2] border border-[#F2994A]/30 rounded-[8px] text-[13px] text-[#F2994A]">
          {profileError} — Some profile data may be incomplete.
        </div>
      )}

      {/* --- Column 1 --- */}
      <div className="flex flex-col gap-6">

        {/* 1. Verification & Approval */}
        <SectionCard title={t.clinic.verification_info} icon={<ShieldCheckOutlineIcon />}>
          <DataRow
            label={t.clinic.approval_status}
            value={
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border inline-block",
                doctor.approval_status === "approved" ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20"
              )}>
                {doctor.approval_status === "approved" ? t.clinic.approved : t.clinic.pending}
              </span>
            }
          />
          <DataRow
            label={t.clinic.is_verified}
            value={
              <span className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-[6px] border inline-block",
                doctor.is_verified ? "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20" : "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20"
              )}>
                {doctor.is_verified ? t.clinic.verified : t.clinic.unverified}
              </span>
            }
          />
          <DataRow label={t.clinic.verification_date} value={doctor.verification_date || "—"} dir="ltr" />
        </SectionCard>

        {/* 2. Professional Identity */}
        <SectionCard 
          title={t.clinic.professional_identity} 
          icon={<StethoscopeOutlineIcon />}
          action={onEditProfessionalClick ? <button onClick={onEditProfessionalClick} className="text-[12px] font-semibold text-[#2E37A4] hover:underline">{t.clinic.edit || "Edit"}</button> : undefined}
        >
          <DataRow label={t.sidebar.doctor_details} value={perFullName} />
          <DataRow label={t.clinic.specialty} value={profSpecialty} />
          <DataRow label={t.clinic.sub_specialty} value={profSubSpecialty} />
          <DataRow label={t.clinic.medical_license} value={professionalData?.license_number || doctor.license_number || "—"} />
          <DataRow label={t.clinic.years_of_experience} value={professionalData?.years_of_experience != null ? `${professionalData.years_of_experience} Yrs` : doctor.years_of_experience != null ? `${doctor.years_of_experience} Yrs` : "—"} />
        </SectionCard>

        {/* 3. Academic Credentials */}
        <SectionCard title={t.clinic.academic_credentials} icon={<FileTextOutlineIcon />}>
          <DataRow label={t.clinic.medical_school} value={professionalData?.medical_school || "—"} />
          <DataRow label={t.clinic.graduation_year} value={professionalData?.graduation_year?.toString() || "—"} dir="ltr" />
          <div className="flex flex-col py-3">
            <span className="text-[13px] text-[#6C7688] font-medium mb-2">{t.clinic.board_certifications}</span>
            <div className="flex flex-wrap gap-2">
              {professionalData?.board_certifications?.length ? professionalData.board_certifications.map((cert, i) => (
                <span key={i} className="px-3 py-1.5 bg-[#F5F6F8] text-[#0A1B39] text-[12px] font-medium rounded-[6px] border border-[#E7E8EB]">
                  {cert}
                </span>
              )) : <span className="text-[12px] text-[#9DA4B0]">{t.clinic.none || "None"}</span>}
            </div>
          </div>
        </SectionCard>

      </div>

      {/* --- Column 2 --- */}
      <div className="flex flex-col gap-6">

        {/* 4. Personal & Demographics */}
        <SectionCard 
          title={t.clinic.personal_demographics} 
          icon={<UsersOutlineIcon />}
          action={onEditPersonalClick ? <button onClick={onEditPersonalClick} className="text-[12px] font-semibold text-[#2E37A4] hover:underline">{t.clinic.edit || "Edit"}</button> : undefined}
        >
          <DataRow label={t.clinic.dob} value={personalData?.date_of_birth || "—"} dir="ltr" />
          <DataRow label={t.clinic.gender} value={personalData?.gender ? <span className="capitalize">{personalData.gender}</span> : "—"} />
          <DataRow label={t.clinic.nationality} value={personalData?.nationality || "—"} />
          <div className="flex flex-col py-3">
            <span className="text-[13px] text-[#6C7688] font-medium mb-2">{t.clinic.languages_spoken}</span>
            <div className="flex flex-wrap gap-2">
              {professionalData?.languages_spoken?.length ? professionalData.languages_spoken.map((langCode, i) => (
                <span key={i} className="px-3 py-1.5 bg-[#F0FDF4] text-[#27AE60] text-[12px] font-bold rounded-[6px] border border-[#27AE60]/20">
                  {langCode}
                </span>
              )) : <span className="text-[12px] text-[#9DA4B0]">{t.clinic.none || "None"}</span>}
            </div>
          </div>
        </SectionCard>

        {/* 5. Emergency Contact */}
        <SectionCard title={t.clinic.emergency_contact} icon={<AlertCircleOutlineIcon />}>
          <DataRow label={t.clinic.contact_name} value={perEmergName} />
          <DataRow label={t.clinic.relationship} value={perEmergRel} />
          <DataRow label={t.clinic.phone_number} value={personalData?.emergency_contact_phone || "—"} dir="ltr" />
        </SectionCard>

        {/* 6. System Preferences */}
        <SectionCard title={t.clinic.system_preferences} icon={<SettingsOutlineIcon />}>
          <DataRow label={t.clinic.timezone} value={personalData?.timezone ? <span className="font-mono text-[12px] bg-gray-100 px-2 py-1 rounded">{personalData.timezone}</span> : "—"} dir="ltr" />
          <DataRow label={t.clinic.system_language} value={personalData?.language_preference ? <span className="uppercase">{personalData.language_preference}</span> : "—"} dir="ltr" />
        </SectionCard>

      </div>

      {/* Documents Section */}
      {(docSummary || docsList?.length || documentsError) && (
        <div className="lg:col-span-2 w-full mt-2">
          {documentsError && (
            <div className="mb-4 px-5 py-3 bg-[#FFF9F2] border border-[#F2994A]/30 rounded-[8px] text-[13px] text-[#F2994A]">
              {documentsError} — Some document data may be incomplete.
            </div>
          )}
          <SectionCard title={t.clinic.documents || "Documents"} icon={<FileTextOutlineIcon />}>
            {docSummary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 pb-5 border-b border-[#E7E8EB]">
                {[
                  { label: t.clinic.total_documents || "Total", value: docSummary.total },
                  { label: t.clinic.approved || "Approved", value: docSummary.approved },
                  { label: t.clinic.pending || "Pending", value: docSummary.pending },
                  { label: t.clinic.rejected || "Rejected", value: docSummary.rejected },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-[22px] font-bold text-[#0A1B39]">{item.value ?? "0"}</p>
                    <p className="text-[12px] text-[#6C7688]">{item.label}</p>
                  </div>
                ))}
              </div>
            )}

            {docsList?.length ? (
              <div className="flex flex-col gap-2">
                {docsList.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-[#F5F6F8] rounded-[8px] border border-[#E7E8EB]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-[#E8E9F5] rounded-[6px] flex items-center justify-center shrink-0">
                        <FileTextOutlineIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0A1B39] truncate capitalize">
                          {doc.document_type?.replace(/_/g, " ") || "—"}
                        </p>
                        <p className="text-[11px] text-[#6C7688]">
                          {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={cn(
                        "px-2 py-0.5 text-[11px] font-bold rounded-[6px] border",
                        doc.status === "approved" ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : "",
                        doc.status === "pending" ? "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20" : "",
                        doc.status === "rejected" ? "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20" : "",
                        !doc.status ? "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]" : ""
                      )}>
                        {doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : "—"}
                      </span>
                      {doc.status === "pending" && onReviewDocumentClick && (
                        <>
                          <button onClick={() => onReviewDocumentClick(doc.id!, "approved")} className="px-2 py-1 bg-[#F0FDF4] text-[#27AE60] text-[11px] font-bold rounded border border-[#27AE60]/20 hover:bg-[#E0F7E4]">Approve</button>
                          <button onClick={() => onReviewDocumentClick(doc.id!, "rejected")} className="px-2 py-1 bg-[#FEF2F2] text-[#EF1E1E] text-[11px] font-bold rounded border border-[#EF1E1E]/20 hover:bg-[#FEE2E2]">Reject</button>
                        </>
                      )}
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-[#2E37A4] text-[12px] font-semibold hover:underline shrink-0">
                          {t.clinic.view || "View"}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : !documentsError ? (
              <p className="text-[13px] text-[#6C7688] text-center py-4">{t.clinic.no_documents || "No documents uploaded yet."}</p>
            ) : null}

            {docsList && docsList.length > 0 && docsList.some(d => d.status === "rejected" && d.rejection_reason) && (
              <div className="mt-4 pt-4 border-t border-[#E7E8EB]">
                <p className="text-[13px] font-semibold text-[#EF1E1E] mb-2">{t.clinic.rejection_reasons || "Rejection Reasons"}</p>
                {docsList.filter(d => d.status === "rejected" && d.rejection_reason).map(doc => (
                  <p key={doc.id} className="text-[12px] text-[#6C7688] mb-1">
                    <span className="capitalize font-medium">{doc.document_type?.replace(/_/g, " ")}</span>: {doc.rejection_reason}
                  </p>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* Profile Review Actions & Danger Zone */}
      <div className="lg:col-span-2 w-full mt-6 space-y-6">
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-[15px] font-bold text-[#0A1B39]">{t.clinic.profile_review || "Profile Review"}</h4>
            <p className="text-[13px] text-[#6C7688] mt-1">
              Approve or reject the entire profile.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onProfileApproveClick} className="px-5 py-2 bg-[#F0FDF4] text-[#27AE60] text-[13px] font-bold rounded-[8px] border border-[#27AE60]/20 hover:bg-[#E0F7E4] transition-colors">
              {t.clinic.approve_profile || "Approve Profile"}
            </button>
            <button onClick={onProfileRejectClick} className="px-5 py-2 bg-[#FEF2F2] text-[#EF1E1E] text-[13px] font-bold rounded-[8px] border border-[#EF1E1E]/20 hover:bg-[#FEE2E2] transition-colors">
              {t.clinic.reject_profile || "Reject Profile"}
            </button>
          </div>
        </div>

        <div className="bg-[#FEF2F2] border border-[#EF1E1E]/30 rounded-[12px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-[15px] font-bold text-[#EF1E1E]">Danger Zone</h4>
            <p className="text-[13px] text-[#EF1E1E]/80 mt-1">
              Permanently delete this doctor's profile. This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onProfileDeleteClick} className="px-5 py-2 bg-[#EF1E1E] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#DC2626] transition-colors shadow-sm">
              {t.clinic.delete_profile || "Delete Profile"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};