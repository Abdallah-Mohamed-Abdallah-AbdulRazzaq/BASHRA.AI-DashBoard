"use client";

import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { 
  CrownIcon, 
  CalendarSmallIcon, 
  CheckCircleSolidIcon, 
  XCircleSolidIcon 
} from "@/components/ui/icons/dashboard-icons";
import { getAdminDoctorSubscriptions } from "@/lib/admin-doctor-subscriptions";
import { AdminDoctorSubscription } from "@/types/admin-doctor-subscriptions";
import { getApiErrorMessage } from "@/lib/error-utils";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface SubscriptionsTabProps {
  t: any;
  doctor: any;
}

export const SubscriptionsTab = ({ t, doctor }: SubscriptionsTabProps) => {
  const [subscriptions, setSubscriptions] = useState<AdminDoctorSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    if (!doctor?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAdminDoctorSubscriptions({ doctor_id: doctor.id });
      if (res.success && res.data) {
        setSubscriptions(res.data);
      } else {
        setError(res.message || "Failed to load subscriptions");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [doctor?.id]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-[#6C7688]">
        <RefreshCw className="animate-spin mb-2" size={24} />
        <p>{t.common?.loading || "Loading subscriptions..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-[#EF1E1E]">
        <AlertTriangle className="mb-2" size={24} />
        <p className="mb-4">{error}</p>
        <button 
          onClick={fetchSubscriptions}
          className="px-4 py-2 bg-[#F9FAFB] border border-[#E7E8EB] text-[#0A1B39] rounded-[8px] text-[13px] font-semibold hover:bg-[#F3F4F6] transition-colors"
        >
          {t.common?.retry || "Retry"}
        </button>
      </div>
    );
  }

  const currentSubscription = subscriptions.find(s => s.subscription_status === 'active' || s.subscription_status === 'pending');
  const history = subscriptions.filter(s => s.id !== currentSubscription?.id);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ----------------------------------------------------------- */}
      {/* 1. Current Active Subscription Card */}
      {/* ----------------------------------------------------------- */}
      {currentSubscription ? (
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Plan Details */}
          <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F0F2FA] border-b md:border-b-0 md:border-r border-[#E7E8EB] p-6 md:w-[35%] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2E37A4] text-white flex items-center justify-center shadow-md">
                  <CrownIcon />
                </div>
                {/* Status Badge */}
                <span className={cn(
                  "px-3 py-1 text-[11px] font-bold rounded-[6px] border flex items-center gap-1.5 shadow-sm",
                  currentSubscription.subscription_status === 'active' ? "bg-[#F0FDF4] text-[#27AE60] border-[#27AE60]/20" : 
                  currentSubscription.subscription_status === 'pending' ? "bg-[#FFF9F2] text-[#F2994A] border-[#F2994A]/20" : ""
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", currentSubscription.subscription_status === 'active' ? "bg-[#27AE60]" : "bg-[#F2994A]")}></span>
                  {currentSubscription.subscription_status === 'active' ? t.clinic?.active || "Active" : t.clinic?.pending || "Pending"}
                </span>
              </div>
              
              <h3 className="text-[20px] font-bold text-[#0A1B39] mb-1">{currentSubscription.package?.name_en || currentSubscription.package?.name_ar || `Package #${currentSubscription.package_id}`}</h3>
              <p className="text-[13px] text-[#6C7688] mb-5">{currentSubscription.package?.secondary_name_en || currentSubscription.package?.secondary_name_ar || ""}</p>

              {currentSubscription.package && (
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[28px] font-bold text-[#2E37A4]">{currentSubscription.package.price} {currentSubscription.package.currency_code}</span>
                  <span className="text-[13px] font-medium text-[#6C7688]">/ {currentSubscription.package.duration_days} Days</span>
                </div>
              )}

              <div className="flex flex-col gap-3 text-[13px] text-[#0A1B39] font-medium mb-6">
                <div className="flex items-center gap-2">
                  <CalendarSmallIcon />
                  <span className="text-[#6C7688] w-[80px]">{t.clinic?.start_date || "Start Date"}:</span> 
                  <span dir="ltr">{currentSubscription.start_date ? new Date(currentSubscription.start_date).toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarSmallIcon />
                  <span className="text-[#6C7688] w-[80px]">{t.clinic?.end_date || "End Date"}:</span> 
                  <span dir="ltr">{currentSubscription.end_date ? new Date(currentSubscription.end_date).toLocaleDateString() : "—"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <span className="text-[12px] text-[#6C7688]">
                * Actions to upgrade/cancel are managed through the main Subscriptions view.
              </span>
            </div>
          </div>

          {/* Right Side: Package Features from `package_features` */}
          <div className="p-6 md:w-[65%] flex flex-col">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-5">{t.clinic?.plan_features || "Plan Features"}</h3>
            
            {currentSubscription.package?.features ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {currentSubscription.package.features.map((featureRel: any, idx: number) => {
                  const featInfo = featureRel.feature || {};
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {featureRel.is_included ? <CheckCircleSolidIcon /> : <XCircleSolidIcon />}
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-[14px] font-semibold",
                          featureRel.is_included ? "text-[#0A1B39]" : "text-[#9DA4B0] line-through decoration-[#9DA4B0]/50"
                        )}>
                          {featInfo.name_en || featInfo.name_ar || `Feature #${featureRel.feature_id}`}
                        </span>
                        {featureRel.is_included && featureRel.feature_value && (
                          <span className="text-[12px] text-[#6C7688] mt-0.5">
                            {featureRel.feature_value} {featInfo.unit_en || featInfo.unit_ar || ""}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-[#6C7688]">No features defined for this package.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] p-6 text-center shadow-sm">
          <CrownIcon />
          <h3 className="text-[16px] font-bold text-[#0A1B39] mt-3">No Active Subscription</h3>
          <p className="text-[13px] text-[#6C7688] mt-1">This doctor does not have an active or pending subscription.</p>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 2. Subscription History Table */}
      {/* ----------------------------------------------------------- */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm flex flex-col overflow-hidden mt-2">
        <div className="p-5 border-b border-[#E7E8EB]">
          <h3 className="text-[16px] font-bold text-[#0A1B39]">{t.clinic?.subscription_history || "Subscription History"}</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[800px] text-start">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic?.package_name || "Package Name"}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic?.start_date || "Start Date"}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic?.end_date || "End Date"}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic?.price || "Price"}</th>
                <th className="py-4 px-5 text-start text-[13px] font-semibold text-[#6C7688]">{t.clinic?.status || "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5">
                    <span className="text-[14px] font-bold text-[#0A1B39]">{record.package?.name_en || record.package?.name_ar || `Package #${record.package_id}`}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[13px] text-[#6C7688]" dir="ltr">{record.start_date ? new Date(record.start_date).toLocaleDateString() : "—"}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[13px] text-[#6C7688]" dir="ltr">{record.end_date ? new Date(record.end_date).toLocaleDateString() : "—"}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[13px] font-bold text-[#0A1B39]">{record.package?.price || "—"} {record.package?.currency_code || ""}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={cn(
                      "px-3 py-1 rounded-[6px] text-[11px] font-bold border inline-block",
                      record.subscription_status === 'expired' ? "bg-[#FEF2F2] text-[#EF1E1E] border-[#EF1E1E]/20" : 
                      record.subscription_status === 'canceled' ? "bg-[#F5F6F8] text-[#6C7688] border-[#E7E8EB]" : "bg-[#F9FAFB] text-[#0A1B39]"
                    )}>
                      {record.subscription_status.charAt(0).toUpperCase() + record.subscription_status.slice(1)}
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
