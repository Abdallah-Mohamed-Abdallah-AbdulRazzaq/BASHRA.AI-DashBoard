"use client";
import React from "react";
import { PhoneOutlineIcon, CalendarSmallIcon, MapPinOutlineIcon, FileTextOutlineIcon } from "@/components/ui/icons/dashboard-icons";

// -----------------------------------------------------
// 1. General Info Tab
// -----------------------------------------------------
export const PatientGeneralTab = ({ t, patient }: { t: any, patient: any }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#0A1B39] mb-5">{t.clinic.about || "About Patient"}</h3>
      <div className="flex flex-col gap-4">
        <InfoRow icon={<MapPinOutlineIcon />} label="Address" value={patient.address} />
        <InfoRow icon={<CalendarSmallIcon />} label="Date of Birth" value={patient.dob} dir="ltr" />
        <InfoRow icon={<FileTextOutlineIcon />} label="Occupation" value={patient.occupation} />
      </div>
    </div>

    <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#0A1B39] mb-5">{t.clinic.emergency_contact || "Emergency Contact"}</h3>
      <div className="flex flex-col gap-4">
        <InfoRow icon={<PhoneOutlineIcon />} label={t.clinic.contact_name || "Name"} value={patient.emergency.name} />
        <InfoRow icon={<PhoneOutlineIcon />} label={t.clinic.relationship || "Relationship"} value={patient.emergency.relation} />
        <InfoRow icon={<PhoneOutlineIcon />} label="Phone" value={patient.emergency.phone} dir="ltr" />
      </div>
    </div>
  </div>
);

const InfoRow = ({ icon, label, value, dir="auto" }: any) => (
  <div className="flex items-start gap-3 border-b border-dashed border-[#E7E8EB] pb-3 last:border-0 last:pb-0">
    <div className="w-8 h-8 rounded-full bg-[#F5F6F8] flex items-center justify-center text-[#6C7688] shrink-0">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[12px] font-bold text-[#0A1B39]">{label}</span>
      <span className="text-[13px] text-[#6C7688]" dir={dir}>{value}</span>
    </div>
  </div>
);

// -----------------------------------------------------
// 2. Medical History Tab
// -----------------------------------------------------
export const PatientMedicalTab = ({ t, patient }: { t: any, patient: any }) => (
  <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#0A1B39] mb-4">{t.clinic.allergies || "Allergies"}</h3>
      <div className="flex flex-wrap gap-2">
        {patient.medicalHistory.allergies.map((item: string, i: number) => (
          <span key={i} className="px-3 py-1.5 bg-[#FEF2F2] text-[#EF1E1E] text-[12px] font-semibold rounded-[6px] border border-[#EF1E1E]/20">{item}</span>
        ))}
      </div>
    </div>
    
    <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-[#0A1B39] mb-4">{t.clinic.surgeries || "Past Surgeries & Conditions"}</h3>
      <div className="flex flex-col gap-3">
        {patient.medicalHistory.conditions.map((item: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-3 bg-[#FAFBFC] border border-[#E7E8EB] rounded-[8px]">
            <span className="text-[14px] font-bold text-[#0A1B39]">{item.name}</span>
            <span className="text-[12px] font-medium text-[#6C7688] bg-white px-2 py-1 rounded border shadow-sm" dir="ltr">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// -----------------------------------------------------
// 3. Prescriptions Tab
// -----------------------------------------------------
export const PatientPrescriptionsTab = ({ t, patient }: { t: any, patient: any }) => (
  <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
    <table className="w-full text-start">
      <thead className="bg-[#FAFBFC] border-b border-[#E7E8EB]">
        <tr>
          <th className="py-4 px-5 text-start text-[13px] font-bold text-[#0A1B39]">{t.clinic.medication || "Medication"}</th>
          <th className="py-4 px-5 text-start text-[13px] font-bold text-[#0A1B39]">{t.clinic.dosage || "Dosage"}</th>
          <th className="py-4 px-5 text-start text-[13px] font-bold text-[#0A1B39]">{t.clinic.frequency || "Frequency"}</th>
          <th className="py-4 px-5 text-start text-[13px] font-bold text-[#0A1B39]">Date Prescribed</th>
        </tr>
      </thead>
      <tbody>
        {patient.prescriptions.map((item: any, i: number) => (
          <tr key={i} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB]">
            <td className="py-4 px-5 text-[14px] font-bold text-[#2E37A4]">{item.name}</td>
            <td className="py-4 px-5 text-[13px] text-[#6C7688]">{item.dosage}</td>
            <td className="py-4 px-5 text-[13px] text-[#6C7688]">{item.frequency}</td>
            <td className="py-4 px-5 text-[13px] text-[#6C7688]" dir="ltr">{item.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);