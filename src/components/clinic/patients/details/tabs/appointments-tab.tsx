"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAdminAppointments, cancelAdminAppointment } from "@/lib/admin-appointments";
import type { AppointmentListItem } from "@/types/admin-appointments";
import { AppointmentsList } from "@/components/clinic/appointments/appointments-list";
import { AppointmentDetailsModal } from "@/components/clinic/appointments/appointment-details-modal";
import { CancelAppointmentModal } from "@/components/clinic/appointments/cancel-appointment-modal";

interface AppointmentsTabProps {
  t: any;
  patient: any;
}

export const AppointmentsTab = ({ t, patient }: AppointmentsTabProps) => {
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentListItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchAppointments = useCallback(async (page: number) => {
    if (!patient?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAppointments({ patient_id: patient.id, page, limit: 10 });
      if (res.success) {
        setAppointments(res.data || []);
        setCurrentPage(res.page || 1);
        setTotalPages(res.pages || 1);
      }
    } catch (err: any) {
      setError(err?.message || t.clinic?.patients_load_error || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [t, patient?.id]);

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage, fetchAppointments]);

  const handleRetry = () => fetchAppointments(currentPage);

  const openDetails = (appt: AppointmentListItem) => {
    setSelectedAppointment(appt);
    setIsDetailsModalOpen(true);
  };

  const openCancel = (appt: AppointmentListItem) => {
    setSelectedAppointment(appt);
    setIsCancelModalOpen(true);
  };

  if (!patient?.id) {
    return <div className="p-4 text-center text-[#6C7688]">No patient ID found.</div>;
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-[12px] border border-[#E7E8EB] p-4">
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
};
