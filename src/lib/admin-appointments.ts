import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';
import type {
  AppointmentStatisticsParams,
  AppointmentStatisticsResponse,
  AppointmentListParams,
  AppointmentListResponse,
  AppointmentDetailResponse,
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  UpdateAppointmentPayload,
  AppointmentActionResponse,
  CancelAppointmentPayload,
} from '@/types/admin-appointments';

export async function getAppointmentStatistics(params?: AppointmentStatisticsParams): Promise<AppointmentStatisticsResponse> {
  return apiGet<AppointmentStatisticsResponse>('/api/admin/appointments/statistics', { params: params as Record<string, string | number | boolean | undefined | null> });
}

export async function getAppointments(params?: AppointmentListParams): Promise<AppointmentListResponse> {
  return apiGet<AppointmentListResponse>('/api/admin/appointments', { params: params as Record<string, string | number | boolean | undefined | null> });
}

export async function getAppointmentById(id: number | string): Promise<AppointmentDetailResponse> {
  return apiGet<AppointmentDetailResponse>(`/api/admin/appointments/${id}`);
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<CreateAppointmentResponse> {
  return apiPost<CreateAppointmentResponse>('/api/admin/appointments', payload);
}

export async function updateAppointment(id: number | string, payload: UpdateAppointmentPayload): Promise<AppointmentActionResponse> {
  return apiPut<AppointmentActionResponse>(`/api/admin/appointments/${id}`, payload);
}

export async function cancelAppointment(id: number | string, payload: CancelAppointmentPayload): Promise<AppointmentActionResponse> {
  return apiPatch<AppointmentActionResponse>(`/api/admin/appointments/${id}/cancel`, payload);
}

export async function deleteAppointment(id: number | string): Promise<AppointmentActionResponse> {
  return apiDelete<AppointmentActionResponse>(`/api/admin/appointments/${id}`);
}
