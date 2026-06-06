"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Rating } from "@/types/admin-ratings";
import { adminRatingsService } from "@/lib/admin-ratings";
import { getApiErrorMessage } from "@/lib/error-utils";
import { RatingsHeader } from "./ratings-header";
import { RatingsTable } from "./ratings-table";
import { RatingDetailsModal } from "./rating-details-modal";
import { RatingModerationModal } from "./rating-moderation-modal";

interface RatingsViewProps {
  t: any;
  lang: string;
}

const DEFAULT_LIMIT = 20;

export default function RatingsView({ t, lang }: RatingsViewProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reqParams: Record<string, string | number | boolean | undefined> = {
        page: pagination.page,
        limit: DEFAULT_LIMIT,
        ...filters,
      };

      const res = await adminRatingsService.getRatings(reqParams);
      setRatings(res.data || []);
      
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
      setRatings([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleApplyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (rating: Rating) => {
    setSelectedRating(rating);
    setIsDetailsModalOpen(true);
  };

  const handleModerate = (rating: Rating) => {
    setSelectedRating(rating);
    setIsModerationModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsDetailsModalOpen(false);
    setIsModerationModalOpen(false);
    fetchRatings();
  };

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">
      <RatingsHeader
        t={t}
        totalRatings={pagination.total}
        onApplyFilters={handleApplyFilters}
        onRefresh={fetchRatings}
      />

      <RatingsTable
        t={t}
        lang={lang}
        ratings={ratings}
        loading={loading}
        error={error}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onRetry={fetchRatings}
        onViewDetails={handleViewDetails}
        onModerate={handleModerate}
      />

      <RatingDetailsModal
        t={t}
        lang={lang}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        ratingId={selectedRating?.id || null}
      />

      <RatingModerationModal
        t={t}
        isOpen={isModerationModalOpen}
        onClose={() => setIsModerationModalOpen(false)}
        onSuccess={handleModalSuccess}
        rating={selectedRating}
      />
    </div>
  );
}
