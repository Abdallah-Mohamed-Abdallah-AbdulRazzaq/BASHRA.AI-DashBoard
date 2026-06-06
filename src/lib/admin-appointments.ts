import { apiDelete, apiGet } from '@/lib/api';

import type {
  DeleteMedicalRecordResponse,
  MedicalRecordDetailsResponse,
  MedicalRecordListParams,
  MedicalRecordListResponse,
  MedicalRecordStatisticsParams,
  MedicalRecordStatisticsResponse,
  PatientMedicalHistoryResponse,
} from '@/types/admin-medical-records';

const ADMIN_MEDICAL_RECORDS_BASE = '/api/admin/medical-records';

type ApiQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

function buildMedicalRecordStatisticsParams(
  params?: MedicalRecordStatisticsParams
): ApiQueryParams | undefined {
  if (!params) return undefined;

  return {
    from_date: params.from_date,
    to_date: params.to_date,
    doctor_id: params.doctor_id,
  };
}

function buildMedicalRecordListParams(
  params?: MedicalRecordListParams
): ApiQueryParams | undefined {
  if (!params) return undefined;

  return {
    patient_id: params.patient_id,
    doctor_id: params.doctor_id,
    record_status: params.record_status,
    from_date: params.from_date,
    to_date: params.to_date,
    page: params.page,
    limit: params.limit,
  };
}

export function getMedicalRecordStatistics(
  params?: MedicalRecordStatisticsParams
) {
  return apiGet<MedicalRecordStatisticsResponse>(
    `${ADMIN_MEDICAL_RECORDS_BASE}/statistics`,
    {
      params: buildMedicalRecordStatisticsParams(params),
    }
  );
}

export function getPatientMedicalHistory(patientId: number | string) {
  return apiGet<PatientMedicalHistoryResponse>(
    `${ADMIN_MEDICAL_RECORDS_BASE}/patient/${patientId}/history`
  );
}

export function getAdminMedicalRecords(params?: MedicalRecordListParams) {
  return apiGet<MedicalRecordListResponse>(ADMIN_MEDICAL_RECORDS_BASE, {
    params: buildMedicalRecordListParams(params),
  });
}

export function getAdminMedicalRecordById(id: number | string) {
  return apiGet<MedicalRecordDetailsResponse>(
    `${ADMIN_MEDICAL_RECORDS_BASE}/${id}`
  );
}

export function deleteAdminMedicalRecord(id: number | string) {
  return apiDelete<DeleteMedicalRecordResponse>(
    `${ADMIN_MEDICAL_RECORDS_BASE}/${id}`
  );
}