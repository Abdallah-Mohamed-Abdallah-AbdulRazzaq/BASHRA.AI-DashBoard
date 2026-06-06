export interface ContentPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ContentListResponse<T> {
  success: boolean;
  data: T[];
  pagination: ContentPagination;
  message?: string;
}

export interface ContentSingleResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface BaseContentListParams {
  page?: number;
  limit?: number;
  is_active?: string; // "true" or "false"
}

// ---------------------------------------------------------
// Daily Tips
// ---------------------------------------------------------

export interface DailyTip {
  id: number;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
}

export interface DailyTipPayload {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  is_active?: boolean;
}

// ---------------------------------------------------------
// Medical Articles
// ---------------------------------------------------------

export interface MedicalArticle {
  id: number;
  title_ar: string;
  title_en?: string;
  sub_title_ar?: string;
  sub_title_en?: string;
  description_ar: string;
  description_en?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
}

export interface MedicalArticlePayload {
  title_ar: string;
  title_en?: string;
  sub_title_ar?: string;
  sub_title_en?: string;
  description_ar: string;
  description_en?: string;
  is_active?: boolean;
}

// ---------------------------------------------------------
// Skin Diseases
// ---------------------------------------------------------

export interface SkinDisease {
  id: number;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  website_link?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
}

export interface SkinDiseasePayload {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  website_link?: string;
  is_active?: boolean;
}

// ---------------------------------------------------------
// Advanced API Types
// ---------------------------------------------------------

export interface ContentStatistics {
  total: number;
  active: number;
  inactive: number;
  today_created: number;
}

export interface AdvancedStatisticsResponse {
  success: boolean;
  data?: {
    daily_tips?: ContentStatistics;
    medical_articles?: ContentStatistics;
    skin_diseases?: ContentStatistics;
  };
  message?: string;
}

export interface AdvancedSearchParams {
  q: string; // min 2 chars
  page?: number;
  limit?: number;
}

export interface BulkStatusPayload {
  ids: number[];
  type: 'daily_tip' | 'medical_article' | 'skin_disease';
  status: boolean;
}

export interface ExportParams {
  type?: 'all' | 'daily_tips' | 'medical_articles' | 'skin_diseases';
  is_active?: 'true' | 'false';
  format?: 'json';
}
