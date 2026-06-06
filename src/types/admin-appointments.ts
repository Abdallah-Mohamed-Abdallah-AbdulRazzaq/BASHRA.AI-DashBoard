export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

export type AppointmentType = 'consultation' | 'follow_up' | 'urgent' | 'routine';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type AppointmentListParams = {
  status?: AppointmentStatus;
  doctor_id?: number;
  patient_id?: number;
  appointment_type?: AppointmentType;
  urgency_level?: UrgencyLevel;
  payment_status?: PaymentStatus;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
};

export type AppointmentStatisticsParams = {
  from_date?: string;
  to_date?: string;
  doctor_id?: number;
};

export type AppointmentStatisticsData = {
  total?: number;
  pending?: number;
  confirmed?: number;
  in_progress?: number;
  completed?: number;
  cancelled?: number;
  no_show?: number;
  rescheduled?: number;
  total_revenue?: number;
  pending_revenue?: number;
};

export type AppointmentStatisticsResponse = {
  success: boolean;
  data?: AppointmentStatisticsData;
};

export type AppointmentListItem = Record<string, unknown>;

export type AppointmentListResponse = {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data?: AppointmentListItem[];
};

export type AppointmentDetailData = Record<string, unknown>;

export type AppointmentDetailResponse = {
  success: boolean;
  data?: AppointmentDetailData;
};

export type CreateAppointmentPayload = {
  patient_id: number;
  schedule_id: number;
  scheduled_date: string;
  actual_start_time: string;
  appointment_type?: AppointmentType;
  urgency_level?: UrgencyLevel;
  payment_status?: PaymentStatus;
  language_code?: string;
  chief_complaint?: string;
  symptoms_description?: string;
  notes?: string;
};

export type CreateAppointmentResponse = {
  success: boolean;
  message?: string;
  data?: {
    id?: number;
    uuid?: string;
    patient_id?: number;
    doctor_id?: number;
    schedule_id?: number;
    status?: AppointmentStatus;
  };
};

export type UpdateAppointmentPayload = {
  scheduled_date?: string;
  actual_start_time?: string;
  duration_minutes?: number;
  appointment_type?: AppointmentType;
  urgency_level?: UrgencyLevel;
  consultation_fee?: number;
  currency_code?: string;
  payment_status?: PaymentStatus;
  status?: AppointmentStatus;
};

export type CancelAppointmentPayload = {
  cancellation_reason: string | Record<string, string>;
};

export type AppointmentActionResponse = {
  success: boolean;
  message?: string;
  message_ar?: string;
  message_en?: string;
  data?: Record<string, unknown>;
};
