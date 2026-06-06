export type RecordStatus = 'draft' | 'final' | 'amended';

export type MedicalRecordListParams = {
  patient_id?: number;
  doctor_id?: number;
  record_status?: RecordStatus;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
};

export type MedicalRecordStatisticsParams = {
  from_date?: string;
  to_date?: string;
  doctor_id?: number;
};

export type MedicalRecordStatisticsData = {
  total?: number;
  draft?: number;
  final?: number;
  amended?: number;
  follow_ups_recommended?: number;
  unique_patients?: number;
  unique_doctors?: number;
};

export type MedicalRecordStatisticsResponse = {
  success: boolean;
  data?: MedicalRecordStatisticsData;
};

export type MedicalRecordListItem = Record<string, unknown>;

export type MedicalRecordListResponse = {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data?: MedicalRecordListItem[];
};

export type MedicalRecordDetailData = Record<string, unknown>;

export type MedicalRecordDetailResponse = {
  success: boolean;
  data?: MedicalRecordDetailData;
};

export type PatientMedicalHistoryResponse = {
  success: boolean;
  patient?: Record<string, unknown>;
  records_count?: number;
  data?: MedicalRecordListItem[];
};

export type MedicalRecordActionResponse = {
  success: boolean;
  message?: string;
  message_ar?: string;
  message_en?: string;
  data?: Record<string, unknown>;
};
