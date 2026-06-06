"use client";

import React, { useState, useEffect } from "react";
import { Rating } from "@/types/admin-ratings";
import { adminRatingsService } from "@/lib/admin-ratings";
import { getApiErrorMessage } from "@/lib/error-utils";
import { X, Loader2, Flag } from "lucide-react";

interface RatingModerationModalProps {
  t: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rating: Rating | null;
}

export function RatingModerationModal({ t, isOpen, onClose, onSuccess, rating }: RatingModerationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<"active" | "hidden" | "removed">("active");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen && rating) {
      setStatus(rating.status as any || "active");
      setReason("");
      setError(null);
    }
  }, [isOpen, rating]);

  if (!isOpen || !rating) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (status !== rating.status) {
        await adminRatingsService.updateRatingStatus(rating.id, { status });
      }

      if (reason.trim()) {
        await adminRatingsService.flagRating(rating.id, {
          language_code: "en", // default for admin internal reason
          reason: reason.trim(),
        });
      }

      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E8EB]">
          <h2 className="text-xl font-bold text-[#0A1B39] flex items-center gap-2">
            <Flag className="w-5 h-5 text-[#2E37A4]" />
            Moderate Rating #{rating.id}
          </h2>
          <button onClick={onClose} className="p-2 text-[#6C7688] hover:bg-[#F5F6F8] rounded-full transition-colors" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <form id="moderation-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0A1B39]">{t.clinic?.status || "Status"} *</label>
              <select
                required
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4] capitalize"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
                <option value="removed">Removed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0A1B39]">
                Flag Reason <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter a reason if you want to flag this rating..."
                className="w-full px-4 py-2 border border-[#E7E8EB] rounded-lg focus:outline-none focus:border-[#2E37A4] resize-none h-24"
              />
            </div>
            
            <p className="text-[12px] text-[#6C7688]">
              Flagging a rating or changing its status to hidden/removed will immediately update doctor statistics.
            </p>
          </form>
        </div>

        <div className="p-6 border-t border-[#E7E8EB] flex items-center justify-end gap-3 bg-[#F5F6F8]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 text-sm font-semibold text-[#6C7688] hover:text-[#0A1B39] transition-colors"
          >
            {t.common?.cancel || "Cancel"}
          </button>
          <button
            type="submit"
            form="moderation-form"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#2E37A4] hover:bg-[#1A227E] rounded-lg transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t.common?.save || "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
