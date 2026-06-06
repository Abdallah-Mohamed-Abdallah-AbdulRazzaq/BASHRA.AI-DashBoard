"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Medication } from "@/types/admin-medications";
import { adminMedicationsService } from "@/lib/admin-medications";
import { getApiErrorMessage } from "@/lib/error-utils";
import { MedicationsHeader } from "./medications-header";
import { MedicationsTable } from "./medications-table";
import { MedicationModal } from "./medication-modal";
import { MedicationDeleteDialog } from "./medication-delete-dialog";

interface MedicationsViewProps {
  t: any;
  lang: string;
}

const DEFAULT_LIMIT = 20;

export default function MedicationsView({ t, lang }: MedicationsViewProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchMedications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reqParams: Record<string, string | number | boolean | undefined> = {
        page: pagination.page,
        limit: DEFAULT_LIMIT,
      };

      if (debouncedSearch) reqParams.search = debouncedSearch;
      if (filters.is_active) reqParams.is_active = filters.is_active;
      if (filters.category) reqParams.category = filters.category;
      if (filters.form_type) reqParams.form_type = filters.form_type;

      const res = await adminMedicationsService.getMedications(reqParams);
      setMedications(res.data || []);
      
      if (res.pagination) {
        setPagination((prev) => ({
          ...prev,
          page: res.pagination?.current_page || 1,
          total: res.pagination?.total_items || 0,
          totalPages: res.pagination?.total_pages || 0,
        }));
      } else {
        // Fallback if pagination is missing from res
        setPagination((prev) => ({
          ...prev,
          total: (res as any).total || res.data?.length || 0,
          totalPages: (res as any).pages || 1,
        }));
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
      setMedications([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, debouncedSearch, filters]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleApplyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCreate = () => {
    setSelectedMedication(null);
    setIsModalOpen(true);
  };

  const handleEdit = (med: Medication) => {
    setSelectedMedication(med);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (med: Medication) => {
    setSelectedMedication(med);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatus = async (med: Medication) => {
    try {
      await adminMedicationsService.toggleMedicationStatus(med.id);
      fetchMedications();
    } catch (err) {
      alert(getApiErrorMessage(err, "en"));
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setIsDeleteDialogOpen(false);
    fetchMedications();
  };

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">
      <MedicationsHeader
        t={t}
        totalMedications={pagination.total}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onApplyFilters={handleApplyFilters}
        onCreateClick={handleCreate}
      />

      <MedicationsTable
        t={t}
        lang={lang}
        medications={medications}
        loading={loading}
        error={error}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onRetry={fetchMedications}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      <MedicationModal
        t={t}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        medication={selectedMedication}
      />

      <MedicationDeleteDialog
        t={t}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={handleModalSuccess}
        medication={selectedMedication}
      />
    </div>
  );
}
