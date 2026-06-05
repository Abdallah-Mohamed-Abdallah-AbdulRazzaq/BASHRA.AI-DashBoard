"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  CalendarSmallIcon, 
  StethoscopeOutlineIcon,
  AlertCircleOutlineIcon,
  CheckCircleSolidIcon,
  XCircleSolidIcon,
  FileTextOutlineIcon
} from "@/components/ui/icons/dashboard-icons";

// --- Custom AI Icon ---
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M3 5h4"/>
  </svg>
);

interface AiDiagnosisTabProps {
  t: any;
  patient: any;
}

export const AiDiagnosisTab = ({ t, patient }: AiDiagnosisTabProps) => {
  const diagnoses = patient.aiDiagnoses || [];

  if (diagnoses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="text-[#9DA4B0] mb-3"><SparklesIcon /></div>
        <p className="text-[14px] text-[#6C7688] font-medium">No AI diagnoses found for this patient.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {diagnoses.map((aiData: any) => {
        
        // 1. Confidence Score Logic (Convert decimal to percentage)
        const confidencePercentage = Math.round(aiData.confidenceScore * 100);
        const confidenceColor = confidencePercentage >= 90 ? "bg-[#27AE60]" : confidencePercentage >= 75 ? "bg-[#F2994A]" : "bg-[#EF1E1E]";

        // 2. Severity Logic
        let severityClass = "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]";
        if (aiData.severityAssessment === "mild") severityClass = "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20";
        if (aiData.severityAssessment === "moderate") severityClass = "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20";
        if (aiData.severityAssessment === "severe") severityClass = "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20";
        if (aiData.severityAssessment === "urgent") severityClass = "bg-[#7F1D1D] text-white border-[#7F1D1D]";

        // 3. Agreement Logic
        let agreementClass = "text-[#6C7688] bg-[#F5F6F8] border-[#E7E8EB]";
        let AgreementIcon = AlertCircleOutlineIcon;
        if (aiData.doctorAgreement === "agree") { agreementClass = "text-[#27AE60] bg-[#F0FDF4] border-[#27AE60]/20"; AgreementIcon = CheckCircleSolidIcon; }
        if (aiData.doctorAgreement === "partially_agree") { agreementClass = "text-[#F2994A] bg-[#FFF9F2] border-[#F2994A]/20"; AgreementIcon = AlertCircleOutlineIcon; }
        if (aiData.doctorAgreement === "disagree") { agreementClass = "text-[#EF1E1E] bg-[#FEF2F2] border-[#EF1E1E]/20"; AgreementIcon = XCircleSolidIcon; }

        return (
          <div key={aiData.id} className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm flex flex-col overflow-hidden">
            
            {/* --- Header (AI & Date) --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-[#E7E8EB] bg-[#FAFBFC] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2E37A4] to-[#4F46E5] text-white flex items-center justify-center shadow-md">
                  <SparklesIcon />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.clinic.ai_diagnosis_report}</h3>
                  <span className="text-[12px] text-[#6C7688] flex items-center gap-1.5 mt-0.5">
                    <CalendarSmallIcon /> {aiData.createdAt}
                  </span>
                </div>
              </div>
              
              {/* Doctor Review Badge */}
              <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border text-[12px] font-bold capitalize", 
                aiData.doctorReviewed ? agreementClass : "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]"
              )}>
                {aiData.doctorReviewed ? <AgreementIcon /> : <AlertCircleOutlineIcon />}
                {aiData.doctorReviewed ? t.clinic[aiData.doctorAgreement] || aiData.doctorAgreement : t.clinic.pending_review}
              </div>
            </div>

            {/* --- Main AI Content --- */}
            <div className="p-5 flex flex-col gap-6">
              
              {/* Primary Diagnosis & Confidence */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-5 bg-gradient-to-r from-[#F8F9FF] to-white border border-[#E0E2F4] rounded-[8px]">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-bold text-[#2E37A4] uppercase tracking-wider">{t.clinic.primary_diagnosis}</span>
                  <h4 className="text-[20px] font-bold text-[#0A1B39] leading-tight">
                    {aiData.translations.primaryDiagnosis || "No Primary Diagnosis"}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn("px-2.5 py-0.5 text-[11px] font-bold rounded-[4px] border uppercase tracking-wider", severityClass)}>
                      {t.clinic.severity}: {t.clinic[aiData.severityAssessment] || aiData.severityAssessment}
                    </span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="flex flex-col gap-2 w-full md:w-[200px] shrink-0 bg-white p-3 rounded-[8px] border border-[#E7E8EB] shadow-sm">
                  <div className="flex justify-between items-center text-[12px] font-bold">
                    <span className="text-[#0A1B39]">{t.clinic.confidence_score}</span>
                    <span className={cn(confidencePercentage >= 90 ? "text-[#27AE60]" : confidencePercentage >= 75 ? "text-[#F2994A]" : "text-[#EF1E1E]")}>
                      {confidencePercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F5F6F8] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", confidenceColor)} style={{ width: `${confidencePercentage}%` }}></div>
                  </div>
                </div>
              </div>

              {/* JSON Arrays (Secondary, Risk, Actions) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ListBlock title={t.clinic.secondary_diagnoses} items={aiData.secondaryDiagnoses} color="blue" />
                <ListBlock title={t.clinic.risk_factors} items={aiData.riskFactors} color="red" />
                <ListBlock title={t.clinic.recommended_actions} items={aiData.recommendedActions} color="green" />
              </div>

              {/* Tech Specs */}
              <div className="flex items-center gap-6 text-[12px] text-[#9DA4B0] font-medium border-t border-dashed border-[#E7E8EB] pt-4">
                <span>{t.clinic.model_version}: <span className="text-[#6C7688] font-mono">{aiData.aiModelVersion}</span></span>
                <span>{t.clinic.processing_time}: <span className="text-[#6C7688] font-mono">{aiData.processingTimeMs} ms</span></span>
                <span className="text-[10px] bg-[#F5F6F8] px-2 py-1 rounded">UUID: {aiData.uuid.split('-')[0]}...</span>
              </div>

            </div>

            {/* --- Doctor Review Section (Footer) --- */}
            {aiData.doctorReviewed && (
              <div className="bg-[#FAFBFC] border-t border-[#E7E8EB] p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#0A1B39]">
                  <StethoscopeOutlineIcon /> {t.clinic.doctor_review}
                </div>
                <div className="p-4 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#6C7688] leading-relaxed relative">
                  <div className={cn("absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-[4px] rounded-l-[8px] rtl:rounded-l-none rtl:rounded-r-[8px]", 
                    aiData.doctorAgreement === "agree" ? "bg-[#27AE60]" : aiData.doctorAgreement === "partially_agree" ? "bg-[#F2994A]" : "bg-[#EF1E1E]"
                  )}></div>
                  {aiData.translations.doctorNotes || "No additional notes provided by the doctor."}
                </div>
                <div className="flex justify-end text-[11px] font-medium text-[#9DA4B0] mt-1">
                  Reviewed by Doctor ID: {aiData.reviewedBy} on <span dir="ltr" className="mx-1">{aiData.reviewedAt}</span>
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};

// Helper component for JSON arrays rendering
const ListBlock = ({ title, items, color }: { title: string, items: string[], color: "blue"|"red"|"green" }) => {
  let bulletColor = "bg-[#2E37A4]";
  if(color === "red") bulletColor = "bg-[#EF1E1E]";
  if(color === "green") bulletColor = "bg-[#27AE60]";

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[13px] font-bold text-[#0A1B39] border-b border-[#E7E8EB] pb-1.5">{title}</span>
      {items && items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] text-[#6C7688] leading-snug">
              <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", bulletColor)}></span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-[12px] text-[#9DA4B0] italic">None reported</span>
      )}
    </div>
  );
};