import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/lib/api';

import type {
  AppointmentDetailsResponse,
  AppointmentListParams,
  AppointmentListResponse,
  AppointmentStatisticsParams,
  AppointmentStatisticsResponse,
  CancelAppointmentPayload,
  CancelAppointmentResponse,
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  DeleteAppointmentResponse,
  UpdateAppointmentPayload,
  UpdateAppointmentResponse,
} from '@/types/admin-appointments';

const ADMIN_APPOINTMENTS_BASE = '/api/admin/appointments';

type ApiQueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

function buildAppointmentStatisticsParams(
  params?: AppointmentStatisticsParams
): ApiQueryParams | undefined {
  if (!params) return undefined;

  return {
    from_date: params.from_date,
    to_date: params.to_date,
    doctor_id: params.doctor_id,
  };
}

function buildAppointmentListParams(
  params?: AppointmentListParams
): ApiQueryParams | undefined {
  if (!params) return undefined;

  return {
    status: params.status,
    doctor_id: params.doctor_id,
    patient_id: params.patient_id,
    appointment_type: params.appointment_type,
    urgency_level: params.urgency_level,
    payment_status: params.payment_status,
    from_date: params.from_date,
    to_date: params.to_date,
    page: params.page,
    limit: params.limit,
  };
}

export function getAppointmentStatistics(params?: AppointmentStatisticsParams) {
  return apiGet<AppointmentStatisticsResponse>(
    `${ADMIN_APPOINTMENTS_BASE}/statistics`,
    {
      params: buildAppointmentStatisticsParams(params),
    }
  );
}

export function getAdminAppointments(params?: AppointmentListParams) {
  return apiGet<AppointmentListResponse>(ADMIN_APPOINTMENTS_BASE, {
    params: buildAppointmentListParams(params),
  });
}

export function getAdminAppointmentById(id: number | string) {
  return apiGet<AppointmentDetailsResponse>(`${ADMIN_APPOINTMENTS_BASE}/${id}`);
}

export function createAdminAppointment(payload: CreateAppointmentPayload) {
  return apiPost<CreateAppointmentResponse>(ADMIN_APPOINTMENTS_BASE, payload);
}

export function updateAdminAppointment(
  id: number | string,
  payload: UpdateAppointmentPayload
) {
  return apiPut<UpdateAppointmentResponse>(
    `${ADMIN_APPOINTMENTS_BASE}/${id}`,
    payload
  );
}

export function cancelAdminAppointment(
  id: number | string,
  payload: CancelAppointmentPayload
) {
  return apiPatch<CancelAppointmentResponse>(
    `${ADMIN_APPOINTMENTS_BASE}/${id}/cancel`,
    payload
  );
}

export function deleteAdminAppointment(id: number | string) {
  return apiDelete<DeleteAppointmentResponse>(
    `${ADMIN_APPOINTMENTS_BASE}/${id}`
  );
}