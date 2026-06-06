"use client";

import React, { useState, useEffect } from "react";
import { getAdminUserAIUsage } from "@/lib/admin-ai-usage";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { AIUsageUserResponse } from "@/types/admin-ai-usage";

interface AiDiagnosisTabProps {
  t: any;
  patient: any;
}

export const AiDiagnosisTab = ({ t, patient }: AiDiagnosisTabProps) => {
  const [data, setData] = useState<AIUsageUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patient?.id) {
      setLoading(false);
      return;
    }
    
    getAdminUserAIUsage(patient.id)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(getApiErrorMessage(err, "en")); // Defaulting to en for error, or pass lang prop
        setLoading(false);
      });
  }, [patient?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <span className="text-[14px] font-medium text-[#EF1E1E]">{error}</span>
      </div>
    );
  }

  if (!data || (!data.active_policies?.length && !data.counters?.length && !data.recent_events?.length)) {
    return (
      <div className="flex items-center justify-center min-h-[300px] bg-white border border-[#E7E8EB] rounded-[12px]">
        <span className="text-[14px] font-medium text-[#6C7688]">
          {t.ai_usage?.no_ai_usage_found || "No AI usage found for this patient."}
        </span>
      </div>
    );
  }

  const counters = data.counters?.[0] || {};
  const tokensUsed = counters.tokens_used || 0;
  const requests = counters.total_requests || 0;
  const periodType = counters.period_type || "monthly";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 flex flex-col gap-1 shadow-sm">
          <span className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.total_requests || "Total Requests"} ({periodType})</span>
          <span className="text-[20px] font-bold text-[#0A1B39]">{requests}</span>
        </div>
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-5 flex flex-col gap-1 shadow-sm">
          <span className="text-[13px] text-[#6C7688] font-medium">{t.ai_usage?.tokens_used || "Tokens Used"} ({periodType})</span>
          <span className="text-[20px] font-bold text-[#27AE60]">{tokensUsed}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7E8EB]">
          <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.ai_usage?.recent_events || "Recent Events"}</h3>
        </div>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F6F8] border-b border-[#E7E8EB]">
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.request_type || "Event Type"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.status || "Status"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.tokens_used || "Tokens"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.clinic?.date || "Date"}</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_events && data.recent_events.length > 0 ? (
                data.recent_events.map((event, idx) => (
                  <tr key={event.id || idx} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{event.event_type || "—"}</td>
                    <td className="px-6 py-4 text-[14px]">
                      {event.status === "success" ? (
                        <span className="text-[#27AE60] bg-[#E8F8EE] px-2 py-1 rounded-[6px] text-[12px] font-medium">
                          {t.ai_usage?.success || "Success"}
                        </span>
                      ) : (
                        <span className="text-[#EF1E1E] bg-[#FDE8E8] px-2 py-1 rounded-[6px] text-[12px] font-medium">
                          {t.ai_usage?.failed || event.status || "Failed"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{event.tokens_used || 0}</td>
                    <td className="px-6 py-4 text-[14px] text-[#6C7688]">
                      {event.created_at ? new Date(event.created_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[14px] text-[#6C7688]">
                    {t.ai_usage?.no_ai_sessions_found || "No recent events found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
