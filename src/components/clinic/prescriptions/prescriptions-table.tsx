"use client";

import React from "react";
import { Prescription } from "@/types/admin-prescriptions";
import { Eye, AlertCircle } from "lucide-react";

interface PrescriptionsTableProps {
  t: any;
  lang: string;
  prescriptions: Prescription[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onViewDetails: (prescription: Prescription) => void;
}

export function PrescriptionsTable({
  t,
  lang,
  prescriptions,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onRetry,
  onViewDetails,
}: PrescriptionsTableProps) {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl border border-[#E7E8EB] overflow-hidden">
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex h-16 items-center px-6 border-b border-[#E7E8EB]">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-red-100 min-h-[300px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-[#0A1B39] mb-2">{t.clinic?.error_loading || "Error loading prescriptions"}</h3>
        <p className="text-[#6C7688] mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-[#2E37A4] text-white rounded-lg hover:bg-[#1A227E] transition-colors"
        >
          {t.common?.retry || "Retry"}
        </button>
      </div>
    );
  }

  if (!prescriptions.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-[#E7E8EB] min-h-[300px]">
        <div className="w-16 h-16 bg-[#F5F6F8] rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#A0AEC0]" />
        </div>
        <h3 className="text-lg font-bold text-[#0A1B39] mb-2">{t.clinic?.no_prescriptions_found || "No prescriptions found"}</h3>
        <p className="text-[#6C7688] text-center max-w-md">
          {t.clinic?.no_prescriptions_desc || "No prescriptions match your filter criteria."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full bg-white rounded-xl border border-[#E7E8EB] overflow-x-auto">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#F5F6F8] border-b border-[#E7E8EB] text-[#6C7688] font-medium">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">ID</th>
              <th className="px-6 py-4 whitespace-nowrap">{t.clinic?.medication_name || "Medication"}</th>
              <th className="px-6 py-4 whitespace-nowrap">{t.sidebar?.patient_name || "Patient"}</th>
              <th className="px-6 py-4 whitespace-nowrap">{t.sidebar?.doctor_name || "Doctor"}</th>
              <th className="px-6 py-4 whitespace-nowrap">{t.clinic?.status || "Status"}</th>
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">{t.common?.actions || "Actions"}</th>
            </tr>
          </thead>
          <tbody className="text-[#0A1B39]">
            {prescriptions.map((px) => (
              <tr key={px.id} className="border-b border-[#E7E8EB] hover:bg-[#FAFAFA] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  #{px.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {px.medication_name || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {px.patient?.full_name || px.patient_id || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {px.doctor?.full_name || px.doctor_id || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {px.status || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {px.created_at ? new Date(px.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(px)}
                      className="p-2 text-[#6C7688] hover:text-[#2E37A4] hover:bg-[#F5F6F8] rounded-lg transition-colors"
                      title={t.common?.view || "View Details"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-[13px] text-[#6C7688]">
            {t.common?.page || "Page"} {currentPage} {t.common?.of || "of"} {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-[13px] font-medium text-[#0A1B39] bg-white border border-[#E7E8EB] rounded-lg hover:bg-[#F5F6F8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.common?.previous || "Previous"}
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 text-[13px] font-medium text-[#0A1B39] bg-white border border-[#E7E8EB] rounded-lg hover:bg-[#F5F6F8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.common?.next || "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
