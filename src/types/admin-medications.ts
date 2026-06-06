import { ApiResponseData, ApiSuccessResponse } from './api';

export interface Medication {
  id: number;
  uuid: string;
  name: string;
  name_ar: string;
  name_en: string;
  scientific_name?: string;
  category?: string;
  form_type?: string;
  available_dosages?: string[];
  indications?: string;
  warning_alert?: string;
  is_active: number | boolean;
  created_by?: {
    type: string;
    verified: boolean;
  };
}

export interface MedicationFilters {
  is_active?: boolean | string | number;
  category?: string;
  form_type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateMedicationPayload {
  name_ar: string;
  name_en: string;
  scientific_name?: string;
  category?: string;
  form_type?: string;
  available_dosages?: string[];
  indications?: string;
  warning_alert?: string;
  is_active?: boolean | number;
}

export interface UpdateMedicationPayload {
  category?: string;
  available_dosages?: string[];
  warning_alert?: string;
  // According to docs, all fields are optional, so we can include them all
  name_ar?: string;
  name_en?: string;
  scientific_name?: string;
  form_type?: string;
  indications?: string;
  is_active?: boolean | number;
}

export type GetMedicationsResponse = ApiResponseData<Medication[]>;
export type GetMedicationCategoriesResponse = ApiSuccessResponse<string[]>;
export type GetMedicationByIdResponse = ApiSuccessResponse<Medication>;
