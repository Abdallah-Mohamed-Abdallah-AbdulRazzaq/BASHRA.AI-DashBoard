"use client";

import React, { useState, useCallback } from "react";
import { getAdminUserAIUsage } from "@/lib/admin-ai-usage";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { AIUsageUserResponse } from "@/types/admin-ai-usage";
import Image from "next/image";
import { Search, User, CheckCircle, XCircle } from "lucide-react";

interface AIUserUsageTabProps {
  t: any;
  lang: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

function EventStatusBadge({ status, t }: { status?: string; t: any }) {
  const colorMap: Record<string, string> = {
    success: "text-[#27AE60] bg-[#E8F8EE]",
    failed: "text-[#EF1E1E] bg-[#FDE8E8]",
    blocked_limit: "text-[#F2994A] bg-[#FFF3E5]",
    blocked_safety: "text-[#EB5757] bg-[#FDEAEA]",
  };
  const cls = colorMap[status || ""] || "text-[#6C7688] bg-[#F5F6F8]";
  return (
    <span className={`px-2 py-1 rounded-[6px] text-[12px] font-medium ${cls}`}>
      {status || "—"}
    </span>
  );
}

export function AIUserUsageTab({ t, lang }: AIUserUsageTabProps) {
  const [userId, setUserId] = useState<string>("");
  const [data, setData] = useState<AIUsageUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    const id = parseInt(userId);
    if (!userId || isNaN(id) || id <= 0) {
      setError(t.ai_usage?.invalid_user_id || "Please enter a valid User ID.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    setSearched(true);
    try {
      const result = await getAdminUserAIUsage(id);
      setData(result);
    } catch (err) {
      setError(getApiErrorMessage(err, lang as "ar" | "en"));
    } finally {
      setLoading(false);
    }
  }, [userId, lang, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="bg-white p-4 rounded-[12px] border border-[#E7E8EB] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <h2 className="text-[16px] font-bold text-[#0A1B39] shrink-0">
          {t.ai_usage?.user_usage_detail || "User AI Usage Detail"}
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            min={1}
            placeholder={t.ai_usage?.enter_user_id || "Enter User ID..."}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10 px-3 border border-[#E7E8EB] rounded-[6px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] w-48"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[6px] hover:bg-[#252D88] disabled:opacity-50 h-10"
          >
            <Search className="w-4 h-4" />
            {loading ? (t.common?.loading || "Loading...") : (t.ai_usage?.search || "Search")}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#FDE8E8] border border-[#EF1E1E]/20 rounded-[12px] p-4">
          <span className="text-[14px] text-[#EF1E1E] font-medium">{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
          </div>
        </div>
      )}

      {/* Empty search */}
      {!loading && searched && !data && !error && (
        <div className="flex items-center justify-center min-h-[200px]">
          <span className="text-[14px] text-[#6C7688]">{t.ai_usage?.user_not_found || "User not found."}</span>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="flex flex-col gap-6">
          {/* User profile card */}
          <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-6 flex items-center gap-4">
            {data.user.profile_picture_url ? (
              <Image
                src={data.user.profile_picture_url}
                alt={data.user.full_name || 'User'}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border border-[#E7E8EB]"
                unoptimized
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#EEF0FF] flex items-center justify-center">
                <User className="w-7 h-7 text-[#2E37A4]" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-bold text-[#0A1B39]">{data.user.full_name || "—"}</h3>
              <p className="text-[13px] text-[#6C7688]">{data.user.email}</p>
              <p className="text-[13px] text-[#6C7688]">{data.user.phone}</p>
            </div>
            <div className="ml-auto flex flex-col items-end gap-2">
              <span className="text-[12px] text-[#6C7688]">ID: <span className="font-semibold text-[#0A1B39]">#{data.user.id}</span></span>
              {data.user.is_active ? (
                <span className="flex items-center gap-1 text-[12px] font-medium text-[#27AE60] bg-[#E8F8EE] px-2 py-1 rounded-[6px]">
                  <CheckCircle className="w-3 h-3" />
                  {t.ai_usage?.active || "Active"}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[12px] font-medium text-[#EF1E1E] bg-[#FDE8E8] px-2 py-1 rounded-[6px]">
                  <XCircle className="w-3 h-3" />
                  {t.ai_usage?.inactive || "Inactive"}
                </span>
              )}
              <span className="text-[12px] text-[#6C7688] capitalize">{data.user.status}</span>
            </div>
          </div>

          {/* Active Policies */}
          <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7E8EB]">
              <h3 className="text-[16px] font-bold text-[#0A1B39]">
                {t.ai_usage?.active_policies || "Active Policies"} ({data.active_policies?.length || 0})
              </h3>
            </div>
            {data.active_policies && data.active_policies.length > 0 ? (
              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F6F8] border-b border-[#E7E8EB]">
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.policy_name || "Policy Name"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.scope_type || "Scope"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.max_total_requests_per_month || "Req/Mo"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.max_chat_messages_per_month || "Chat/Mo"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.max_image_analyses_per_month || "Image/Mo"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.max_document_analyses_per_month || "Doc/Mo"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.priority || "Priority"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.active_policies.map((pol) => (
                      <tr key={pol.id} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB]">
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39] font-medium">{pol.policy_name}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39] capitalize">{pol.scope_type}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{pol.limits?.max_total_requests_per_month ?? "—"}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{pol.limits?.max_chat_messages_per_month ?? "—"}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{pol.limits?.max_image_analyses_per_month ?? "—"}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{pol.limits?.max_document_analyses_per_month ?? "—"}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{pol.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-[14px] text-[#6C7688]">
                {t.ai_usage?.no_active_policies || "No active policies for this user."}
              </div>
            )}
          </div>

          {/* Usage Counters */}
          <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7E8EB]">
              <h3 className="text-[16px] font-bold text-[#0A1B39]">
                {t.ai_usage?.usage_counters || "Usage Counters"} 
                <span className="text-[13px] font-normal text-[#6C7688] ml-2">
                  ({t.ai_usage?.latest_24 || "Latest 24 periods"})
                </span>
              </h3>
            </div>
            {data.counters && data.counters.length > 0 ? (
              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F6F8] border-b border-[#E7E8EB]">
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.period_key || "Period"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.total_requests || "Total Req"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.chat || "Chat"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.image || "Image"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.document_analyses || "Documents"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.tokens_used || "Tokens"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.last_request || "Last Request"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.counters.map((ctr, idx) => (
                      <tr key={ctr.id ?? idx} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB]">
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39] font-medium">{ctr.period_key || "—"}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{ctr.total_requests ?? 0}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{ctr.chat_messages_count ?? 0}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{ctr.image_analyses_count ?? 0}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{ctr.document_analyses_count ?? 0}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{ctr.tokens_used ?? 0}</td>
                        <td className="px-6 py-3 text-[13px] text-[#6C7688]">{formatDate(ctr.last_request_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-[14px] text-[#6C7688]">
                {t.ai_usage?.no_usage_data || "No usage counters found for this user."}
              </div>
            )}
          </div>

          {/* Recent Events */}
          <div className="bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E7E8EB]">
              <h3 className="text-[16px] font-bold text-[#0A1B39]">
                {t.ai_usage?.recent_events || "Recent Events"}
                <span className="text-[13px] font-normal text-[#6C7688] ml-2">
                  ({t.ai_usage?.latest_50 || "Latest 50"})
                </span>
              </h3>
            </div>
            {data.recent_events && data.recent_events.length > 0 ? (
              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F5F6F8] border-b border-[#E7E8EB]">
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">#</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.event_type || "Event Type"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.status || "Status"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.tokens_used || "Tokens"}</th>
                      <th className="px-6 py-3 text-[13px] font-semibold text-[#0A1B39]">{t.ai_usage?.date || "Date"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_events.map((ev, idx) => (
                      <tr key={ev.id ?? idx} className="border-b border-[#E7E8EB] hover:bg-[#F9FAFB]">
                        <td className="px-6 py-3 text-[13px] text-[#6C7688]">{ev.id ?? idx + 1}</td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39] capitalize">{ev.event_type || "—"}</td>
                        <td className="px-6 py-3">
                          <EventStatusBadge status={ev.status} t={t} />
                        </td>
                        <td className="px-6 py-3 text-[14px] text-[#0A1B39]">{ev.tokens_used ?? "—"}</td>
                        <td className="px-6 py-3 text-[13px] text-[#6C7688]">{formatDate(ev.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-[14px] text-[#6C7688]">
                {t.ai_usage?.no_recent_events || "No recent events found for this user."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
