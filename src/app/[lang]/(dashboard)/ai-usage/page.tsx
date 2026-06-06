"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDictionary } from "@/components/shared/dictionary-provider";
import { cn } from "@/lib/utils";
import { AIUsageOverviewTab } from "@/components/admin-ai-usage/ai-usage-overview-tab";
import { AIPoliciesTab } from "@/components/admin-ai-usage/ai-policies-tab";

export default function AIUsagePage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { dictionary } = useDictionary();
  const t = dictionary;

  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: t.ai_usage?.usage_overview || "Usage Overview" },
    { id: "policies", label: t.ai_usage?.ai_policies || "AI Policies" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold text-[#0A1B39]">{t.ai_usage?.ai_management || "AI Management"}</h1>
        <p className="text-[14px] text-[#6C7688]">{t.ai_usage?.ai_usage_details || "View AI usage statistics and manage policies."}</p>
      </div>

      <div className="w-full border-b border-[#E7E8EB] flex items-center gap-6 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
               "pb-3 text-[14px] font-bold whitespace-nowrap border-b-2 transition-all",
               activeTab === tab.id 
                 ? "border-[#2E37A4] text-[#2E37A4]" 
                 : "border-transparent text-[#6C7688] hover:text-[#0A1B39]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full mt-2">
        {activeTab === "overview" && <AIUsageOverviewTab t={t} lang={lang} />}
        {activeTab === "policies" && <AIPoliciesTab t={t} lang={lang} />}
      </div>
    </div>
  );
}
