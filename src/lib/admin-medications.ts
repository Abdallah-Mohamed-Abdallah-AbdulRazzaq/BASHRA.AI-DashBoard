import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";
import { ApiSuccessResponse, ApiResponseData } from "@/types/api";
import {
  Medication,
  MedicationFilters,
  CreateMedicationPayload,
  UpdateMedicationPayload,
  GetMedicationsResponse,
  GetMedicationCategoriesResponse,
  GetMedicationByIdResponse,
} from '@/types/admin-medications';

export const adminMedicationsService = {
  async getMedications(filters?: MedicationFilters): Promise<ApiResponseData<Medication[]>> {
    const params = filters as Record<string, string | number | boolean | null | undefined>;
    const res = await apiGet<ApiResponseData<Medication[]>>("/api/medications/list", { params });
    return res;
  },

  getMedicationCategories: async (): Promise<string[]> => {
    const res = await apiGet<GetMedicationCategoriesResponse>('/api/medications/categories/list');
    return res.data;
  },

  getMedicationsByCategory: async (category: string): Promise<GetMedicationsResponse> => {
    return apiGet<GetMedicationsResponse>(`/api/medications/category/${encodeURIComponent(category)}`);
  },

  getMedicationById: async (id: number | string): Promise<Medication> => {
    const res = await apiGet<GetMedicationByIdResponse>(`/api/medications/${id}`);
    return res.data;
  },

  createMedication: async (data: CreateMedicationPayload): Promise<ApiSuccessResponse<unknown>> => {
    return apiPost<ApiSuccessResponse<unknown>>('/api/medications', data);
  },

  updateMedication: async (id: number | string, data: UpdateMedicationPayload): Promise<ApiSuccessResponse<unknown>> => {
    return apiPut<ApiSuccessResponse<unknown>>(`/api/medications/${id}`, data);
  },

  toggleMedicationStatus: async (id: number | string): Promise<ApiSuccessResponse<unknown>> => {
    return apiPatch<ApiSuccessResponse<unknown>>(`/api/medications/${id}/toggle-status`);
  },

  deleteMedication: async (id: number | string): Promise<ApiSuccessResponse<unknown>> => {
    return apiDelete<ApiSuccessResponse<unknown>>(`/api/medications/${id}`);
  },
};
