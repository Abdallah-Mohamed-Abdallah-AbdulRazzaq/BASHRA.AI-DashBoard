import {
  apiPost,
  apiGet,
  setAdminAccessToken,
  setAdminRefreshToken,
  setStoredAdmin,
  getStoredAdmin,
  logoutAdmin,
  ApiError,
} from './api';
import type { AdminSession, ApiSuccessResponse } from '@/types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponseTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponseData {
  user: AdminSession;
  tokens: LoginResponseTokens;
}

type LoginApiResponse = ApiSuccessResponse<LoginResponseData> & {
  user?: AdminSession;
  tokens?: LoginResponseTokens;
};

export async function loginAdmin(payload: LoginPayload): Promise<{
  user: AdminSession;
  accessToken: string;
  refreshToken: string;
}> {
  const response = await apiPost<LoginApiResponse>(
    '/api/auth-admin/login',
    payload,
    { auth: false }
  );

  const user = response.user ?? response.data?.user;
  const tokens = response.tokens ?? response.data?.tokens;

  if (!user || !tokens?.accessToken) {
    throw new ApiError(500, 'Login response missing user or tokens');
  }

  setAdminAccessToken(tokens.accessToken);
  if (tokens.refreshToken) {
    setAdminRefreshToken(tokens.refreshToken);
  }
  setStoredAdmin(user);

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export function logoutAdminLocal(): void {
  logoutAdmin();
}

export function getCurrentAdminFromStorage(): AdminSession | null {
  return getStoredAdmin<AdminSession>();
}

export function saveAdminSessionFromLoginResponse(
  response: LoginApiResponse
): {
  user: AdminSession;
  accessToken: string;
  refreshToken: string;
} {
  const user = response.user ?? response.data?.user;
  const tokens = response.tokens ?? response.data?.tokens;

  if (!user || !tokens?.accessToken) {
    throw new ApiError(500, 'Invalid login response structure');
  }

  setAdminAccessToken(tokens.accessToken);
  if (tokens.refreshToken) {
    setAdminRefreshToken(tokens.refreshToken);
  }
  setStoredAdmin(user);

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function getAdminProfile(): Promise<AdminSession> {
  const response = await apiGet<ApiSuccessResponse<AdminSession>>(
    '/api/profile-admin'
  );
  return response.data;
}

export async function requestPasswordReset(
  email: string
): Promise<ApiSuccessResponse<undefined>> {
  return apiPost<ApiSuccessResponse<undefined>>(
    '/api/auth-admin/request-password-reset',
    { email },
    { auth: false }
  );
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ApiSuccessResponse<undefined>> {
  return apiPost<ApiSuccessResponse<undefined>>(
    '/api/auth-admin/reset-password',
    { token, newPassword },
    { auth: false }
  );
}

export async function requestPasswordResetOtp(
  email: string
): Promise<ApiSuccessResponse<undefined>> {
  return apiPost<ApiSuccessResponse<undefined>>(
    '/api/auth-admin/request-password-reset-otp',
    { email },
    { auth: false }
  );
}

export async function resetPasswordOtp(
  email: string,
  otp: string,
  newPassword: string
): Promise<ApiSuccessResponse<undefined>> {
  return apiPost<ApiSuccessResponse<undefined>>(
    '/api/auth-admin/reset-password-otp',
    { email, otp, newPassword },
    { auth: false }
  );
}

export async function refreshAdminToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await apiPost<
    ApiSuccessResponse<{ accessToken: string; refreshToken: string }>
  >('/api/auth-admin/refresh-token', { refreshToken }, { auth: false });

  const tokens = response.data;

  setAdminAccessToken(tokens.accessToken);
  setAdminRefreshToken(tokens.refreshToken);

  return tokens;
}
