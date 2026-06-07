export type DoctorStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export type DoctorApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type DoctorDocumentStatus = 'pending' | 'approved' | 'rejected';

export type SortOrder = 'ASC' | 'DESC';

export type DoctorSortBy = 'created_at' | 'email' | 'status' | 'approval_status' | 'is_verified' | 'rating_average';

export type DoctorListParams = {
  page?: number;
  limit?: number;
  status?: DoctorStatus;
  approval_status?: DoctorApprovalStatus;
  is_verified?: boolean | string;
  search?: string;
  sort_by?: DoctorSortBy;
  sort_order?: SortOrder;
};

export type DoctorPendingParams = {
  page?: number;
  limit?: number;
};

export type DoctorListPagination = {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasMore?: boolean;
};

export type DoctorListItem = {
  id?: number;
  uuid?: string;
  email?: string;
  phone?: string;
  status?: DoctorStatus;
  is_active?: boolean | number;
  full_name?: string;
  specialty?: string;
  license_number?: string;
  approval_status?: DoctorApprovalStatus;
  is_verified?: boolean;
  profile_picture_url?: string;
  rating_average?: number;
  total_consultations?: number;
  created_at?: string;
};

export type DoctorListData = {
  data?: DoctorListItem[];
  pagination?: DoctorListPagination;
};

export type DoctorListResponse = {
  success: boolean;
  data?: DoctorListItem[];
  pagination?: DoctorListPagination;
};

export type DoctorStatisticsData = {
  total_doctors?: number;
  verified_doctors?: number;
  pending_doctors?: number;
  active_doctors?: number;
  inactive_doctors?: number;
  suspended_doctors?: number;
};

export type DoctorStatisticsResponse = {
  success: boolean;
  data?: DoctorStatisticsData;
};

export type DoctorTranslation = {
  full_name?: string;
  specialty?: string;
  sub_specialty?: string;
  biography?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
};

export type DoctorDetailData = {
  id?: number;
  uuid?: string;
  email?: string;
  phone?: string;
  status?: DoctorStatus;
  is_active?: boolean | number;
  email_verified_at?: string;
  phone_verified_at?: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
  profile_id?: number;
  license_number?: string;
  years_of_experience?: number;
  is_verified?: boolean;
  verification_date?: string;
  verified_by?: number;
  approval_status?: DoctorApprovalStatus;
  rating_average?: number;
  rating_count?: number;
  total_consultations?: number;
  is_available?: boolean;
  verified_by_email?: string;
  verified_by_admin_type?: string;
  profile_picture_url?: string;
  profile?: DoctorProfileData;
  translations?: Record<string, DoctorTranslation>;
  contact_details?: DoctorContactDetailsData;
};

export type DoctorProfileData = {
  id?: number;
  doctor_id?: number;
  license_number?: string;
  profile_picture_url?: string;
  years_of_experience?: number;
  medical_school?: string;
  graduation_year?: number;
  board_certifications?: string[];
  languages_spoken?: string[];
  is_verified?: boolean;
  verification_date?: string;
  verified_by?: number;
  approval_status?: DoctorApprovalStatus;
  rating_average?: number;
  rating_count?: number;
  total_consultations?: number;
  is_available?: boolean;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  emergency_contact_phone?: string;
  timezone?: string;
  language_preference?: string;
  created_at?: string;
  updated_at?: string;
};

export type DoctorDetailResponse = {
  success: boolean;
  data?: DoctorDetailData;
};

export type DoctorPersonalData = {
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  emergency_contact_phone?: string;
  timezone?: string;
  language_preference?: string;
  translations?: Record<string, DoctorTranslation>;
};

export type DoctorProfessionalData = {
  license_number?: string;
  years_of_experience?: number;
  medical_school?: string;
  graduation_year?: number;
  board_certifications?: string[];
  languages_spoken?: string[];
  translations?: Record<string, DoctorTranslation>;
};

export type DoctorVerificationDocument = {
  id?: number;
  doctor_id?: number;
  document_type?: string;
  file_url?: string;
  status?: DoctorDocumentStatus;
  rejection_reason?: string;
  uploaded_at?: string;
  verified_at?: string;
  verified_by?: number;
};

export type DoctorDocumentsData = DoctorVerificationDocument[];

export type DoctorDocumentsResponse = {
  success: boolean;
  data?: DoctorDocumentsData;
};

export type DoctorDocumentsSummaryData = {
  total?: number;
  approved?: number;
  pending?: number;
  rejected?: number;
};

export type DoctorDocumentsSummaryResponse = {
  success: boolean;
  data?: DoctorDocumentsSummaryData;
};

export type DoctorProfileCompleteData = {
  personal?: DoctorPersonalData;
  professional?: DoctorProfessionalData;
  documents?: DoctorVerificationDocument[];
  documents_summary?: DoctorDocumentsSummaryData;
};

export type DoctorProfileCompleteResponse = {
  success: boolean;
  data?: DoctorProfileCompleteData;
};

export type DoctorContactDetailsData = {
  id?: number;
  doctor_id?: number;
  whatsapp_number?: string;
  additional_phone?: string;
  personal_email?: string;
  contact_notes?: string;
  email?: string;
  phone?: string;
  emergency_contact_phone?: string;
  created_at?: string;
  updated_at?: string;
};

export type DoctorContactDetailsParams = {
  doctor_id?: number | string;
  page?: number;
  limit?: number;
  search?: string;
};

export type DoctorContactDetailsListResponse = {
  success: boolean;
  data?: DoctorContactDetailsData[];
  pagination?: DoctorListPagination;
};

export type DoctorContactDetailsByDoctorResponse = {
  success: boolean;
  data?: DoctorContactDetailsData;
};

export type UpdateDoctorStatusPayload = {
  status: DoctorStatus;
  reason?: string;
};

export type VerifyDoctorPayload = {
  is_verified: boolean;
  reason?: string;
};

export type UpdateDoctorVerificationStatusPayload = {
  is_verified: boolean;
  approval_status: DoctorApprovalStatus;
  reason?: string;
};

export type UpdateDoctorApprovalStatusPayload = {
  approval_status: DoctorApprovalStatus;
  reason?: string;
};

export type DoctorReasonPayload = {
  reason?: string;
};

export type BulkUpdateDoctorsStatusPayload = {
  doctorIds: number[];
  status: DoctorStatus;
  reason?: string;
};

export type UpdateDoctorDocumentStatusPayload = {
  status: DoctorDocumentStatus;
  rejection_reason?: string;
};

export type DeleteDoctorProfilePayload = {
  reason?: string;
};

export type DoctorActionResponse = {
  success: boolean;
  message_ar?: string;
  message_en?: string;
  data?: Record<string, unknown>;
};

export type UpdateDoctorPersonalDataPayload = {
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  emergency_contact_phone?: string;
  timezone?: string;
  language_preference?: string;
  translations?: Record<string, DoctorTranslation>;
};

export type UpdateDoctorProfessionalDataPayload = {
  license_number?: string;
  years_of_experience?: number;
  medical_school?: string;
  graduation_year?: number;
  board_certifications?: string[];
  languages_spoken?: string[];
  translations?: Record<string, DoctorTranslation>;
};
