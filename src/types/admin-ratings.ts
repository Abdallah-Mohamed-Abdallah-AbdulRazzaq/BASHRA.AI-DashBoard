import { ApiResponseData, ApiSuccessResponse } from './api';

export interface RatingTranslation {
  review_title?: string;
  review_comment?: string;
  flagged_reason?: string;
  doctor_response?: string;
}

export interface Rating {
  id: number;
  uuid?: string;
  appointment_id?: number;
  doctor_id?: number;
  patient_id?: number;
  rating?: number;
  categories?: {
    communication?: number;
    punctuality?: number;
    care_quality?: number;
    [key: string]: number | undefined;
  };
  would_recommend?: boolean | number;
  is_anonymous?: boolean | number;
  status?: string; // active, hidden, removed
  is_flagged?: boolean | number;
  flagged_by_admin_id?: number;
  flagged_at?: string;
  doctor_responded_at?: string;
  created_at?: string;
  updated_at?: string;
  translations?: {
    ar?: RatingTranslation;
    en?: RatingTranslation;
  };
  patient?: {
    id: number;
    full_name?: string;
    display_name?: string; // used when anonymous
    [key: string]: unknown;
  };
  doctor?: {
    id: number;
    full_name?: string;
    [key: string]: unknown;
  };
}

export interface RatingFilters {
  doctor_id?: number | string;
  patient_id?: number | string;
  status?: string; // active, hidden, removed
  min_rating?: number;
  max_rating?: number;
  page?: number;
  limit?: number;
}

export interface DoctorRatingStats {
  total_ratings: number;
  average_rating: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recommendation_count: number;
  recommendation_percentage: number;
}

export interface FlagRatingPayload {
  language_code: string;
  reason: string;
}

export interface UpdateRatingStatusPayload {
  status: 'active' | 'hidden' | 'removed';
}

export type GetRatingsResponse = ApiResponseData<Rating[]>;
export type GetRatingByIdResponse = ApiSuccessResponse<Rating>;
export type GetDoctorRatingStatsResponse = ApiSuccessResponse<DoctorRatingStats>;
