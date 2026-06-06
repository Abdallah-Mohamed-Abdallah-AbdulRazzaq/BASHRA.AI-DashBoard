import type { ApiSuccessResponse } from '@/types/api';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type AppointmentType =
  | 'consultation'
  | 'follow_up'
  | 'urgent'
  | 'routine';

export type AppointmentUrgencyLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'emergency';

export type AppointmentPaymentStatus =
  | 'pending'
  | 'paid'
  | 'refunded'
  | 'failed';

export interface AppointmentStatisticsParams {
  from_date?: string;
  to_date?: string;
  doctor_id?: number | string;
}

export interface AppointmentStatisticsData {
  total?: number;
  pending?: number;
  confirmed?: number;
  in_progress?: number;
  completed?: number;
  cancelled?: number;
  no_show?: number;
  rescheduled?: number;
  total_revenue?: number | string;
  pending_revenue?: number | string;
}

export type AppointmentStatisticsResponse =
  ApiSuccessResponse<AppointmentStatisticsData>;

export interface AppointmentListParams {
  status?: AppointmentStatus;
  doctor_id?: number | string;
  patient_id?: number | string;
  appointment_type?: AppointmentType;
  urgency_level?: AppointmentUrgencyLevel;
  payment_status?: AppointmentPaymentStatus;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentTranslation {
  language_code?: string;
  chief_complaint?: string;
  symptoms_description?: string;
  notes?: string;
  cancellation_reason?: string;
  [key: string]: unknown;
}

export interface AppointmentPatientInfo {
  id?: number;
  uuid?: string;
  email?: string;
  phone?: string;
  full_name?: string;
  profile_picture_url?: string;
  [key: string]: unknown;
}

export interface AppointmentDoctorInfo {
  id?: number;
  uuid?: string;
  email?: string;
  phone?: string;
  full_name?: string;
  specialty?: string;
  sub_specialty?: string;
  profile_picture_url?: string;
  [key: string]: unknown;
}

export interface AppointmentClinicInfo {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  [key: string]: unknown;
}

export interface AppointmentListItem {
  id?: number;
  uuid?: string;
  patient_id?: number;
  doctor_id?: number;
  clinic_id?: number;
  schedule_id?: number;

  status?: AppointmentStatus;
  appointment_type?: AppointmentType;
  urgency_level?: AppointmentUrgencyLevel;
  payment_status?: AppointmentPaymentStatus;

  scheduled_date?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  actual_start_time?: string;
  actual_end_time?: string;
  duration_minutes?: number;

  consultation_fee?: number | string;
  currency_code?: string;

  cancelled_by_admin_id?: number;
  cancelled_at?: string;

  created_at?: string;
  updated_at?: string;

  patient?: AppointmentPatientInfo | null;
  doctor?: AppointmentDoctorInfo | null;
  clinic?: AppointmentClinicInfo | null;
  translations?: Record<string, AppointmentTranslation> | AppointmentTranslation[];

  [key: string]: unknown;
}

export type AppointmentDetails = AppointmentListItem;

export interface AppointmentListResponse {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data: AppointmentListItem[];
  message?: string;
  message_ar?: string;
  message_en?: string;
}

export type AppointmentDetailsResponse =
  ApiSuccessResponse<AppointmentDetails>;

export interface CreateAppointmentPayload {
  patient_id: number;
  schedule_id: number;
  scheduled_date: string;
  actual_start_time: string;

  appointment_type?: AppointmentType;
  urgency_level?: AppointmentUrgencyLevel;
  payment_status?: AppointmentPaymentStatus;
  language_code?: string;
  chief_complaint?: string;
  symptoms_description?: string;
  notes?: string;
}

export interface CreateAppointmentResponseData {
  id?: number;
  uuid?: string;
  patient_id?: number;
  doctor_id?: number;
  schedule_id?: number;
  status?: AppointmentStatus;
  [key: string]: unknown;
}

export type CreateAppointmentResponse =
  ApiSuccessResponse<CreateAppointmentResponseData>;

export interface UpdateAppointmentPayload {
  scheduled_date?: string;
  actual_start_time?: string;
  duration_minutes?: number;
  appointment_type?: AppointmentType;
  urgency_level?: AppointmentUrgencyLevel;
  consultation_fee?: number | string;
  currency_code?: string;
  payment_status?: AppointmentPaymentStatus;
  status?: AppointmentStatus;
}

export type UpdateAppointmentResponse =
  ApiSuccessResponse<AppointmentDetails>;

export interface CancelAppointmentPayload {
  cancellation_reason:
    | string
    | {
        ar?: string;
        en?: string;
        [key: string]: string | undefined;
      };
}

export type CancelAppointmentResponse =
  ApiSuccessResponse<AppointmentDetails | Record<string, unknown>>;

export interface DeleteAppointmentResponse {
  success: boolean;
  message?: string;
  message_ar?: string;
  message_en?: string;
  data?: Record<string, unknown>;
}