import { apiGet, apiPost, apiPatch } from './api';
import type { ApiDataResponse } from '@/types/admin-dashboard';
import type {
  AIUsageOverview,
  AIUsageUserResponse,
  AIPolicyListResponse,
  AIUsagePolicy,
  AIPolicyCreatePayload,
  AIPolicyUpdatePayload,
  AIPolicyStatusPayload
} from '@/types/admin-ai-usage';

/**
 * Get AI Usage Overview
 */
export async function getAdminAIOverview(period_key?: string): Promise<AIUsageOverview> {
  const params: Record<string, string> = {};
  if (period_key) params.period_key = period_key;
  
  const res = await apiGet<ApiDataResponse<AIUsageOverview>>('/api/admin/ai-usage/overview', { params });
  return res.data;
}

/**
 * Get User AI Usage
 */
export async function getAdminUserAIUsage(userId: number): Promise<AIUsageUserResponse> {
  const res = await apiGet<ApiDataResponse<AIUsageUserResponse>>(`/api/admin/ai-usage/users/${userId}`);
  return res.data;
}

/**
 * List Policies
 */
export async function getAIUsagePolicies(params?: {
  page?: number;
  limit?: number;
  scope_type?: string;
  is_active?: boolean;
}): Promise<AIPolicyListResponse> {
  const queryParams: Record<string, any> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.scope_type) queryParams.scope_type = params.scope_type;
  if (params?.is_active !== undefined) queryParams.is_active = params.is_active;

  const res = await apiGet<ApiDataResponse<AIPolicyListResponse>>('/api/admin/ai-usage/policies', { params: queryParams });
  return res.data;
}

/**
 * Get Policy by ID
 * Returns: ApiDataResponse<{ policy: AIUsagePolicy }>
 */
export async function getAIUsagePolicyById(id: number): Promise<AIUsagePolicy> {
  const res = await apiGet<ApiDataResponse<{ policy: AIUsagePolicy }>>(`/api/admin/ai-usage/policies/${id}`);
  return res.data.policy;
}

/**
 * Create Policy (Requires Super Admin)
 * Returns: 201 with data.policy
 */
export async function createAIUsagePolicy(payload: AIPolicyCreatePayload): Promise<AIUsagePolicy> {
  const res = await apiPost<ApiDataResponse<{ policy: AIUsagePolicy }>>('/api/admin/ai-usage/policies', payload);
  return res.data.policy;
}

/**
 * Update Policy (Requires Super Admin)
 * Returns: 200 with data.policy
 */
export async function updateAIUsagePolicy(id: number, payload: AIPolicyUpdatePayload): Promise<AIUsagePolicy> {
  const res = await apiPatch<ApiDataResponse<{ policy: AIUsagePolicy }>>(`/api/admin/ai-usage/policies/${id}`, payload);
  return res.data.policy;
}

/**
 * Update Policy Status (Requires Super Admin)
 * PATCH /api/admin/ai-usage/policies/:id/status
 * Body: { is_active: boolean }
 * Returns: 200 with data.policy
 */
export async function updateAIUsagePolicyStatus(id: number, payload: AIPolicyStatusPayload): Promise<AIUsagePolicy> {
  const res = await apiPatch<ApiDataResponse<{ policy: AIUsagePolicy }>>(`/api/admin/ai-usage/policies/${id}/status`, payload);
  return res.data.policy;
}
