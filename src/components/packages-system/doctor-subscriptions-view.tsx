"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DoctorSubscriptionModal } from "./doctor-subscription-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  SearchIcon, 
  MoreVerticalIcon,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { 
  getAdminDoctorSubscriptions, 
  approveAdminDoctorSubscription, 
  expireAdminDoctorSubscription, 
  deleteAdminDoctorSubscription 
} from "@/lib/admin-doctor-subscriptions";
import { AdminDoctorSubscription, DoctorSubscriptionStatus } from "@/types/admin-doctor-subscriptions";
import { getApiErrorMessage } from "@/lib/error-utils";

interface DoctorSubscriptionsViewProps {
  t: any;
}

export default function DoctorSubscriptionsView({ t }: DoctorSubscriptionsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<AdminDoctorSubscription | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [subscriptions, setSubscriptions] = useState<AdminDoctorSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<AdminDoctorSubscription | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = statusFilter !== "all" ? { status: statusFilter } : undefined;
      const res = await getAdminDoctorSubscriptions(params);
      if (res.success && res.data) {
        setSubscriptions(res.data);
      } else {
        setError(res.message || t.common?.error_occurred || "Failed to fetch subscriptions");
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, t.common?.error_occurred]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleEdit = (sub: AdminDoctorSubscription) => {
    setEditingData(sub);
    setIsModalOpen(true);
  };

  const confirmDelete = (sub: AdminDoctorSubscription) => {
    setSubToDelete(sub);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!subToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteAdminDoctorSubscription(subToDelete.id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        fetchSubscriptions();
      } else {
        setDeleteError(res.message || "Failed to delete subscription");
      }
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApprove = async (sub: AdminDoctorSubscription) => {
    if (!confirm(t.packages?.confirm_approve_subscription || "Are you sure you want to approve this subscription?")) return;
    
    try {
      const res = await approveAdminDoctorSubscription(sub.id);
      if (res.success) {
        fetchSubscriptions();
      } else {
        alert(res.message || "Failed to approve subscription");
      }
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  const handleExpire = async (sub: AdminDoctorSubscription) => {
    const reason = prompt(t.packages?.expire_reason_prompt || "Please enter a reason for expiring this subscription:");
    if (reason === null) return; // User cancelled
    
    try {
      const res = await expireAdminDoctorSubscription(sub.id, { reason });
      if (res.success) {
        fetchSubscriptions();
      } else {
        alert(res.message || "Failed to expire subscription");
      }
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };

  // Currently we only have client-side search for doctors by ID or Name if available in the relation
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    // Assuming backend returns doctor and package relations
    return (
      sub.id.toString().includes(term) ||
      sub.doctor_id.toString().includes(term) ||
      (sub.doctor?.name_en && sub.doctor.name_en.toLowerCase().includes(term)) ||
      (sub.doctor?.name_ar && sub.doctor.name_ar.includes(term)) ||
      (sub.package?.name_en && sub.package.name_en.toLowerCase().includes(term)) ||
      (sub.package?.name_ar && sub.package.name_ar.includes(term))
    );
  });

  const getStatusBadge = (status: DoctorSubscriptionStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-[#F0FDF4] text-[#27AE60] border border-[#27AE60]/20 rounded-[6px] text-[11px] font-bold flex items-center gap-1.5 w-fit"><CheckCircle size={12}/> {t.packages?.status_active || "Active"}</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-[#FFF9F2] text-[#F2994A] border border-[#F2994A]/20 rounded-[6px] text-[11px] font-bold flex items-center gap-1.5 w-fit"><Clock size={12}/> {t.packages?.status_pending || "Pending"}</span>;
      case 'expired':
        return <span className="px-3 py-1 bg-[#FEF2F2] text-[#EF1E1E] border border-[#EF1E1E]/20 rounded-[6px] text-[11px] font-bold flex items-center gap-1.5 w-fit"><XCircle size={12}/> {t.packages?.status_expired || "Expired"}</span>;
      case 'canceled':
        return <span className="px-3 py-1 bg-[#F5F6F8] text-[#6C7688] border border-[#E7E8EB] rounded-[6px] text-[11px] font-bold flex items-center gap-1.5 w-fit"><XCircle size={12}/> {t.packages?.status_canceled || "Canceled"}</span>;
      default:
        return <span className="px-3 py-1 bg-[#F5F6F8] text-[#6C7688] border border-[#E7E8EB] rounded-[6px] text-[11px] font-bold flex items-center gap-1.5 w-fit">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0">
            <Stethoscope size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1B39] leading-tight">{t.packages?.doctor_subscriptions_title || "Doctor Subscriptions"}</h2>
            <span className="text-[12px] font-medium text-[#6C7688]">Total: {subscriptions.length} records</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] transition-colors cursor-pointer w-full sm:w-auto"
          >
            <option value="all">{t.packages?.all_statuses || "All Statuses"}</option>
            <option value="active">{t.packages?.status_active || "Active"}</option>
            <option value="pending">{t.packages?.status_pending || "Pending"}</option>
            <option value="expired">{t.packages?.status_expired || "Expired"}</option>
            <option value="canceled">{t.packages?.status_canceled || "Canceled"}</option>
          </select>

          <div className="relative w-full sm:w-[280px]">
            <input 
              type="text" 
              placeholder={t.packages?.search_subscriptions || "Search subscriptions..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]">
               <SearchIcon size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#6C7688]">
              <RefreshCw className="animate-spin mb-2" size={24} />
              <p>{t.common?.loading || "Loading..."}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-[#EF1E1E]">
              <AlertTriangle className="mb-2" size={24} />
              <p className="mb-4">{error}</p>
              <button 
                onClick={fetchSubscriptions}
                className="px-4 py-2 bg-[#F9FAFB] border border-[#E7E8EB] text-[#0A1B39] rounded-[8px] text-[13px] font-semibold hover:bg-[#F3F4F6] transition-colors"
              >
                {t.common?.retry || "Retry"}
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-[#FAFBFC]">
                <tr className="border-b border-[#E7E8EB]">
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.packages?.sub_id_doctor || "ID & Doctor"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.packages?.package_info || "Package Info"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.packages?.dates || "Dates"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.packages?.status || "Status"}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.packages?.type || "Type"}</th>
                  <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                    
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-bold text-[#2E37A4]">#{sub.id}</span>
                        <span className="text-[14px] font-bold text-[#0A1B39]">{sub.doctor?.name_en || sub.doctor?.name_ar || `Doctor ID: ${sub.doctor_id}`}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-bold text-[#0A1B39]">{sub.package?.name_en || sub.package?.name_ar || `Package ID: ${sub.package_id}`}</span>
                        {sub.package && <span className="text-[12px] text-[#6C7688]" dir="ltr">{sub.package.price} {sub.package.currency_code} / {sub.package.duration_days} Days</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[#6C7688] w-[40px] uppercase">START</span>
                          <span className="text-[13px] text-[#0A1B39] font-medium" dir="ltr">{sub.start_date ? new Date(sub.start_date).toLocaleDateString() : "—"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[#6C7688] w-[40px] uppercase">END</span>
                          <span className="text-[13px] text-[#0A1B39] font-medium" dir="ltr">{sub.end_date ? new Date(sub.end_date).toLocaleDateString() : "—"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(sub.subscription_status)}
                    </td>

                    <td className="py-4 px-6">
                      {sub.is_trial ? (
                        <span className="px-2 py-0.5 bg-[#F5F6F8] text-[#0A1B39] border border-[#E7E8EB] rounded text-[11px] font-semibold">{t.packages?.trial || "Trial"}</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#E0E2F4]/30 text-[#2E37A4] border border-[#2E37A4]/20 rounded text-[11px] font-semibold">{t.packages?.paid || "Paid"}</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-end">
                      <CustomDropdown 
                        trigger={
                          <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                            <MoreVerticalIcon size={16} />
                          </button>
                        }
                        items={[
                          ...(sub.subscription_status === 'pending' ? [{ label: t.packages?.approve || "Approve", onClick: () => handleApprove(sub), className: "text-[#27AE60] hover:text-[#27AE60] hover:bg-[#F0FDF4]" }] : []),
                          { label: t.common?.edit || "Edit", onClick: () => handleEdit(sub) },
                          ...(sub.subscription_status === 'active' || sub.subscription_status === 'pending' ? [{ label: t.packages?.expire || "Expire", onClick: () => handleExpire(sub), className: "text-[#F2994A] hover:text-[#F2994A] hover:bg-[#FFF9F2]" }] : []),
                          { label: t.common?.delete || "Delete", onClick: () => confirmDelete(sub), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                        ]}
                        width="w-32"
                        align="end"
                      />
                    </td>

                  </tr>
                ))}
                
                {filteredSubscriptions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">
                      {t.packages?.no_subscriptions_found || "No subscriptions found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. Modal for Update */}
      {isModalOpen && (
        <DoctorSubscriptionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchSubscriptions();
          }}
          t={t} 
          editData={editingData} 
        />
      )}

      {/* 4. Delete Confirmation Modal */}
      {isDeleteModalOpen && subToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[400px] p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF1E1E] mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-[18px] font-bold text-[#0A1B39] mb-2">{t.packages?.delete_subscription || "Delete Subscription"}</h3>
            <p className="text-[14px] text-[#6C7688] mb-6 leading-relaxed">
              {t.packages?.delete_subscription_confirm || "Are you sure you want to permanently delete this subscription?"}
              <br/><br/>
              <strong>Subscription #{subToDelete.id} - {subToDelete.doctor?.name_en || subToDelete.doctor?.name_ar || `Doctor ID ${subToDelete.doctor_id}`}</strong>
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#EF1E1E]/20 text-[#EF1E1E] text-[13px] rounded-[8px]">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-white border border-[#E7E8EB] text-[#0A1B39] font-bold rounded-[8px] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
              >
                {t.common?.cancel || "Cancel"}
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-[#EF1E1E] text-white font-bold rounded-[8px] hover:bg-[#DC1414] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="animate-spin" size={16} /> : null}
                {t.common?.delete || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
