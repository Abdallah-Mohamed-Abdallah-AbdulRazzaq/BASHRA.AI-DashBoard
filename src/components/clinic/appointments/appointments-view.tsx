"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  getAppointmentStatistics, 
  getAdminAppointments, 
  cancelAdminAppointment 
} from "@/lib/admin-appointments";
import type { 
  AppointmentStatisticsData, 
  AppointmentListItem, 
  AppointmentListParams 
} from "@/types/admin-appointments";
import { AppointmentsList } from "./appointments-list";
import { AppointmentDetailsModal } from "./appointment-details-modal";
import { CancelAppointmentModal } from "./cancel-appointment-modal";

interface AppointmentsViewProps {
  t: any;
}

export default function AppointmentsView({ t }: AppointmentsViewProps) {
  const [stats, setStats] = useState<AppointmentStatisticsData | null>(null);
  
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState<AppointmentListParams>({});

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentListItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getAppointmentStatistics({
        doctor_id: filters.doctor_id,
        from_date: filters.from_date,
        to_date: filters.to_date
      });
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch appointment statistics", err);
    }
  }, [filters.doctor_id, filters.from_date, filters.to_date]);

  const fetchAppointments = useCallback(async (page: number, currentFilters: AppointmentListParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAppointments({ ...currentFilters, page, limit: 10 });
      if (res.success) {
        setAppointments(res.data || []);
        setCurrentPage(res.page || 1);
        setTotalPages(res.pages || 1);
        setTotalItems(res.total || 0);
      }
    } catch (err: any) {
      setError(err?.message || t.clinic?.patients_load_error || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchAppointments(currentPage, filters);
  }, [currentPage, filters, fetchAppointments]);

  const handleFilterChange = (newFilters: Partial<AppointmentListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleRetry = () => {
    fetchStats();
    fetchAppointments(currentPage, filters);
  };

  const openDetails = (appt: AppointmentListItem) => {
    setSelectedAppointment(appt);
    setIsDetailsModalOpen(true);
  };

  const openCancel = (appt: AppointmentListItem) => {
    setSelectedAppointment(appt);
    setIsCancelModalOpen(true);
  };

  return (
    <div className="flex flex-col items-start gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[20px] font-bold text-[#0A1B39]">{t.clinic?.appointments || "Appointments"}</h1>
      </div>

      {stats && (
        <div className="flex flex-wrap gap-4 w-full">
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.all_appointments || "Total Appointments"}</span>
            <p className="text-[20px] font-bold text-[#0A1B39] mt-1">{stats.total || 0}</p>
          </div>
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.status_confirmed || "Confirmed"}</span>
            <p className="text-[20px] font-bold text-[#27AE60] mt-1">{stats.confirmed || 0}</p>
          </div>
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.status_pending || "Pending"}</span>
            <p className="text-[20px] font-bold text-[#F2994A] mt-1">{stats.pending || 0}</p>
          </div>
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.status_cancelled || "Cancelled"}</span>
            <p className="text-[20px] font-bold text-[#EB5757] mt-1">{stats.cancelled || 0}</p>
          </div>
        </div>
      )}

      <div className="w-full bg-white rounded-[12px] border border-[#E7E8EB] p-4 flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <select 
            className="px-3 py-2 border rounded-[8px] text-[13px] outline-none border-[#E7E8EB]"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange({ status: (e.target.value as any) || undefined })}
          >
            <option value="">{t.clinic?.all_statuses || "All Statuses"}</option>
            <option value="pending">{t.clinic?.status_pending || "Pending"}</option>
            <option value="confirmed">{t.clinic?.status_confirmed || "Confirmed"}</option>
            <option value="in_progress">{t.clinic?.status_in_progress || "In Progress"}</option>
            <option value="completed">{t.clinic?.status_completed || "Completed"}</option>
            <option value="cancelled">{t.clinic?.status_cancelled || "Cancelled"}</option>
            <option value="no_show">{t.clinic?.status_no_show || "No Show"}</option>
            <option value="rescheduled">{t.clinic?.status_rescheduled || "Rescheduled"}</option>
          </select>

          <select 
            className="px-3 py-2 border rounded-[8px] text-[13px] outline-none border-[#E7E8EB]"
            value={filters.appointment_type || ""}
            onChange={(e) => handleFilterChange({ appointment_type: (e.target.value as any) || undefined })}
          >
            <option value="">{t.clinic?.appointment_type || "Appointment Type"}</option>
            <option value="consultation">{t.clinic?.type_consultation || "Consultation"}</option>
            <option value="follow_up">{t.clinic?.type_follow_up || "Follow Up"}</option>
            <option value="urgent">{t.clinic?.type_urgent || "Urgent"}</option>
            <option value="routine">{t.clinic?.type_routine || "Routine"}</option>
          </select>

          <input 
            type="number" 
            placeholder={t.clinic?.doctor_id || "Doctor ID"}
            className="px-3 py-2 border rounded-[8px] text-[13px] outline-none border-[#E7E8EB]"
            value={filters.doctor_id || ""}
            onChange={(e) => handleFilterChange({ doctor_id: e.target.value ? Number(e.target.value) : undefined })}
          />

          <input 
            type="number" 
            placeholder={t.clinic?.patient_id || "Patient ID"}
            className="px-3 py-2 border rounded-[8px] text-[13px] outline-none border-[#E7E8EB]"
            value={filters.patient_id || ""}
            onChange={(e) => handleFilterChange({ patient_id: e.target.value ? Number(e.target.value) : undefined })}
          />

          <input 
            type="date" 
            className="px-3 py-2 border rounded-[8px] text-[13px] outline-none border-[#E7E8EB]"
            value={filters.from_date || ""}
            onChange={(e) => handleFilterChange({ from_date: e.target.value || undefined })}
          />
          <input 
            type="date" 
            className="px-3 py-2 border rounded-[8px] text-[13px] outline-none border-[#E7E8EB]"
            value={filters.to_date || ""}
            onChange={(e) => handleFilterChange({ to_date: e.target.value || undefined })}
          />
        </div>

        <AppointmentsList 
          t={t}
          appointments={appointments}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetails={openDetails}
          onCancel={openCancel}
        />
      </div>

      {isDetailsModalOpen && selectedAppointment && (
        <AppointmentDetailsModal 
          t={t}
          appointmentId={selectedAppointment.id!}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {isCancelModalOpen && selectedAppointment && (
        <CancelAppointmentModal 
          t={t}
          appointmentId={selectedAppointment.id!}
          onClose={() => setIsCancelModalOpen(false)}
          onSuccess={handleRetry}
        />
      )}
    </div>
  );
}
