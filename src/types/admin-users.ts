export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification";

export interface AdminUserProfile {
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  profile_picture_url?: string;
  language_preference?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  timezone?: string;
}

export interface AdminUserBase {
  id: number;
  uuid?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  is_active?: boolean;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  is_id_verified?: boolean;
  last_login_at?: string | null;
  last_activity_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUserListItem extends AdminUserBase {
  profile?: AdminUserProfile | null;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface AdminUserListData {
  users: AdminUserListItem[];
  pagination: PaginationMeta;
}

export type AdminUserListResponse = AdminUserListData;

export interface AdminUserDetailsData {
  user: AdminUserBase;
  profile?: AdminUserProfile | null;
  has_patient_profile?: boolean;
}

export type AdminUserDetailsResponse = AdminUserDetailsData;

export interface MedicalProfileTranslations {
  medical_history?: string;
  current_medications?: string;
  allergies?: string;
  chronic_conditions?: string;
  family_medical_history?: string;
}

export interface PatientProfileData {
  blood_type?: string;
  height?: string;
  weight?: string;
  smoking_status?: string;
  alcohol_consumption?: string;
  exercise_frequency?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  preferred_doctor_id?: number | null;
  translations?: MedicalProfileTranslations;
}

export interface AdminUserMedicalProfileData {
  user?: Record<string, unknown>;
  patient_profile?: PatientProfileData | null;
}

export type AdminUserMedicalProfileResponse = AdminUserMedicalProfileData;

export interface AdminUserLog {
  id: number;
  admin_id?: number;
  action?: string;
  target_type?: string;
  target_id?: number;
  description?: string;
  severity?: string;
  created_at?: string;
}

export type AdminUserLogsResponse = AdminUserLog[];

export interface UpdateUserStatusPayload {
  status: UserStatus;
  reason: string;
}

export interface UpdateUserStatusResponse {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  verified?: boolean;
}

export interface AdminUsersSearchParams {
  query?: string;
  email?: string;
  phone?: string;
  uuid?: string;
  status?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminUserLogsQueryParams {
  action?: string;
  page?: number;
  limit?: number;
}

export interface UserStatsData {
  total_users?: number;
  active_users?: number;
  inactive_users?: number;
  suspended_users?: number;
  pending_verification_users?: number;
  email_verified_users?: number;
  phone_verified_users?: number;
  id_verified_users?: number;
}

export type UserStatsResponse = UserStatsData;

export interface PatientProfileTranslation {
  medical_history?: string;
  current_medications?: string;
  allergies?: string;
  chronic_conditions?: string;
  family_medical_history?: string;
}

export interface PatientProfileItem {
  id?: number;
  user_id?: number;
  blood_type?: string;
  height?: string;
  weight?: string;
  smoking_status?: string;
  alcohol_consumption?: string;
  exercise_frequency?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  preferred_doctor_id?: number | null;
  user?: {
    id?: number;
    uuid?: string;
    email?: string;
    phone?: string;
    status?: UserStatus;
    profile?: {
      full_name?: string;
      profile_picture_url?: string;
    };
  };
  translations?: PatientProfileTranslation;
  has_profile?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PatientProfilesListData {
  patient_profiles?: PatientProfileItem[];
  pagination?: PaginationMeta;
}

export type PatientProfilesListResponse = PatientProfilesListData;

export interface PatientProfileDetailData {
  id?: number;
  user_id?: number;
  blood_type?: string;
  height?: string;
  weight?: string;
  smoking_status?: string;
  alcohol_consumption?: string;
  exercise_frequency?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  preferred_doctor_id?: number | null;
  user?: {
    id?: number;
    uuid?: string;
    email?: string;
    phone?: string;
    status?: UserStatus;
    profile?: {
      full_name?: string;
      profile_picture_url?: string;
      date_of_birth?: string;
      gender?: string;
      nationality?: string;
    };
  };
  translations?: PatientProfileTranslation;
  created_at?: string;
  updated_at?: string;
}

export type PatientProfileDetailResponse = PatientProfileDetailData;

export interface PatientProfileQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
