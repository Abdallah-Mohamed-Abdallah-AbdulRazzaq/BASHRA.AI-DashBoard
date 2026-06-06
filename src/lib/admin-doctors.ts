import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';
import type {
  DoctorListParams,
  DoctorPendingParams,
  DoctorListResponse,
  DoctorStatisticsResponse,
  DoctorDetailResponse,
  DoctorProfileCompleteResponse,
  DoctorPersonalData,
  DoctorProfessionalData,
  DoctorDocumentsResponse,
  DoctorDocumentsSummaryResponse,
  DoctorContactDetailsParams,
  DoctorContactDetailsListResponse,
  DoctorContactDetailsByDoctorResponse,
  UpdateDoctorStatusPayload,
  VerifyDoctorPayload,
  UpdateDoctorVerificationStatusPayload,
  UpdateDoctorApprovalStatusPayload,
  DoctorReasonPayload,
  BulkUpdateDoctorsStatusPayload,
  UpdateDoctorDocumentStatusPayload,
  DeleteDoctorProfilePayload,
  DoctorActionResponse,
  UpdateDoctorPersonalDataPayload,
  UpdateDoctorProfessionalDataPayload,
} from '@/types/admin-doctors';

export async function getDoctors(params?: DoctorListParams): Promise<DoctorListResponse> {
  return apiGet<DoctorListResponse>('/api/admin/doctors', { params: params as Record<string, string | number | boolean | undefined | null> });
}

export async function getPendingDoctors(params?: DoctorPendingParams): Promise<DoctorListResponse> {
  return apiGet<DoctorListResponse>('/api/admin/doctors/pending', { params: params as Record<string, string | number | boolean | undefined | null> });
}

export async function getDoctorStatistics(): Promise<DoctorStatisticsResponse> {
  return apiGet<DoctorStatisticsResponse>('/api/admin/doctors/statistics');
}

export async function getDoctorById(doctorId: number | string): Promise<DoctorDetailResponse> {
  return apiGet<DoctorDetailResponse>(`/api/admin/doctors/${doctorId}`);
}

export async function getDoctorProfileComplete(doctorId: number | string): Promise<DoctorProfileCompleteResponse> {
  return apiGet<DoctorProfileCompleteResponse>(`/api/admin/doctors/${doctorId}/profile/complete`);
}

export async function getDoctorPersonalData(doctorId: number | string): Promise<{ success: boolean; data?: DoctorPersonalData }> {
  return apiGet<{ success: boolean; data?: DoctorPersonalData }>(`/api/admin/doctors/${doctorId}/profile/personal`);
}

export async function getDoctorProfessionalData(doctorId: number | string): Promise<{ success: boolean; data?: DoctorProfessionalData }> {
  return apiGet<{ success: boolean; data?: DoctorProfessionalData }>(`/api/admin/doctors/${doctorId}/profile/professional`);
}

export async function getDoctorDocuments(doctorId: number | string): Promise<DoctorDocumentsResponse> {
  return apiGet<DoctorDocumentsResponse>(`/api/admin/doctors/${doctorId}/profile/documents`);
}

export async function getDoctorDocumentsSummary(doctorId: number | string): Promise<DoctorDocumentsSummaryResponse> {
  return apiGet<DoctorDocumentsSummaryResponse>(`/api/admin/doctors/${doctorId}/profile/documents/summary`);
}

export async function getAllDoctorContactDetails(params?: DoctorContactDetailsParams): Promise<DoctorContactDetailsListResponse> {
  return apiGet<DoctorContactDetailsListResponse>('/api/doctor-contact-details/all', { params: params as Record<string, string | number | boolean | undefined | null> });
}

export async function getDoctorContactDetailsByDoctorId(doctorId: number | string): Promise<DoctorContactDetailsByDoctorResponse> {
  return apiGet<DoctorContactDetailsByDoctorResponse>(`/api/doctor-contact-details/doctor/${doctorId}`);
}

export async function updateDoctorStatus(doctorId: number | string, payload: UpdateDoctorStatusPayload): Promise<DoctorActionResponse> {
  return apiPatch<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/status`, payload);
}

export async function verifyDoctor(doctorId: number | string, payload: VerifyDoctorPayload): Promise<DoctorActionResponse> {
  return apiPatch<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/verify`, payload);
}

export async function updateDoctorVerificationStatus(doctorId: number | string, payload: UpdateDoctorVerificationStatusPayload): Promise<DoctorActionResponse> {
  return apiPatch<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/verification-status`, payload);
}

export async function updateDoctorApprovalStatus(doctorId: number | string, payload: UpdateDoctorApprovalStatusPayload): Promise<DoctorActionResponse> {
  return apiPatch<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/approval`, payload);
}

export async function approveDoctor(doctorId: number | string, payload: DoctorReasonPayload): Promise<DoctorActionResponse> {
  return apiPost<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/approve`, payload);
}

export async function rejectDoctor(doctorId: number | string, payload: DoctorReasonPayload): Promise<DoctorActionResponse> {
  return apiPost<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/reject`, payload);
}

export async function suspendDoctor(doctorId: number | string, payload: DoctorReasonPayload): Promise<DoctorActionResponse> {
  return apiPost<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/suspend`, payload);
}

export async function bulkUpdateDoctorsStatus(payload: BulkUpdateDoctorsStatusPayload): Promise<DoctorActionResponse> {
  return apiPost<DoctorActionResponse>('/api/admin/doctors/bulk/status', payload);
}

export async function updateDoctorPersonalData(doctorId: number | string, payload: UpdateDoctorPersonalDataPayload): Promise<DoctorActionResponse> {
  return apiPut<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/profile/personal`, payload);
}

export async function updateDoctorProfessionalData(doctorId: number | string, payload: UpdateDoctorProfessionalDataPayload): Promise<DoctorActionResponse> {
  return apiPut<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/profile/professional`, payload);
}

export async function updateDoctorDocumentStatus(doctorId: number | string, documentId: number | string, payload: UpdateDoctorDocumentStatusPayload): Promise<DoctorActionResponse> {
  return apiPut<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/profile/documents/${documentId}`, payload);
}

export async function approveDoctorProfile(doctorId: number | string, payload: DoctorReasonPayload): Promise<DoctorActionResponse> {
  return apiPost<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/profile/approve`, payload);
}

export async function rejectDoctorProfile(doctorId: number | string, payload: DoctorReasonPayload): Promise<DoctorActionResponse> {
  return apiPost<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/profile/reject`, payload);
}

export async function deleteDoctorProfile(doctorId: number | string, payload: DeleteDoctorProfilePayload): Promise<DoctorActionResponse> {
  return apiDelete<DoctorActionResponse>(`/api/admin/doctors/${doctorId}/profile`, { body: payload });
}
