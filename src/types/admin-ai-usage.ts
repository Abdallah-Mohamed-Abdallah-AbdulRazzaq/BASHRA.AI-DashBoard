export type AIPolicyScopeType = "global" | "user" | "package";

export interface AIUsagePolicy {
  id: number;
  policy_name: string;
  scope_type: AIPolicyScopeType;
  user_id?: number | null;
  package_id?: number | null;
  limits?: {
    max_total_requests_per_month?: number;
    max_chat_messages_per_month?: number;
    max_image_analyses_per_month?: number;
    max_document_analyses_per_month?: number;
    max_files_per_session?: number;
    max_tokens_per_request?: number;
  };
  is_active: boolean;
  priority: number;
  created_by_admin_id: number;
  updated_by_admin_id: number;
}

export interface AIPolicyCreatePayload {
  policy_name: string;
  scope_type: AIPolicyScopeType;
  user_id?: number | null;
  package_id?: number | null;
  max_total_requests_per_month?: number;
  max_chat_messages_per_month?: number;
  max_image_analyses_per_month?: number;
  max_document_analyses_per_month?: number;
  max_files_per_session?: number;
  max_tokens_per_request?: number;
  is_active?: boolean;
  priority?: number;
}

export interface AIPolicyUpdatePayload {
  policy_name?: string;
  scope_type?: AIPolicyScopeType;
  user_id?: number | null;
  package_id?: number | null;
  max_total_requests_per_month?: number;
  max_chat_messages_per_month?: number;
  max_image_analyses_per_month?: number;
  max_document_analyses_per_month?: number;
  max_files_per_session?: number;
  max_tokens_per_request?: number;
  is_active?: boolean;
  priority?: number;
}

export interface AIPolicyStatusPayload {
  is_active: boolean;
}

export interface AIPolicyListResponse {
  policies: AIUsagePolicy[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface AIUsageOverview {
  period_key: string;
  counters: {
    active_users: number;
    total_requests: number | string;
    chat_messages_count: number | string;
    image_analyses_count: number | string;
    document_analyses_count: number | string;
    tokens_used: number | string;
  };
  provider_summary: Array<{
    provider: string;
    model: string;
    request_type: string;
    status: string;
    requests_count: number;
    total_tokens: number | string;
    avg_latency_ms: number | string;
  }>;
  policies_summary: Array<{
    scope_type: string;
    is_active: boolean | number;
    count: number;
  }>;
}

export interface AIUsageUserCounters {
  id?: number;
  period_type?: string;
  period_key?: string;
  total_requests?: number;
  chat_messages_count?: number;
  image_analyses_count?: number;
  document_analyses_count?: number;
  tokens_used?: number;
  last_request_at?: string;
}

export interface AIUsageUserEvent {
  id?: number;
  event_type?: string;
  status?: string;
  tokens_used?: number;
  created_at?: string;
  [key: string]: any;
}

export interface AIUsageUserResponse {
  user: {
    id: number;
    uuid: string;
    email: string;
    phone: string;
    status: string;
    is_active: boolean;
    full_name: string;
    profile_picture_url: string | null;
  };
  active_policies: AIUsagePolicy[];
  counters: AIUsageUserCounters[];
  recent_events: AIUsageUserEvent[];
}
