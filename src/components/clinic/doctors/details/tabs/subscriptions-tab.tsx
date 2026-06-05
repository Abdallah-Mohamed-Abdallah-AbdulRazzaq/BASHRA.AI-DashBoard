"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  CrownIcon, 
  CalendarSmallIcon, 
  CheckCircleSolidIcon, 
  XCircleSolidIcon 
} from "@/components/ui/icons/dashboard-icons";

interface SubscriptionsTabProps {
  t: any;
  doctor: any;
}

export const SubscriptionsTab = ({ t, doctor }: SubscriptionsTabProps) => {
  const { currentSubscription, history } = doctor.subscriptions;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ----------------------------------------------------------- */}
      {/* 1. Current Active Subscription Card */}
      {/* ----------------------------------------------------------- */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Plan Details (Highlighted Background) */}
        <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F0F2FA] border-b md:border-b-0 md:border-r border-[#E7E8EB] p-6 md:w-[35%] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2E37A4] text-white flex items-center justify-center shadow-md">
                <CrownIcon />
              </div>
              {/* Status Badge */}
              <span className={cn(
                "px-3 py-1 text-[11px] font-bold rounded-[6px] border flex items-center gap-1.5 shadow-sm",
                currentSubscription.status === 'active' ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : 
                currentSubscription.status === 'trial' ? "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20" : ""
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", currentSubscription.status === 'active' ? "bg-[#27AE60]" : "bg-[#F2994A]")}></span>
                {currentSubscription.status === 'active' ? t.clinic.active : t.clinic.trial}
              </span>
            </div>
            
            <h3 className="text-[20px] font-bold text-[#0A1B39] mb-1">{currentSubscription.packageName}</h3>
            <p className="text-[13px] text-[#6C7688] mb-5">{currentSubscription.secondaryName}</p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-[28px] font-bold text-[#2E37A4]">{currentSubscription.price}</span>
              <span className="text-[13px] font-medium text-[#6C7688]">/ {currentSubscription.durationDays} Days</span>
            </div>

            <div className="flex flex-col gap-3 text-[13px] text-[#0A1B39] font-medium mb-6">
              <div className="flex items-center gap-2">
                <CalendarSmallIcon />
                <span className="text-[#6C7688] w-[80px]">{t.clinic.start_date}:</span> 
                <span dir="ltr">{currentSubscription.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarSmallIcon />
                <span className="text-[#6C7688] w-[80px]">{t.clinic.end_date}:</span> 
                <span dir="ltr">{currentSubscription.endDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button className="w-full py-2.5 bg-[#2E37A4] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm">
              {t.clinic.upgrade_plan}
            </button>
            <button className="w-full py-2.5 bg-white text-[#EF1E1E] border border-[#E7E8EB] text-[13px] font-semibold rounded-[8px] hover:bg-[#FEF2F2] transition-colors">
              {t.clinic.cancel_subscription}
            </button>
          </div>
        </div>

        {/* Right Side: Package Features from `package_features` */}
        <div className="p-6 md:w-[65%] flex flex-col">
          <h3 className="text-[16px] font-bold text-[#0A1B39] mb-5">{t.clinic.plan_features}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            {currentSubscription.features.map((feature: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {feature.isIncluded ? <CheckCircleSolidIcon /> : <XCircleSolidIcon />}
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[14px] font-semibold",
                    feature.isIncluded ? "text-[#0A1B39]" : "text-[#9DA4B0] line-through decoration-[#9DA4B0]/50"
                  )}>
                    {feature.name}
                  </span>
                  {feature.isIncluded && feature.value && (
                    <span className="text-[12px] text-[#6C7688] mt-0.5">
                      {feature.value} {feature.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. Subscription History Table */}
      {/* ----------------------------------------------------------- */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm flex flex-col overflow-hidden mt-2">
        <div className="p-5 border-b border-[#E7E8EB]">
          <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.clinic.subscription_history}</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-start">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic.package_name}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic.start_date}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic.end_date}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic.price}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic.status}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record: any, idx: number) => (
                <tr key={idx} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5">
                    <span className="text-[14px] font-bold text-[#0A1B39]">{record.packageName}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[13px] text-[#6C7688]" dir="ltr">{record.startDate}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[13px] text-[#6C7688]" dir="ltr">{record.endDate}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[13px] font-bold text-[#0A1B39]">{record.price}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={cn(
                      "px-3 py-1 rounded-[6px] text-[11px] font-bold border inline-block",
                      record.status === 'expired' ? "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20" : 
                      record.status === 'canceled' ? "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]" : ""
                    )}>
                      {record.status === 'expired' ? t.clinic.expired : t.clinic.canceled}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[13px] text-[#9DA4B0]">No subscription history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};