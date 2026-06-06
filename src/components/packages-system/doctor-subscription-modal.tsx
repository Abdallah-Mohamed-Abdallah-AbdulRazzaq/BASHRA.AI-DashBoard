"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { updateAdminDoctorSubscription } from "@/lib/admin-doctor-subscriptions";
import { AdminDoctorSubscription, DoctorSubscriptionStatus } from "@/types/admin-doctor-subscriptions";
import { getApiErrorMessage } from "@/lib/error-utils";
import { RefreshCw, ChevronDown } from "lucide-react";

interface DoctorSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  t: any;
  editData: AdminDoctorSubscription | null;
}

export const DoctorSubscriptionModal = ({ isOpen, onClose, onSuccess, t, editData }: DoctorSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    subscription_status: "active" as DoctorSubscriptionStatus,
    is_trial: false,
    start_date: "",
    end_date: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editData) {
      setFormData({
        subscription_status: editData.subscription_status || "active",
        is_trial: editData.is_trial ? true : false,
        start_date: editData.start_date ? editData.start_date.split('T')[0] : "",
        end_date: editData.end_date ? editData.end_date.split('T')[0] : ""
      });
    }
    setError(null);
  }, [editData, isOpen]);

  if (!isOpen || !editData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      subscription_status: formData.subscription_status,
      is_trial: formData.is_trial,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined
    };

    try {
      const res = await updateAdminDoctorSubscription(editData.id, payload);

      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || t.common?.error_occurred || "Operation failed");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={!isSubmitting ? onClose : undefined} />
      
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar z-10 relative flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E8EB] bg-[#FAFBFC] sticky top-0 z-20 flex justify-between items-center">
          <h3 className="text-[18px] font-bold text-[#0A1B39]">{t.packages?.edit_subscription || "Edit Subscription"} #{editData.id}</h3>
          <button onClick={onClose} disabled={isSubmitting} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E7E8EB] text-[#6C7688] hover:text-[#EF1E1E] hover:border-[#EF1E1E] transition-all disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {error && (
            <div className="p-3 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[13px] rounded-[8px]">
              {error}
            </div>
          )}

          {/* Read Only Info */}
          <div className="flex flex-col gap-2 p-3 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] mb-2">
            <div className="text-[12px] text-[#6C7688] flex justify-between">
              <span>{t.packages?.doctor || "Doctor"}: <strong className="text-[#0A1B39]">{editData.doctor?.name_en || editData.doctor?.name_ar || editData.doctor_id}</strong></span>
            </div>
            <div className="text-[12px] text-[#6C7688] flex justify-between">
              <span>{t.packages?.package || "Package"}: <strong className="text-[#0A1B39]">{editData.package?.name_en || editData.package?.name_ar || editData.package_id}</strong></span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.status || "Status"}</label>
            <div className="relative">
              <select required disabled={isSubmitting} value={formData.subscription_status} onChange={e => setFormData({...formData, subscription_status: e.target.value as DoctorSubscriptionStatus})} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] appearance-none focus:outline-none focus:border-[#2E37A4] transition-colors cursor-pointer disabled:bg-[#F5F6F8]">
                <option value="active">{t.packages?.status_active || "Active"}</option>
                <option value="pending">{t.packages?.status_pending || "Pending"}</option>
                <option value="expired">{t.packages?.status_expired || "Expired"}</option>
                <option value="canceled">{t.packages?.status_canceled || "Canceled"}</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0] pointer-events-none" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.start_date || "Start Date"}</label>
              <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.end_date || "End Date"}</label>
              <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} disabled={isSubmitting} className="w-full h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors disabled:bg-gray-100" />
            </div>
          </div>

          {/* Trial Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#F5F6F8] rounded-[8px] border border-[#E7E8EB] mt-2">
            <span className="text-[13px] font-semibold text-[#0A1B39]">{t.packages?.is_trial || "Is Trial?"}</span>
            <label className="relative inline-flex items-center cursor-pointer ml-auto rtl:mr-auto rtl:ml-0">
              <input type="checkbox" className="sr-only peer" checked={formData.is_trial} onChange={(e) => setFormData({...formData, is_trial: e.target.checked})} disabled={isSubmitting} />
              <div className="w-11 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
              <span className={cn("ml-3 rtl:mr-3 rtl:ml-0 text-[13px] font-bold", formData.is_trial ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                {formData.is_trial ? (t.common?.yes || "Yes") : (t.common?.no || "No")}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-5 border-t border-[#E7E8EB]">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 bg-[#F5F6F8] text-[#6C7688] text-[13px] font-medium rounded-[8px] hover:bg-[#E7E8EB] transition-colors border border-[#E7E8EB] disabled:opacity-50">
              {t.common?.close || "Close"}
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#2E37A4] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : null}
              {t.packages?.save_changes || "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
