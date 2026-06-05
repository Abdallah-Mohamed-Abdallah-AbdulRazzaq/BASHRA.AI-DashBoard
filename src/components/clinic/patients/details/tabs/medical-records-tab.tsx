"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronDownSmall, 
  CalendarSmallIcon, 
  StethoscopeOutlineIcon,
  FileTextOutlineIcon,
  GenderIcon
} from "@/components/ui/icons/dashboard-icons";

// --- Helper Components for Clean UI ---
const TextBlock = ({ label, text }: { label: string, text: string }) => (
  <div className="flex flex-col gap-1.5 mb-5 last:mb-0">
    <span className="text-[13px] font-bold text-[#0A1B39]">{label}</span>
    <p className="text-[13px] text-[#6C7688] leading-relaxed bg-[#FAFBFC] p-3.5 rounded-[8px] border border-[#E7E8EB]">
      {text || "-"}
    </p>
  </div>
);

const Badge = ({ label, value, type }: { label: string, value: string, type?: "severity" | "response" | "status" }) => {
  let colorClass = "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
  
  if (type === "severity") {
    if (value === "mild") colorClass = "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
    else if (value === "moderate") colorClass = "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";
    else if (value === "severe") colorClass = "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
  } else if (type === "response") {
    if (["excellent", "good"].includes(value)) colorClass = "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
    else if (value === "fair") colorClass = "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";
    else if (value === "poor") colorClass = "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
  } else if (type === "status") {
    if (value === "final") colorClass = "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20";
    else if (value === "amended") colorClass = "bg-[#F3E8FF] text-[#6B21A8] border-[#6B21A8]/20";
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-[#9DA4B0]">{label}</span>
      <span className={cn("px-2.5 py-1 text-[11px] font-bold rounded-[6px] border capitalize w-fit", colorClass)}>
        {value}
      </span>
    </div>
  );
};

// --- Main Component ---
interface MedicalRecordsTabProps {
  t: any;
  patient: any;
}

export const MedicalRecordsTab = ({ t, patient }: MedicalRecordsTabProps) => {
  const records = patient.medicalRecords || [];
  // نفتح السجل الأول افتراضياً
  const [expandedId, setExpandedId] = useState<number | null>(records.length > 0 ? records[0].id : null);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="text-[#9DA4B0] mb-2"><FileTextOutlineIcon /></div>
        <p className="text-[14px] text-[#6C7688] font-medium">No medical records found for this patient.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {records.map((record: any) => {
        const isExpanded = expandedId === record.id;
        
        return (
          <div key={record.id} className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden transition-all duration-300">
            
            {/* --- Accordion Header --- */}
            <div 
              onClick={() => setExpandedId(isExpanded ? null : record.id)}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-[#F9FAFB] transition-colors gap-4",
                isExpanded ? "bg-[#FAFBFC] border-b border-[#E7E8EB]" : ""
              )}
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-[#0A1B39]">
                  <div className="w-8 h-8 rounded-full bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0">
                    <CalendarSmallIcon />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold" dir="ltr">{record.visitDate}</span>
                    <span className="text-[12px] text-[#6C7688]">{record.translations.diagnosis || "No Diagnosis"}</span>
                  </div>
                </div>
                
                <div className="hidden sm:block w-[1px] h-8 bg-[#E7E8EB]"></div>
                
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#6C7688]">
                  <StethoscopeOutlineIcon /> {record.doctorName}
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                <span className={cn(
                  "px-3 py-1 text-[11px] font-bold rounded-[6px] border capitalize",
                  record.status === "final" ? "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]/20" : "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]"
                )}>
                  {t.clinic[record.status] || record.status}
                </span>
                <div className={cn("text-[#6C7688] transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")}>
                  <ChevronDownSmall />
                </div>
              </div>
            </div>

            {/* --- Accordion Body (Expanded Content) --- */}
            <div className={cn("grid transition-all duration-300 ease-in-out", isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <div className="p-5 flex flex-col gap-6 bg-white">
                  
                  {/* Top Stats Bar */}
                  <div className="flex flex-wrap items-center gap-6 p-4 bg-[#FAFBFC] border border-[#E7E8EB] rounded-[8px]">
                    <Badge label={t.clinic.severity} value={record.severity} type="severity" />
                    <Badge label={t.clinic.treatment_response} value={record.response} type="response" />
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-[#9DA4B0]">{t.clinic.affected_areas}</span>
                      <div className="flex flex-wrap gap-1">
                        {record.affectedAreas?.map((area: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-[#E7E8EB] text-[#0A1B39] text-[11px] font-medium rounded-[4px] shadow-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 sm:ml-auto rtl:sm:mr-auto rtl:sm:ml-0">
                      <span className="text-[11px] font-semibold text-[#9DA4B0]">{t.clinic.next_appointment}</span>
                      <span className="text-[13px] font-bold text-[#2E37A4]" dir="ltr">
                        {record.nextAppointmentRecommended ? record.followUpDate : "Not Required"}
                      </span>
                    </div>
                  </div>

                  {/* Main Two Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Column 1: Clinical Notes */}
                    <div className="flex flex-col">
                      <h4 className="text-[15px] font-bold text-[#2E37A4] flex items-center gap-2 mb-4 border-b border-[#E7E8EB] pb-2">
                        <GenderIcon /> {t.clinic.clinical_notes}
                      </h4>
                      <TextBlock label={t.clinic.chief_complaint} text={record.translations.chiefComplaint} />
                      <TextBlock label={t.clinic.hpi} text={record.translations.hpi} />
                      <TextBlock label={t.clinic.physical_exam} text={record.translations.physicalExam} />
                    </div>

                    {/* Column 2: Assessment & Plan */}
                    <div className="flex flex-col">
                      <h4 className="text-[15px] font-bold text-[#2E37A4] flex items-center gap-2 mb-4 border-b border-[#E7E8EB] pb-2">
                        <FileTextOutlineIcon /> {t.clinic.medical_assessment}
                      </h4>
                      <TextBlock label={t.clinic.diagnosis} text={record.translations.diagnosis} />
                      <TextBlock label={t.clinic.differential_diagnosis} text={record.translations.differentialDiagnosis} />
                      <TextBlock label={t.clinic.treatment_plan} text={record.translations.treatmentPlan} />
                      <TextBlock label={t.clinic.doctor_notes} text={record.translations.doctorNotes} />
                      <TextBlock label={t.clinic.follow_up_instructions} text={record.translations.followUp} />
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};