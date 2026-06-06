import { apiGet, apiPut } from './api';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  AdminUserListResponse,
  AdminUserDetailsResponse,
  AdminUserMedicalProfileResponse,
  AdminUserLogsResponse,
  UpdateUserStatusPayload,
  AdminUsersQueryParams,
  AdminUsersSearchParams,
  AdminUserLogsQueryParams,
  UserStatsResponse,
  PatientProfilesListResponse,
  PatientProfileDetailResponse,
  PatientProfileQueryParams,
} from '@/types/admin-users';

export async function getAdminUserStats(): Promise<UserStatsResponse> {
  const res = await apiGet<ApiSuccessResponse<UserStatsResponse>>(
    '/api/admin/users/stats'
  );
  return res.data;
}

export async function getAdminUsers(
  params?: AdminUsersQueryParams
): Promise<AdminUserListResponse> {
  const res = await apiGet<ApiSuccessResponse<AdminUserListResponse>>(
    '/api/admin/users',
    { params: params as Record<string, string | number | boolean | undefined> }
  );
  return res.data;
}

export async function searchAdminUsers(
  params?: AdminUsersSearchParams
): Promise<AdminUserListResponse> {
  const res = await apiGet<ApiSuccessResponse<AdminUserListResponse>>(
    '/api/admin/users/search',
    { params: params as Record<string, string | number | boolean | undefined> }
  );
  return res.data;
}

export async function getAdminUsersByStatus(
  status: string,
  params?: { page?: number; limit?: number }
): Promise<AdminUserListResponse> {
  const res = await apiGet<ApiSuccessResponse<AdminUserListResponse>>(
    `/api/admin/users/status/${status}`,
    { params: params as Record<string, string | number | boolean | undefined> }
  );
  return res.data;
}

export async function getAdminUserById(
  id: number
): Promise<AdminUserDetailsResponse> {
  const res = await apiGet<ApiSuccessResponse<AdminUserDetailsResponse>>(
    `/api/admin/users/${id}`
  );
  return res.data;
}

export async function getAdminUserMedicalProfile(
  id: number
): Promise<AdminUserMedicalProfileResponse> {
  const res = await apiGet<ApiSuccessResponse<AdminUserMedicalProfileResponse>>(
    `/api/admin/users/${id}/medical`
  );
  return res.data;
}

export async function getAdminUserLogs(
  id: number,
  params?: AdminUserLogsQueryParams
): Promise<AdminUserLogsResponse> {
  const res = await apiGet<ApiSuccessResponse<AdminUserLogsResponse>>(
    `/api/admin/users/${id}/logs`,
    { params: params as Record<string, string | number | boolean | undefined> }
  );
  return res.data;
}

export async function updateAdminUserStatus(
  id: number,
  payload: UpdateUserStatusPayload
): Promise<void> {
  await apiPut<ApiSuccessResponse<null>>(
    `/api/admin/users/${id}/status`,
    payload
  );
}

export async function getAllPatientProfiles(
  params?: PatientProfileQueryParams
): Promise<PatientProfilesListResponse> {
  const res = await apiGet<ApiSuccessResponse<PatientProfilesListResponse>>(
    '/api/patient-profiles/all',
    { params: params as Record<string, string | number | boolean | undefined> }
  );
  return res.data;
}

export async function getPatientProfileByUserId(
  userId: number
): Promise<PatientProfileDetailResponse> {
  const res = await apiGet<ApiSuccessResponse<PatientProfileDetailResponse>>(
    `/api/patient-profiles/patient/${userId}`
  );
  return res.data;
}
