"use client";

import React from "react";
import { 
  PhoneOutlineIcon, 
  MailOutlineIcon, 
  WhatsAppIcon 
} from "@/components/ui/icons/dashboard-icons";

interface ContactDetailsTabProps {
  t: any;
  doctor: any; // سنمرر كائن الطبيب الذي يحتوي على بيانات الاتصال
}

export const ContactDetailsTab = ({ t, doctor }: ContactDetailsTabProps) => {
  const contact = doctor.contactDetails;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Contact Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        
        {/* WhatsApp Card */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex items-start gap-4 hover:border-[#27AE60] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#27AE60] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <WhatsAppIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#0A1B39] mb-1">{t.clinic.whatsapp_number}</span>
            <span className="text-[14px] text-[#6C7688]" dir="ltr">{contact?.whatsapp || "-"}</span>
          </div>
        </div>

        {/* Additional Phone Card */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex items-start gap-4 hover:border-[#2E37A4] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#F5F6F8] text-[#2E37A4] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <PhoneOutlineIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#0A1B39] mb-1">{t.clinic.additional_phone}</span>
            <span className="text-[14px] text-[#6C7688]" dir="ltr">{contact?.additionalPhone || "-"}</span>
          </div>
        </div>

        {/* Personal Email Card */}
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 shadow-sm flex items-start gap-4 hover:border-[#F2994A] transition-colors group">
          <div className="w-10 h-10 rounded-full bg-[#FFF9F2] text-[#F2994A] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MailOutlineIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#0A1B39] mb-1">{t.clinic.personal_email}</span>
            <span className="text-[14px] text-[#6C7688] break-all">{contact?.personalEmail || "-"}</span>
          </div>
        </div>

      </div>

      {/* 2. Contact Notes Section */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 sm:p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.clinic.contact_notes}</h3>
          {contact?.updatedAt && (
             <span className="text-[11px] text-[#9DA4B0]">
               {t.clinic.last_updated}: <span dir="ltr">{contact.updatedAt}</span>
             </span>
          )}
        </div>
        
        {contact?.notes ? (
          <div className="p-4 bg-[#FAFBFC] border border-[#F3F4F6] rounded-[8px] text-[13px] text-[#6C7688] leading-relaxed relative">
             {/* Simple visual quote line */}
             <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-[3px] bg-[#E7E8EB] rounded-l-[8px] rtl:rounded-l-none rtl:rounded-r-[8px]"></div>
             {contact.notes}
          </div>
        ) : (
          <div className="text-[13px] text-[#9DA4B0] italic">No contact notes available.</div>
        )}
      </div>

    </div>
  );
};