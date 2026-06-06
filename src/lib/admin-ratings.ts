import { apiGet, apiPatch } from "./api";
import { ApiSuccessResponse, ApiResponseData } from "@/types/api";
import {
  Rating,
  RatingFilters,
  FlagRatingPayload,
  UpdateRatingStatusPayload,
  GetRatingsResponse,
  GetRatingByIdResponse,
  GetDoctorRatingStatsResponse,
} from '@/types/admin-ratings';

export const adminRatingsService = {
  getRatings: async (filters?: RatingFilters): Promise<ApiResponseData<Rating[]>> => {
    const params = filters as Record<string, string | number | boolean | null | undefined>;
    const res = await apiGet<ApiResponseData<Rating[]>>('/api/ratings/list', { params });
    return res;
  },

  getRatingById: async (id: number | string): Promise<Rating> => {
    const res = await apiGet<GetRatingByIdResponse>(`/api/ratings/${id}`);
    return res.data;
  },

  getDoctorRatingStats: async (doctorId: number | string): Promise<GetDoctorRatingStatsResponse> => {
    return apiGet<GetDoctorRatingStatsResponse>(`/api/ratings/doctor/${doctorId}/stats`);
  },

  flagRating: async (id: number | string, data: FlagRatingPayload): Promise<ApiSuccessResponse<unknown>> => {
    return apiPatch<ApiSuccessResponse<unknown>>(`/api/ratings/${id}/flag`, data);
  },

  updateRatingStatus: async (id: number | string, data: UpdateRatingStatusPayload): Promise<ApiSuccessResponse<unknown>> => {
    return apiPatch<ApiSuccessResponse<unknown>>(`/api/ratings/${id}/status`, data);
  },
};
