import { apiGet, apiDelete } from './api';
import type {
  MedicalRecordStatisticsParams,
  MedicalRecordStatisticsResponse,
  MedicalRecordListParams,
  MedicalRecordListResponse,
  MedicalRecordDetailResponse,
  PatientMedicalHistoryResponse,
  MedicalRecordActionResponse,
} from '@/types/admin-medical-records';

export async function getMedicalRecordStatistics(params?: MedicalRecordStatisticsParams): Promise<MedicalRecordStatisticsResponse> {
  return apiGet<MedicalRecordStatisticsResponse>('/api/admin/medical-records/statistics', { params: params as Record<string, string | number | boolean | undefined | null> });
}

export async function getMedicalRecords(params?: MedicalRecordListParams): Promise<MedicalRecordListResponse> {
  return apiGet<MedicalRecordListResponse>('/api/admin/medical-records', { params: params as Record<string, string | number | boolean | undefined | null> });
}

export async function getMedicalRecordById(id: number | string): Promise<MedicalRecordDetailResponse> {
  return apiGet<MedicalRecordDetailResponse>(`/api/admin/medical-records/${id}`);
}

export async function getPatientMedicalHistory(patientId: number | string): Promise<PatientMedicalHistoryResponse> {
  return apiGet<PatientMedicalHistoryResponse>(`/api/admin/medical-records/patient/${patientId}/history`);
}

export async function deleteMedicalRecord(id: number | string): Promise<MedicalRecordActionResponse> {
  return apiDelete<MedicalRecordActionResponse>(`/api/admin/medical-records/${id}`);
}
