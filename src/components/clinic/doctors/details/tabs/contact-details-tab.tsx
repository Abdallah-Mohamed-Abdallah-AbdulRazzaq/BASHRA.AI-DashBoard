"use client";

import React from "react";
import {
  PhoneOutlineIcon,
  MailOutlineIcon,
  WhatsAppIcon
} from "@/components/ui/icons/dashboard-icons";
import type { DoctorDetailData, DoctorContactDetailsData } from "@/types/admin-doctors";

interface ContactDetailsTabProps {
  t: any;
  doctor: DoctorDetailData;
  contactDetails: DoctorContactDetailsData | null;
  contactLoading: boolean;
  contactError: string | null;
}

export const ContactDetailsTab = ({ t, doctor, contactDetails, contactLoading, contactError }: ContactDetailsTabProps) => {

  if (contactLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {contactError && (
        <div className="px-5 py-3 bg-[#FFF9F2] border border-[#F2994A]/30 rounded-[8px] text-[13px] text-[#F2994A]">
          {contactError} — Contact details may be incomplete.
        </div>
      )}

      {/* Account Contact Info (from basic doctor object) */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
        <h3 className="text-[16px] font-bold text-[#0A1B39] mb-4">{t.clinic.account_contact}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#2F80ED] flex items-center justify-center shrink-0">
              <MailOutlineIcon />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[#6C7688] font-medium">{t.clinic.email}</p>
              <p className="text-[14px] font-semibold text-[#0A1B39] break-all">{doctor.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5F6F8] text-[#2E37A4] flex items-center justify-center shrink-0">
              <PhoneOutlineIcon />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[#6C7688] font-medium">{t.clinic.phone}</p>
              <p className="text-[14px] font-semibold text-[#0A1B39]" dir="ltr">{doctor.phone || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods (from contact details endpoint) */}
      {contactDetails ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">

            <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex items-start gap-4 hover:border-[#27AE60] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#27AE60] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <WhatsAppIcon />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#0A1B39] mb-1">{t.clinic.whatsapp_number}</span>
                <span className="text-[14px] text-[#6C7688]" dir="ltr">{contactDetails.whatsapp_number || "—"}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex items-start gap-4 hover:border-[#2E37A4] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#F5F6F8] text-[#2E37A4] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <PhoneOutlineIcon />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#0A1B39] mb-1">{t.clinic.additional_phone}</span>
                <span className="text-[14px] text-[#6C7688]" dir="ltr">{contactDetails.additional_phone || "—"}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex items-start gap-4 hover:border-[#F2994A] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#FFF9F2] text-[#F2994A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MailOutlineIcon />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-[#0A1B39] mb-1">{t.clinic.personal_email}</span>
                <span className="text-[14px] text-[#6C7688] break-all">{contactDetails.personal_email || "—"}</span>
              </div>
            </div>

          </div>

          {contactDetails.contact_notes && (
            <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.clinic.contact_notes}</h3>
                {contactDetails.updated_at && (
                  <span className="text-[11px] text-[#9DA4B0]">
                    {t.clinic.last_updated}: <span dir="ltr">{new Date(contactDetails.updated_at).toLocaleDateString()}</span>
                  </span>
                )}
              </div>
              <div className="p-4 bg-[#FAFBFC] border border-[#F3F4F6] rounded-[8px] text-[13px] text-[#6C7688] leading-relaxed relative">
                <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-[3px] bg-[#E7E8EB] rounded-l-[8px] rtl:rounded-l-none rtl:rounded-r-[8px]"></div>
                {contactDetails.contact_notes}
              </div>
            </div>
          )}
        </>
      ) : !contactError ? (
        <div className="p-10 bg-white rounded-[12px] border border-[#E7E8EB] text-center">
          <p className="text-[13px] text-[#6C7688]">{t.clinic.no_contact_details}</p>
        </div>
      ) : null}

    </div>
  );
};
