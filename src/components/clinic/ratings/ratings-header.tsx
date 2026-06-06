"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingsHeaderProps {
  t: any;
  totalRatings: number;
  onApplyFilters: (filters: Record<string, string>) => void;
  onRefresh: () => void;
}

const STATUS_OPTIONS = ["active", "hidden", "removed"];

export function RatingsHeader({
  t,
  totalRatings,
  onApplyFilters,
  onRefresh,
}: RatingsHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    patient_id: "",
    doctor_id: "",
    min_rating: "",
    max_rating: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters = { status: "", patient_id: "", doctor_id: "", min_rating: "", max_rating: "" };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1B39]">
            {t.sidebar?.ratings || "Ratings & Reviews"}
          </h1>
          <p className="text-[14px] text-[#6C7688] mt-1">
            {totalRatings} {t.sidebar?.ratings || "Ratings & Reviews"}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E8EB] text-[#0A1B39] rounded-lg hover:bg-[#F5F6F8] transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-[14px] font-semibold">{t.common?.refresh || "Refresh"}</span>
        </button>
      </div>

      <div className="flex items-center gap-3 w-full mt-2">
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
            <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.08)] border border-[#E7E8EB] z-20 p-4">
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
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4] capitalize"
                  >
                    <option value="">{t.common?.all || "All"}</option>
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="capitalize">{st}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#0A1B39]">Min Rating</label>
                    <select
                      value={filters.min_rating}
                      onChange={(e) => handleFilterChange("min_rating", e.target.value)}
                      className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5].map((st) => <option key={st} value={st}>{st} Stars</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#0A1B39]">Max Rating</label>
                    <select
                      value={filters.max_rating}
                      onChange={(e) => handleFilterChange("max_rating", e.target.value)}
                      className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5].map((st) => <option key={st} value={st}>{st} Stars</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#0A1B39]">Doctor ID</label>
                  <input
                    type="number"
                    value={filters.doctor_id}
                    onChange={(e) => handleFilterChange("doctor_id", e.target.value)}
                    placeholder="Enter Doctor ID"
                    className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#0A1B39]">Patient ID</label>
                  <input
                    type="number"
                    value={filters.patient_id}
                    onChange={(e) => handleFilterChange("patient_id", e.target.value)}
                    placeholder="Enter Patient ID"
                    className="w-full px-3 py-2 text-[14px] border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
