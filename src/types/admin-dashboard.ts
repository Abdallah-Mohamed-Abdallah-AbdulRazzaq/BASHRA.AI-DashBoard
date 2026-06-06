export type DashboardUserStats = {
  total_users?: number;
  active_users?: number;
};

export type DashboardDoctorStats = {
  total_doctors?: number;
  verified_doctors?: number;
  pending_doctors?: number;
};

export type DashboardAppointmentStats = {
  total?: number;
  completed?: number;
  cancelled?: number;
  pending?: number;
  confirmed?: number;
  in_progress?: number;
  no_show?: number;
  rescheduled?: number;
  total_revenue?: number;
  pending_revenue?: number;
};

export type DashboardAIUsageOverview = {
  period_key?: string;
  counters?: {
    active_users?: number;
    total_requests?: number | string;
    chat_messages_count?: number | string;
    image_analyses_count?: number | string;
    document_analyses_count?: number | string;
    tokens_used?: number | string;
  };
  provider_summary?: Array<{
    provider?: string;
    model?: string;
    request_type?: string;
    status?: string;
    requests_count?: number;
    total_tokens?: number | string;
    avg_latency_ms?: number | string;
  }>;
};

export type ApiDataResponse<T> = {
  success: boolean;
  data: T;
};
