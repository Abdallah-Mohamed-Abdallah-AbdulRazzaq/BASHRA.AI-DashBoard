import { ApiResponseData, ApiSuccessResponse } from './api';

export interface PrescriptionTranslation {
  instructions?: string;
  indication?: string;
  pharmacy_notes?: string;
}

export interface Prescription {
  id: number;
  uuid?: string;
  patient_id?: number;
  doctor_id?: number;
  medical_record_id?: number;
  medication_name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  quantity?: string;
  route_of_administration?: string;
  refills_allowed?: number;
  refills_used?: number;
  is_generic_allowed?: boolean | number;
  expiry_date?: string;
  status?: string; // active, filled, expired, cancelled, replaced
  filled_date?: string;
  created_at?: string;
  updated_at?: string;
  translations?: {
    ar?: PrescriptionTranslation;
    en?: PrescriptionTranslation;
  };
  patient?: {
    id: number;
    full_name: string;
    [key: string]: unknown;
  };
  doctor?: {
    id: number;
    full_name: string;
    [key: string]: unknown;
  };
}

export interface PrescriptionFilters {
  patient_id?: number | string;
  status?: string;
  medical_record_id?: number | string;
  page?: number;
  limit?: number;
}

export type GetPrescriptionsResponse = ApiResponseData<Prescription[]>;
export type GetPrescriptionByIdResponse = ApiSuccessResponse<Prescription>;
