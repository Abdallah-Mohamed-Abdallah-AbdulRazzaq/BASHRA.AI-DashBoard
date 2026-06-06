// ============================================================
// Admin Auth Service — Batch 1
// Covers auth-specific flows: login, logout, refresh, password reset.
// Profile functions have been moved to src/lib/admin-profile.ts.
// ============================================================

import {
  apiPost,
  setAdminAccessToken,
  setAdminRefreshToken,
  setStoredAdmin,
  getStoredAdmin,
  logoutAdmin,
  getAdminAccessToken,
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

/**
 * POST /api/auth-admin/login
 * Authenticates the admin and stores tokens + session locally.
 * Body: { email, password }
 * Permission: Public
 */
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

  // Backend returns user and tokens at top level OR nested in data
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

/**
 * POST /api/auth-admin/logout
 * Calls backend logout to revoke the current token, then clears local auth state.
 * Always clears local state even if backend call fails.
 * Permission: Any Admin (protected — sends current Bearer token)
 */
export async function logoutAdminWithBackend(): Promise<void> {
  const token = getAdminAccessToken();
  if (token) {
    try {
      await apiPost<ApiSuccessResponse<undefined>>(
        '/api/auth-admin/logout',
        {},
        { auth: true }
      );
    } catch {
      // Backend logout failure must not prevent local logout.
      // The token will expire on its own; local session is cleared regardless.
    }
  }
  logoutAdmin();
}

/**
 * Clears local admin auth state without calling backend.
 * Use this only when no token exists or on client-side-only cleanup.
 */
export function logoutAdminLocal(): void {
  logoutAdmin();
}

/**
 * Returns the currently stored admin session from localStorage.
 */
export function getCurrentAdminFromStorage(): AdminSession | null {
  return getStoredAdmin<AdminSession>();
}

/**
 * POST /api/auth-admin/refresh-token
 * Refreshes the access token using the stored refresh token.
 * Response shape: { success, tokens: { accessToken, refreshToken } }
 * Parser is robust to both top-level tokens and data.tokens.
 * Permission: Public (requires valid refreshToken in body)
 */
export async function refreshAdminToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  // Response may return tokens at top-level or nested under data
  type RefreshResponse = ApiSuccessResponse<{ accessToken: string; refreshToken: string }> & {
    tokens?: { accessToken: string; refreshToken: string };
  };

  const response = await apiPost<RefreshResponse>(
    '/api/auth-admin/refresh-token',
    { refreshToken },
    { auth: false }
  );

  // Parse both documented shapes:
  // Shape A: { success, tokens: { accessToken, refreshToken } }
  // Shape B: { success, data: { accessToken, refreshToken } }
  const tokens =
    response.tokens ??
    (response.data as { accessToken?: string; refreshToken?: string } | undefined);

  if (!tokens?.accessToken) {
    throw new ApiError(500, 'Refresh token response missing accessToken');
  }

  setAdminAccessToken(tokens.accessToken);
  if (tokens.refreshToken) {
    setAdminRefreshToken(tokens.refreshToken);
  }

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken ?? refreshToken,
  };
}

/**
 * POST /api/auth-admin/request-password-reset
 * Sends password reset instructions to the admin's email (token-based flow).
 * Permission: Public
 */
export async function requestPasswordReset(
  email: string
): Promise<ApiSuccessResponse<undefined>> {
  return apiPost<ApiSuccessResponse<undefined>>(
    '/api/auth-admin/request-password-reset',
    { email },
    { auth: false }
  );
}

/**
 * POST /api/auth-admin/reset-password
 * Resets password using a reset token from the email link.
 * Body: { token, newPassword }
 * Permission: Public
 */
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

/**
 * POST /api/auth-admin/request-password-reset-otp
 * Sends an OTP to the admin's email for OTP-based password reset.
 * Permission: Public
 * UI: Service-only — OTP reset UI page deferred. No current UTP reset page exists.
 */
export async function requestPasswordResetOtp(
  email: string
): Promise<ApiSuccessResponse<undefined>> {
  return apiPost<ApiSuccessResponse<undefined>>(
    '/api/auth-admin/request-password-reset-otp',
    { email },
    { auth: false }
  );
}

/**
 * POST /api/auth-admin/reset-password-otp
 * Resets password using an OTP code.
 * Body: { email, otp, newPassword }
 * Permission: Public
 * UI: Service-only — Deferred alongside request-password-reset-otp (no OTP UI page).
 */
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

/**
 * @deprecated Use logoutAdminWithBackend() for proper backend logout.
 * Kept as re-export for backward compatibility with any existing callers.
 * Profile functions have moved to src/lib/admin-profile.ts.
 */
export { logoutAdmin } from './api';
