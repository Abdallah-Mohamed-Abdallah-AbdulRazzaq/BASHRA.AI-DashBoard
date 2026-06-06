"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getDoctorById, getDoctorProfileComplete, getDoctorPersonalData, getDoctorProfessionalData, getDoctorDocuments, getDoctorDocumentsSummary, getDoctorContactDetailsByDoctorId } from "@/lib/admin-doctors";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { DoctorDetailData, DoctorProfileCompleteData, DoctorPersonalData, DoctorProfessionalData, DoctorDocumentsData, DoctorDocumentsSummaryData, DoctorContactDetailsData } from "@/types/admin-doctors";
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
    </div>
  );
}