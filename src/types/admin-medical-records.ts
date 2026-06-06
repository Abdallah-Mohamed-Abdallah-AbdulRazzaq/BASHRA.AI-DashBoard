import type { ApiSuccessResponse } from '@/types/api';

export type MedicalRecordStatus = 'draft' | 'final' | 'amended';

export interface MedicalRecordStatisticsParams {
  from_date?: string;
  to_date?: string;
  doctor_id?: number | string;
}

export interface MedicalRecordStatisticsData {
  total?: number;
  draft?: number;
  final?: number;
  amended?: number;
  follow_ups_recommended?: number;
  unique_patients?: number;
  unique_doctors?: number;
}

export type MedicalRecordStatisticsResponse =
  ApiSuccessResponse<MedicalRecordStatisticsData>;

export interface MedicalRecordListParams {
  patient_id?: number | string;
  doctor_id?: number | string;
  record_status?: MedicalRecordStatus;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface MedicalRecordPatientInfo {
  id?: number;
  uuid?: string;
  email?: string;
  phone?: string;
  full_name?: string;
  profile_picture_url?: string;
  [key: string]: unknown;
}

export interface MedicalRecordDoctorInfo {
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

export interface MedicalRecordTranslation {
  language_code?: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
  symptoms_description?: string;
  recommendations?: string;
  [key: string]: unknown;
}

export interface MedicalRecordListItem {
  id?: number;
  uuid?: string;
  patient_id?: number;
  doctor_id?: number;
  appointment_id?: number;

  record_status?: MedicalRecordStatus;
  visit_date?: string;
  follow_up_required?: boolean | number;
  follow_up_date?: string;

  created_at?: string;
  updated_at?: string;

  patient?: MedicalRecordPatientInfo | null;
  doctor?: MedicalRecordDoctorInfo | null;
  translations?: Record<string, MedicalRecordTranslation> | MedicalRecordTranslation[];

  [key: string]: unknown;
}

export type MedicalRecordDetails = MedicalRecordListItem;

export interface MedicalRecordListResponse {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data: MedicalRecordListItem[];
  message?: string;
  message_ar?: string;
  message_en?: string;
}

export type MedicalRecordDetailsResponse =
  ApiSuccessResponse<MedicalRecordDetails>;

export interface PatientMedicalHistoryResponse {
  success: boolean;
  patient?: MedicalRecordPatientInfo | Record<string, unknown>;
  records_count?: number;
  data: MedicalRecordListItem[];
  message?: string;
  message_ar?: string;
  message_en?: string;
}

export interface DeleteMedicalRecordResponse {
  success: boolean;
  message?: string;
  message_ar?: string;
  message_en?: string;
  data?: Record<string, unknown>;
}