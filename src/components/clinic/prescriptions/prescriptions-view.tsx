"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Prescription } from "@/types/admin-prescriptions";
import { adminPrescriptionsService } from "@/lib/admin-prescriptions";
import { getApiErrorMessage } from "@/lib/error-utils";
import { PrescriptionsHeader } from "./prescriptions-header";
import { PrescriptionsTable } from "./prescriptions-table";
import { PrescriptionDetailsModal } from "./prescription-details-modal";

interface PrescriptionsViewProps {
  t: any;
  lang: string;
}

const DEFAULT_LIMIT = 20;

export default function PrescriptionsView({ t, lang }: PrescriptionsViewProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reqParams: Record<string, string | number | boolean | undefined> = {
        page: pagination.page,
        limit: DEFAULT_LIMIT,
        ...filters,
      };

      const res = await adminPrescriptionsService.getPrescriptions(reqParams);
      setPrescriptions(res.data || []);
      
      if (res.pagination) {
        setPagination((prev) => ({
          ...prev,
          page: res.pagination?.current_page || 1,
          total: res.pagination?.total_items || 0,
          totalPages: res.pagination?.total_pages || 0,
        }));
      } else {
        setPagination((prev) => ({
          ...prev,
          total: (res as any).total || res.data?.length || 0,
          totalPages: (res as any).pages || 1,
        }));
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleApplyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedId(prescription.id);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">
      <PrescriptionsHeader
        t={t}
        totalPrescriptions={pagination.total}
        onApplyFilters={handleApplyFilters}
        onRefresh={fetchPrescriptions}
      />

      <PrescriptionsTable
        t={t}
        lang={lang}
        prescriptions={prescriptions}
        loading={loading}
        error={error}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
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
}
