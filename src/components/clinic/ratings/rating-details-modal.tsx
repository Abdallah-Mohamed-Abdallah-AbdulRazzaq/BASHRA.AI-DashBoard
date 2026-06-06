"use client";

import React, { useEffect, useState } from "react";
import { Rating } from "@/types/admin-ratings";
import { adminRatingsService } from "@/lib/admin-ratings";
import { X, Loader2, Star, User, Stethoscope, Clock, Flag, CheckCircle, MessageSquare } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-utils";

interface RatingDetailsModalProps {
  t: any;
  lang: string;
  isOpen: boolean;
  onClose: () => void;
  ratingId: number | null;
}

export function RatingDetailsModal({ t, lang, isOpen, onClose, ratingId }: RatingDetailsModalProps) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && ratingId) {
      fetchDetails(ratingId);
    } else {
      setRating(null);
    }
  }, [isOpen, ratingId]);

  const fetchDetails = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminRatingsService.getRatingById(id);
      setRating(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "en"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#E7E8EB]">
          <h2 className="text-xl font-bold text-[#0A1B39]">
            Rating Details #{ratingId}
          </h2>
          <button onClick={onClose} className="p-2 text-[#6C7688] hover:bg-[#F5F6F8] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#2E37A4] animate-spin mb-4" />
              <p className="text-[#6C7688]">Loading details...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          ) : rating ? (
            <div className="space-y-6">
              
              <div className="flex items-center gap-4 justify-between bg-[#F5F6F8] p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#0A1B39]">{rating.rating} / 5</h3>
                    <p className="text-[13px] text-[#6C7688]">Overall Rating</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-[13px]">
                  <div className="flex items-center gap-1">
                    <span className="text-[#6C7688]">Status:</span>
                    <span className="font-semibold text-[#0A1B39] capitalize">{rating.status || "—"}</span>
                  </div>
                  {rating.would_recommend ? (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" /> Recommended
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[#6C7688] font-medium">
                      Not recommended
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAFAFA] border border-[#E7E8EB] p-4 rounded-xl flex items-start gap-3">
                  <User className="w-5 h-5 text-[#2E37A4] mt-0.5" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#6C7688] uppercase tracking-wider mb-1">
                      {t.sidebar?.patient_name || "Patient"}
                    </p>
                    <p className="text-[14px] font-medium text-[#0A1B39]">
                      {rating.is_anonymous ? (rating.patient?.display_name || "Anonymous") : (rating.patient?.full_name || `ID: ${rating.patient_id}`)}
                    </p>
                    {rating.is_anonymous && (
                      <span className="text-[12px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded mt-1 inline-block">Anonymous</span>
                    )}
                  </div>
                </div>
                <div className="bg-[#FAFAFA] border border-[#E7E8EB] p-4 rounded-xl flex items-start gap-3">
                  <Stethoscope className="w-5 h-5 text-[#2E37A4] mt-0.5" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#6C7688] uppercase tracking-wider mb-1">
                      {t.sidebar?.doctor_name || "Doctor"}
                    </p>
                    <p className="text-[14px] font-medium text-[#0A1B39]">
                      {rating.doctor?.full_name || `ID: ${rating.doctor_id}`}
                    </p>
                  </div>
                </div>
              </div>

              {(rating.translations?.en?.review_title || rating.translations?.ar?.review_title) && (
                <div className="border border-[#E7E8EB] rounded-xl overflow-hidden">
                  <div className="bg-[#FAFAFA] px-4 py-3 border-b border-[#E7E8EB] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#6C7688]" />
                    <h3 className="font-semibold text-[#0A1B39]">Review Content</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {rating.translations.en?.review_title && (
                      <div>
                        <p className="text-[12px] font-semibold text-[#6C7688] mb-1">English (EN)</p>
                        <div className="bg-[#F5F6F8] p-3 rounded-lg">
                          <h4 className="font-bold text-[#0A1B39] mb-1">{rating.translations.en.review_title}</h4>
                          <p className="text-[14px] text-[#0A1B39] whitespace-pre-wrap">
                            {rating.translations.en.review_comment}
                          </p>
                        </div>
                      </div>
                    )}
                    {rating.translations.ar?.review_title && (
                      <div dir="rtl">
                        <p className="text-[12px] font-semibold text-[#6C7688] mb-1">Arabic (AR)</p>
                        <div className="bg-[#F5F6F8] p-3 rounded-lg">
                          <h4 className="font-bold text-[#0A1B39] mb-1">{rating.translations.ar.review_title}</h4>
                          <p className="text-[14px] text-[#0A1B39] whitespace-pre-wrap">
                            {rating.translations.ar.review_comment}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(rating.translations?.en?.doctor_response || rating.translations?.ar?.doctor_response) && (
                <div className="border border-green-200 rounded-xl overflow-hidden bg-green-50">
                  <div className="px-4 py-3 border-b border-green-200 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-green-700" />
                    <h3 className="font-semibold text-green-900">Doctor Response</h3>
                    <span className="text-[11px] text-green-700 ml-auto bg-green-200 px-2 py-0.5 rounded-full">
                      {rating.doctor_responded_at ? new Date(rating.doctor_responded_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    {rating.translations.en?.doctor_response && (
                      <div>
                        <p className="text-[14px] text-green-900 whitespace-pre-wrap">
                          {rating.translations.en.doctor_response}
                        </p>
                      </div>
                    )}
                    {rating.translations.ar?.doctor_response && (
                      <div dir="rtl">
                        <p className="text-[14px] text-green-900 whitespace-pre-wrap mt-2 pt-2 border-t border-green-200">
                          {rating.translations.ar.doctor_response}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {rating.is_flagged && (
                <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50">
                  <div className="px-4 py-3 border-b border-red-200 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-red-600" />
                    <h3 className="font-semibold text-red-900">Flagged by Admin</h3>
                    <span className="text-[11px] text-red-700 ml-auto bg-red-200 px-2 py-0.5 rounded-full">
                      {rating.flagged_at ? new Date(rating.flagged_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] text-red-800">
                      <span className="font-semibold">Reason:</span>{" "}
                      {rating.translations?.en?.flagged_reason || rating.translations?.ar?.flagged_reason || "No reason provided."}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-[12px] text-[#6C7688]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Created At: {rating.created_at ? new Date(rating.created_at).toLocaleString() : "—"}</span>
                </div>
                {rating.updated_at && (
                  <div className="flex items-center gap-1 border-l pl-4 border-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>Updated At: {new Date(rating.updated_at).toLocaleString()}</span>
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>

        <div className="p-6 border-t border-[#E7E8EB] flex items-center justify-end bg-[#F5F6F8]">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-[#0A1B39] bg-white border border-[#E7E8EB] hover:bg-[#F5F6F8] rounded-lg transition-colors"
          >
            {t.common?.close || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
