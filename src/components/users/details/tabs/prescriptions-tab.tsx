"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminPrescriptionsService } from "@/lib/admin-prescriptions";
import { Prescription } from "@/types/admin-prescriptions";
import { getApiErrorMessage } from "@/lib/error-utils";
import { PrescriptionsTable } from "@/components/clinic/prescriptions/prescriptions-table";
import { PrescriptionDetailsModal } from "@/components/clinic/prescriptions/prescription-details-modal";
import { useParams } from "next/navigation";

interface PrescriptionsTabProps {
  t: any;
  patient: any;
}

const DEFAULT_LIMIT = 10;

export const PrescriptionsTab = ({ t, patient }: PrescriptionsTabProps) => {
  const params = useParams();
  const lang = (params?.lang as string) || "en";

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchPrescriptions = useCallback(async () => {
    if (!patient?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await adminPrescriptionsService.getPrescriptions({
        patient_id: patient.id,
        page,
        limit: DEFAULT_LIMIT,
      });
      setPrescriptions(res.data || []);
      
      if (res.pagination) {
        setTotalPages(res.pagination?.total_pages || 0);
      } else {
        setTotalPages((res as any).pages || 1);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [patient?.id, page]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedId(prescription.id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-[#0A1B39]">
          {t.sidebar?.prescriptions || "Prescriptions"}
        </h3>
      </div>
      
      <PrescriptionsTable
        t={t}
        lang={lang}
        prescriptions={prescriptions}
        loading={loading}
        error={error}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onRetry={fetchPrescriptions}
        onViewDetails={handleViewDetails}
      />

      <PrescriptionDetailsModal
        t={t}
        lang={lang}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prescriptionId={selectedId}
      />
    </div>
  );
};
