// ============================================================
// Admin Profile Service — Batch 1
// Single source of truth for /api/profile-admin/* endpoints.
// Functions previously in admin-auth.ts have been moved here.
// Source of truth: docs/admin-batch-1-auth-security-profile/01-admin-auth-security-profile-api-docs.md
//
// UI status per endpoint:
// - getAdminProfile         → Service-only (profile-settings-view uses getAdminCompleteProfile)
// - getAdminCompleteProfile → Integrated — profile settings page
// - updateAdminProfile      → Integrated — profile settings save button
// - uploadAdminProfilePicture → Integrated — profile picture upload
// - deleteAdminProfilePicture → Integrated — profile picture remove button
// - deactivateAdminAccount  → Service-only — Destructive. No direct UI button.
//                             Exposing in UI risks admin locking themselves out.
//                             Service available for future dedicated admin management page.
// - reactivateAdminAccount  → Service-only — Counterpart to deactivate.
//                             Same reason for deferral.
// ============================================================

import { apiGet, apiPut, apiPatch, apiUpload, apiDelete } from './api';
import type { AdminCompleteProfile, ApiSuccessResponse, PictureUploadResponse } from '@/types/api';

// Profile update payload — matches documented PUT body fields
export type ProfileUpdatePayload = {
  full_name?: string;
  job_title?: string;
  department?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  emergency_contact_phone?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  timezone?: string;
  language_preference?: string;
  translations?: {
    ar?: { full_name?: string; job_title?: string; department?: string };
    en?: { full_name?: string; job_title?: string; department?: string };
  };
};

export type AdminProfileData = {
  id: number;
  admin_id: number;
  full_name?: string | null;
  job_title?: string | null;
  department?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  profile_picture_url?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relationship?: string | null;
  timezone?: string | null;
  language_preference?: string | null;
  hire_date?: string | null;
};

type GetProfileResponse = {
  success: true;
  message?: string;
  data: AdminProfileData;
};

type UpdateProfileResponse = {
  success: true;
  message?: string;
  data: Record<string, unknown>;
};

type SimpleActionResponse = {
  success: true;
  message?: string;
};

/**
 * GET /api/profile-admin
 * Returns the current admin's profile in a single language (Accept-Language header).
 * Permission: Any Admin
 * UI: Service-only — profile-settings-view.tsx uses getAdminCompleteProfile() instead
 *     because it needs account + profile + translations together.
 */
export async function getAdminProfile(): Promise<AdminProfileData> {
  const response = await apiGet<GetProfileResponse>('/api/profile-admin');
  return response.data;
}

/**
 * GET /api/profile-admin/complete
 * Returns full admin data: account + profile + translations (ar/en).
 * Permission: Any Admin
 * UI: Integrated — used by profile-settings-view.tsx on mount
 */
export async function getAdminCompleteProfile(): Promise<AdminCompleteProfile> {
  const response = await apiGet<ApiSuccessResponse<AdminCompleteProfile>>('/api/profile-admin/complete');
  return response.data;
}

/**
 * PUT /api/profile-admin
 * Updates the current admin's profile.
 * Accepts both flat fields (current language) and translations object.
 * Valid gender values: male | female | other | prefer_not_to_say
 * Permission: Any Admin
 * UI: Integrated — profile settings save button
 */
export async function updateAdminProfile(data: ProfileUpdatePayload): Promise<UpdateProfileResponse> {
  return apiPut<UpdateProfileResponse>('/api/profile-admin', data);
}

/**
 * POST /api/profile-admin/picture
 * Uploads a profile picture via multipart/form-data.
 * Form field name MUST be: profile_picture
 * Permission: Any Admin
 * UI: Integrated — profile picture upload in profile settings
 */
export async function uploadAdminProfilePicture(file: File): Promise<PictureUploadResponse> {
  const formData = new FormData();
  formData.append('profile_picture', file);
  return apiUpload<PictureUploadResponse>('/api/profile-admin/picture', formData);
}

/**
 * DELETE /api/profile-admin/picture
 * Removes the current admin's profile picture.
 * Permission: Any Admin
 * UI: Integrated — remove picture button in profile settings
 */
export async function deleteAdminProfilePicture(): Promise<SimpleActionResponse> {
  return apiDelete<SimpleActionResponse>('/api/profile-admin/picture');
}

/**
 * DELETE /api/profile-admin
 * Deactivates (soft-deletes) the current admin's account.
 * WARNING: Destructive. Admin will not be able to access dashboard until reactivated.
 * Permission: Any Admin
 * UI: Service-only — No direct UI button to avoid accidental self-lockout.
 *     Requires a future dedicated "Account Danger Zone" page with strong confirmation.
 */
export async function deactivateAdminAccount(): Promise<SimpleActionResponse> {
  return apiDelete<SimpleActionResponse>('/api/profile-admin');
}

/**
 * PATCH /api/profile-admin/reactivate
 * Reactivates a deactivated admin account.
 * Permission: Any Admin (middleware allows inactive accounts to call this)
 * UI: Service-only — Paired with deactivateAdminAccount. Same deferral reason.
 */
export async function reactivateAdminAccount(): Promise<SimpleActionResponse> {
  return apiPatch<SimpleActionResponse>('/api/profile-admin/reactivate');
}
