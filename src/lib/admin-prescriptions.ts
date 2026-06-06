import { apiGet } from "./api";
import { ApiSuccessResponse, ApiResponseData } from "@/types/api";
import {
  PrescriptionFilters,
  GetPrescriptionsResponse,
  GetPrescriptionByIdResponse,
  Prescription,
} from '@/types/admin-prescriptions';

export const adminPrescriptionsService = {
  getPrescriptions: async (filters?: PrescriptionFilters): Promise<ApiResponseData<Prescription[]>> => {
    const params = filters as Record<string, string | number | boolean | null | undefined>;
    const res = await apiGet<ApiResponseData<Prescription[]>>("/api/prescriptions/list", { params });
    return res;
  },

  getPrescriptionsByMedicalRecord: async (recordId: number | string): Promise<GetPrescriptionsResponse> => {
    return apiGet<GetPrescriptionsResponse>(`/api/prescriptions/medical-record/${recordId}`);
  },

  getPrescriptionById: async (id: number | string): Promise<Prescription> => {
    const res = await apiGet<GetPrescriptionByIdResponse>(`/api/prescriptions/${id}`);
    return res.data;
  },
  
  // Note: Create/Update/Cancel are Doctor only permissions according to docs. 
  // Admin dashboard only lists and views prescriptions.
};
