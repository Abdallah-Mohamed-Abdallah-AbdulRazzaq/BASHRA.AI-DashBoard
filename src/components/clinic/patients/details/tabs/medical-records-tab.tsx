"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getPatientMedicalHistory } from "@/lib/admin-medical-records";
import type { MedicalRecordListItem } from "@/types/admin-medical-records";
import { MedicalRecordsList } from "@/components/clinic/medical-records/medical-records-list";
import { MedicalRecordDetailsModal } from "@/components/clinic/medical-records/medical-record-details-modal";

interface MedicalRecordsTabProps {
  t: any;
  patient: any;
}

export const MedicalRecordsTab = ({ t, patient }: MedicalRecordsTabProps) => {
  const [records, setRecords] = useState<MedicalRecordListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordListItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchRecords = useCallback(async () => {
    if (!patient?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getPatientMedicalHistory(patient.id);
      if (res.success) {
        setRecords(res.data || []);
      }
    } catch (err: any) {
      setError(err?.message || t.clinic?.patients_load_error || "Failed to load medical records");
    } finally {
      setLoading(false);
    }
  }, [t, patient?.id]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleRetry = () => fetchRecords();

  const openDetails = (record: MedicalRecordListItem) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  if (!patient?.id) {
    return <div className="p-4 text-center text-[#6C7688]">No patient ID found.</div>;
  }

  return (
    <div className="flex flex-col w-full bg-white rounded-[12px] border border-[#E7E8EB] p-4">
      <MedicalRecordsList 
        t={t}
        records={records}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        onViewDetails={openDetails}
      />

      {isDetailsModalOpen && selectedRecord && (
        <MedicalRecordDetailsModal 
          t={t}
          recordId={selectedRecord.id!}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
};
