export type AdminType = 'super_admin' | 'system_admin' | 'clinic_admin';

export type AdminSession = {
  id: number;
  uuid?: string;
  email: string;
  phone?: string | null;
  admin_type?: AdminType;
  status?: string;
  is_active?: boolean | number;
  full_name?: string | null;
  profile_picture_url?: string | null;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  message_ar?: string;
  message_en?: string;
  data: T;
};

export type ApiErrorResponse = {
  success?: false;
  error?: string;
  message?: string;
  message_ar?: string;
  message_en?: string;
  reason?: string;
  errors?: unknown;
};

export type PaginationMeta = {
  current_page?: number;
  total_pages?: number;
  total_items?: number;
  items_per_page?: number;
  has_next?: boolean;
  has_previous?: boolean;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type ApiResponseData<T> = {
  data: T;
  pagination?: PaginationMeta;
  [key: string]: unknown;
};

export type AdminProfileTranslation = {
  full_name?: string;
  job_title?: string;
  department?: string;
};

export type AdminCompleteProfile = {
  account: {
    id: number;
    uuid?: string;
    email: string;
    phone?: string | null;
    admin_type: AdminType;
    status: string;
    is_active: number;
  };
  profile: {
    id: number;
    admin_id: number;
    date_of_birth?: string | null;
    gender?: string | null;
    nationality?: string | null;
    profile_picture_url?: string | null;
    emergency_contact_phone?: string | null;
    timezone?: string;
    language_preference?: string;
    hire_date?: string | null;
    full_name?: string | null;
    job_title?: string | null;
    department?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_relationship?: string | null;
  };
  translations: {
    ar?: AdminProfileTranslation;
    en?: AdminProfileTranslation;
  };
};

export type PictureUploadResponse = {
  success: true;
  message?: string;
  data: {
    profile_picture_url: string;
    file_uuid: string;
    file_id: number;
  };
};
