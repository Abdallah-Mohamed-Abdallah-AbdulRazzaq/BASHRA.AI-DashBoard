"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  getMedicalRecordStatistics, 
  getAdminMedicalRecords 
} from "@/lib/admin-medical-records";
import type { 
  MedicalRecordStatisticsData, 
  MedicalRecordListItem, 
  MedicalRecordListParams 
} from "@/types/admin-medical-records";
import { MedicalRecordsList } from "./medical-records-list";
import { MedicalRecordDetailsModal } from "./medical-record-details-modal";

interface MedicalRecordsViewProps {
  t: any;
}

export default function MedicalRecordsView({ t }: MedicalRecordsViewProps) {
  const [stats, setStats] = useState<MedicalRecordStatisticsData | null>(null);
  
  const [records, setRecords] = useState<MedicalRecordListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState<MedicalRecordListParams>({});

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordListItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getMedicalRecordStatistics({
        doctor_id: filters.doctor_id,
        from_date: filters.from_date,
        to_date: filters.to_date
      });
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch medical record statistics", err);
    }
  }, [filters.doctor_id, filters.from_date, filters.to_date]);

  const fetchRecords = useCallback(async (page: number, currentFilters: MedicalRecordListParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminMedicalRecords({ ...currentFilters, page, limit: 10 });
      if (res.success) {
        setRecords(res.data || []);
        setCurrentPage(res.page || 1);
        setTotalPages(res.pages || 1);
        setTotalItems(res.total || 0);
      }
    } catch (err: any) {
      setError(err?.message || t.clinic?.patients_load_error || "Failed to load medical records");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchRecords(currentPage, filters);
  }, [currentPage, filters, fetchRecords]);

  const handleFilterChange = (newFilters: Partial<MedicalRecordListParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleRetry = () => {
    fetchStats();
    fetchRecords(currentPage, filters);
  };

  const openDetails = (record: MedicalRecordListItem) => {
    setSelectedRecord(record);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-start gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[20px] font-bold text-[#0A1B39]">{t.clinic?.medical_records || "Medical Records"}</h1>
      </div>

      {stats && (
        <div className="flex flex-wrap gap-4 w-full">
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.all_appointments || "Total Records"}</span>
            <p className="text-[20px] font-bold text-[#0A1B39] mt-1">{stats.total || 0}</p>
          </div>
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.record_status_final || "Final"}</span>
            <p className="text-[20px] font-bold text-[#27AE60] mt-1">{stats.final || 0}</p>
          </div>
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.record_status_draft || "Draft"}</span>
            <p className="text-[20px] font-bold text-[#F2994A] mt-1">{stats.draft || 0}</p>
          </div>
          <div className="bg-white border border-[#E7E8EB] rounded-[10px] px-4 py-3 min-w-[140px] flex-1">
            <span className="text-[12px] text-[#6C7688] font-medium">{t.clinic?.follow_ups || "Follow Ups Recommended"}</span>
            <p className="text-[20px] font-bold text-[#2F80ED] mt-1">{stats.follow_ups_recommended || 0}</p>
          </div>
        </div>
      )}

      <div className="w-full bg-white rounded-[12px] border border-[#E7E8EB] p-4 flex flex-col gap-4">
        <div className="flex flex-wrap gap-4">
          <select 
            className="px-3 py-2 border rounded-[8px] text-[13px] outline-none border-[#E7E8EB]"
            value={filters.record_status || ""}
            onChange={(e) => handleFilterChange({ record_status: (e.target.value as any) || undefined })}
          >
            <option value="">{t.clinic?.all_statuses || "All Statuses"}</option>
            <option value="draft">{t.clinic?.record_status_draft || "Draft"}</option>
            <option value="final">{t.clinic?.record_status_final || "Final"}</option>
            <option value="amended">{t.clinic?.record_status_amended || "Amended"}</option>
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

        <MedicalRecordsList 
          t={t}
          records={records}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetails={openDetails}
        />
      </div>

      {isDetailsModalOpen && selectedRecord && (
        <MedicalRecordDetailsModal 
          t={t}
          recordId={selectedRecord.id!}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
