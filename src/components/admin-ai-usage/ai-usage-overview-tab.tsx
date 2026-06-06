"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAdminAIOverview } from "@/lib/admin-ai-usage";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { AIUsageOverview } from "@/types/admin-ai-usage";
import {
  StatRevenueIcon,
  StatPatientIcon,
  StatDoctorIcon,
  ChartRevenue
} from "@/components/ui/icons/dashboard-icons";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Cpu, CheckCircle, XCircle } from "lucide-react";

interface AIUsageOverviewTabProps {
  t: any;
  lang: string;
}

export function AIUsageOverviewTab({ t, lang }: AIUsageOverviewTabProps) {
  const [data, setData] = useState<AIUsageOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodKey, setPeriodKey] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const fetchData = useCallback(async (period: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminAIOverview(period);
      setData(result);
    } catch (err) {
      setError(getApiErrorMessage(err, lang as "ar" | "en"));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchData(periodKey);
  }, [periodKey, fetchData]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodKey(e.target.value);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[14px] text-[#EF1E1E] font-medium">{error}</span>
          <button
            onClick={() => fetchData(periodKey)}
            className="px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88]"
          >
            {t.ai_usage?.retry || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const c = data?.counters;
  const totalRequests = c?.total_requests || 0;
  const tokensUsed = c?.tokens_used || 0;
  const activeUsers = c?.active_users || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-[12px] border border-[#E7E8EB]">
        <h2 className="text-[16px] font-bold text-[#0A1B39]">{t.ai_usage?.usage_overview || "Usage Overview"}</h2>
        <div className="flex items-center gap-2">
          <label className="text-[13px] text-[#6C7688]">{t.ai_usage?.period_key || "Period Key"}:</label>
          <input
            type="month"
            value={periodKey}
            onChange={handlePeriodChange}
            className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <StatsCard
          title={t.ai_usage?.total_requests || "Total Requests"}
          value={totalRequests.toString()}
          badgeValue={tokensUsed.toString()}
          badgeText={t.ai_usage?.tokens_used || "Tokens Used"}
          badgeColor="bg-[#27AE60]"
          icon={<Cpu className="w-5 h-5 text-white" />}
          iconBgColor="bg-[#2E37A4]"
          chart={<ChartRevenue />}
        />
        <StatsCard
          title={t.ai_usage?.active_users || "Active Users"}
          value={activeUsers.toString()}
          badgeValue={""}
          badgeText=""
          badgeColor="bg-transparent"
          icon={<StatPatientIcon />}
          iconBgColor="bg-[#2F80ED]"
          chart={<ChartRevenue />}
        />
        <StatsCard
          title={t.ai_usage?.chat || "Chat"}
          value={(c?.chat_messages_count || 0).toString()}
          badgeValue={(c?.image_analyses_count || 0).toString()}
          badgeText={t.ai_usage?.image || "Image"}
          badgeColor="bg-[#F2994A]"
          icon={<StatRevenueIcon />}
          iconBgColor="bg-[#27AE60]"
          chart={<ChartRevenue />}
        />
      </div>

      <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E7E8EB]">
          <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.ai_usage?.provider || "Provider Summary"}</h3>
        </div>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F6F8] border-b border-[#E7E8EB]">
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.provider || "Provider"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.model || "Model"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.request_type || "Request Type"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.status || "Status"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.total_requests || "Requests"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.tokens_used || "Tokens"}</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#0A1B39] whitespace-nowrap">{t.ai_usage?.latency || "Latency"}</th>
              </tr>
            </thead>
            <tbody>
              {data?.provider_summary && data.provider_summary.length > 0 ? (
                data.provider_summary.map((p, idx) => (
                  <tr key={idx} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.provider || "—"}</td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.model || "—"}</td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.request_type || "—"}</td>
                    <td className="px-6 py-4">
                      {p.status === "success" ? (
                        <span className="flex items-center gap-1 text-[13px] font-medium text-[#27AE60] bg-[#E8F8EE] px-2 py-1 rounded-[6px] w-fit">
                          <CheckCircle className="w-3 h-3" />
                          {t.ai_usage?.success || p.status}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[13px] font-medium text-[#EF1E1E] bg-[#FDE8E8] px-2 py-1 rounded-[6px] w-fit">
                          <XCircle className="w-3 h-3" />
                          {t.ai_usage?.failed || p.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.requests_count || 0}</td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.total_tokens || 0}</td>
                    <td className="px-6 py-4 text-[14px] text-[#0A1B39]">{p.avg_latency_ms ? `${p.avg_latency_ms} ms` : "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[14px] text-[#6C7688]">
                    {t.ai_usage?.no_ai_usage_found || "No provider summary available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
