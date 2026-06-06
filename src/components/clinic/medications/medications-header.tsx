"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminMedicationsService } from "@/lib/admin-medications";

interface MedicationsHeaderProps {
  t: any;
  totalMedications: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onApplyFilters: (filters: Record<string, string>) => void;
  onCreateClick: () => void;
}

const FORM_TYPES = [
  "tablet", "capsule", "syrup", "cream", "ointment", 
  "injection", "drops", "inhaler", "suppository", "sachet", "other"
];

export function MedicationsHeader({
  t,
  totalMedications,
  searchQuery,
  onSearchChange,
  onApplyFilters,
  onCreateClick,
}: MedicationsHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    form_type: "",
    is_active: "",
  });

  useEffect(() => {
    adminMedicationsService.getMedicationCategories()
      .then(res => setCategories(res))
      .catch(() => {});
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters = { category: "", form_type: "", is_active: "" };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1B39]">
            {t.sidebar?.medications || "Medications"}
          </h1>
          <p className="text-[14px] text-[#6C7688] mt-1">
            {totalMedications} {t.sidebar?.medications || "Medications"}
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E37A4] text-white rounded-lg hover:bg-[#1A227E] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[14px] font-semibold">{t.clinic?.create_medication || "Add Medication"}</span>
        </button>
      </div>

      <div className="flex items-center gap-3 w-full mt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
          <input
            type="text"
            placeholder={t.common?.search || "Search medications..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E8EB] rounded-lg text-[14px] text-[#0A1B39] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2E37A4] transition-colors"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg text-[14px] font-medium transition-colors",
              showFilters || activeFiltersCount > 0
                ? "border-[#2E37A4] text-[#2E37A4]"
                : "border-[#E7E8EB] text-[#6C7688] hover:border-[#A0AEC0]"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>{t.common?.filters || "Filters"}</span>
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-[#2E37A4] text-white text-[11px] rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
          </button>

          {showFilters && (
            <div className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border border-[#E7E8EB] z-20 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold text-[#0A1B39]">{t.common?.filters || "Filters"}</span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[12px] font-semibold text-[#2E37A4] hover:underline"
                  >
                    {t.common?.reset || "Reset"}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#0A1B39]">{t.clinic?.status || "Status"}</label>
                  <select
                    value={filters.is_active}
                    onChange={(e) => handleFilterChange("is_active", e.target.value)}
                    className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                  >
                    <option value="">{t.common?.all || "All"}</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#0A1B39]">{t.clinic?.category || "Category"}</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                    className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                  >
                    <option value="">{t.common?.all || "All"}</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#0A1B39]">{t.clinic?.dosage_form || "Form Type"}</label>
                  <select
                    value={filters.form_type}
                    onChange={(e) => handleFilterChange("form_type", e.target.value)}
                    className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4] capitalize"
                  >
                    <option value="">{t.common?.all || "All"}</option>
                    {FORM_TYPES.map((ft) => (
                      <option key={ft} value={ft} className="capitalize">{ft}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
