"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  CalendarSmallIcon, 
  FileTextOutlineIcon, 
  CheckCircleSolidIcon
} from "@/components/ui/icons/dashboard-icons";

// أيقونات خاصة بالوصفات الطبية
const PillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
);

const PrinterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
);

interface PrescriptionsTabProps {
  t: any;
  patient: any;
}

export const PrescriptionsTab = ({ t, patient }: PrescriptionsTabProps) => {
  const prescriptions = patient.prescriptionsData || [];

  if (prescriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="text-[#9DA4B0] mb-2"><PillIcon /></div>
        <p className="text-[14px] text-[#6C7688] font-medium">No prescriptions found for this patient.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {prescriptions.map((prescription: any) => {
        
        // هندلة الألوان بناءً على حالة الوصفة
        let statusColor = "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
        if (prescription.status === "active") statusColor = "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
        if (prescription.status === "filled") statusColor = "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20";
        if (prescription.status === "expired") statusColor = "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
        if (prescription.status === "cancelled") statusColor = "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";

        return (
          <div key={prescription.id} className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative">
            
            {/* 1. Header (Drug Name, Number & Status) */}
            <div className="flex justify-between items-start p-5 border-b border-[#E7E8EB] bg-[#FAFBFC]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[10px] bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0 shadow-inner">
                  <PillIcon />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[18px] font-bold text-[#0A1B39] mb-1 leading-tight">{prescription.medicationName}</h3>
                  <span className="text-[12px] font-medium text-[#2E37A4] bg-white px-2 py-0.5 rounded border border-[#E7E8EB] w-fit">
                    {prescription.prescriptionNumber}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={cn("px-3 py-1 text-[11px] font-bold rounded-[6px] border uppercase", statusColor)}>
                  {t.clinic[`status_${prescription.status}`] || prescription.status}
                </span>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6C7688] hover:text-[#2E37A4] transition-colors">
                  <PrinterIcon /> {t.clinic.print_prescription}
                </button>
              </div>
            </div>

            {/* 2. Core Medical Details Grid */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4 border-b border-[#E7E8EB]">
              <InfoBlock label={t.clinic.dosage} value={prescription.dosage} />
              <InfoBlock label={t.clinic.frequency} value={prescription.frequency} />
              <InfoBlock label={t.clinic.duration} value={prescription.duration} />
              <InfoBlock label={t.clinic.route} value={prescription.routeOfAdministration} />
              
              <InfoBlock label={t.clinic.quantity} value={prescription.quantity} />
              <div className="flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-[#9DA4B0] mb-1">{t.clinic.refills}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#0A1B39]">{prescription.refillsUsed} / {prescription.refillsAllowed}</span>
                  {prescription.refillsUsed >= prescription.refillsAllowed && prescription.refillsAllowed > 0 && (
                    <span className="text-[10px] text-[#EF1E1E] font-medium bg-[#FEF2F2] px-1.5 rounded">Maxed</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#9DA4B0] mb-1">{t.clinic.generic_allowed}</span>
                <span className="text-[13px] font-bold text-[#0A1B39] flex items-center gap-1">
                  {prescription.isGenericAllowed ? <span className="text-[#27AE60]"><CheckCircleSolidIcon /> Yes</span> : "No"}
                </span>
              </div>
            </div>

            {/* 3. Translations & Notes Area */}
            <div className="p-5 flex flex-col gap-4 bg-[#FAFBFC] flex-1">
              {prescription.translations.indication && (
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold text-[#0A1B39]">{t.clinic.indication}</span>
                  <span className="text-[13px] text-[#6C7688]">{prescription.translations.indication}</span>
                </div>
              )}
              
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-[#0A1B39]">{t.clinic.instructions}</span>
                <div className="p-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#2E37A4] font-medium">
                  {prescription.translations.instructions || "-"}
                </div>
              </div>

              {prescription.translations.pharmacyNotes && (
                <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-dashed border-[#E7E8EB]">
                  <span className="text-[12px] font-bold text-[#0A1B39]">{t.clinic.pharmacy_notes}</span>
                  <span className="text-[12px] text-[#9DA4B0] italic">{prescription.translations.pharmacyNotes}</span>
                </div>
              )}
            </div>

            {/* 4. Dates Footer */}
            <div className="px-5 py-3 bg-white border-t border-[#E7E8EB] flex justify-between items-center text-[11px] text-[#9DA4B0] font-medium">
              <span className="flex items-center gap-1.5"><CalendarSmallIcon /> {t.clinic.prescribed_date}: <span className="text-[#6C7688] font-bold" dir="ltr">{prescription.prescribedDate}</span></span>
              {prescription.expiryDate && (
                <span className="flex items-center gap-1.5">{t.clinic.expiry_date}: <span className="text-[#EF1E1E] font-bold" dir="ltr">{prescription.expiryDate}</span></span>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};

const InfoBlock = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-semibold text-[#9DA4B0]">{label}</span>
    <span className="text-[13px] font-bold text-[#0A1B39] capitalize">{value || "-"}</span>
  </div>
);