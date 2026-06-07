export type UserStatus = "active" | "inactive" | "suspended" | "pending_verification";

export interface AdminUserProfile {
  full_name?: string;
  date_of_birth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  profile_picture_url?: string | null;
  language_preference?: string;
  emergency_contact?: {
    name?: string | null;
    phone?: string | null;
    relationship?: string | null;
  };
  preferences?: {
    timezone?: string;
    language?: string;
  };
}

export interface AdminUserListItem {
  id: number;
  uuid?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: UserStatus;
  is_active?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;
  id_verified?: boolean;
  last_login_at?: string | null;
  last_activity_at?: string | null;
  created_at?: string;
  profile?: AdminUserProfile | null;
}

export interface AdminUserDetail {
  id: number;
  uuid?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: UserStatus;
  is_active?: boolean;
  verification?: {
    email_verified?: boolean;
    email_verified_at?: string | null;
    phone_verified?: boolean;
    phone_verified_at?: string | null;
    id_verified?: boolean;
  };
  activity?: {
    last_login_at?: string | null;
    last_activity_at?: string | null;
    login_attempts?: number;
    locked_until?: string | null;
  };
  timestamps?: {
    created_at?: string;
    updated_at?: string;
  };
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
  user: AdminUserDetail;
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

export interface AdminUserLogsResponse {
  user_id: number;
  logs: AdminUserLog[];
  pagination: PaginationMeta;
}

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
  total_users: number;
  by_status: {
    active: number;
    inactive: number;
    suspended: number;
    pending_verification: number;
  };
  verification: {
    email_verified: number;
    phone_verified: number;
    id_verified: number;
    fully_verified: number;
  };
  activity: {
    last_7_days: number;
    last_30_days: number;
    never_logged_in: number;
  };
  registrations: {
    today: number;
    this_week: number;
    this_month: number;
  };
  with_patient_profile: number;
  generated_at: string;
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
