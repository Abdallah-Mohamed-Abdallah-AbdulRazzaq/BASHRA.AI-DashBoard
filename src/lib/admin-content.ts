import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';
import {
  ContentListResponse,
  ContentSingleResponse,
  BaseContentListParams,
  DailyTip,
  DailyTipPayload,
  MedicalArticle,
  MedicalArticlePayload,
  SkinDisease,
  SkinDiseasePayload,
  AdvancedStatisticsResponse,
  AdvancedSearchParams,
  BulkStatusPayload,
  ExportParams
} from '@/types/admin-content';

// ---------------------------------------------------------
// Daily Tips
// ---------------------------------------------------------

export async function getDailyTips(params?: BaseContentListParams): Promise<ContentListResponse<DailyTip>> {
  return apiGet<ContentListResponse<DailyTip>>('/api/health-tips/daily-tips', { params: { ...params, lang: 'all' } as unknown as Record<string, string | number> });
}

export async function getActiveDailyTips(): Promise<ContentListResponse<DailyTip>> {
  return apiGet<ContentListResponse<DailyTip>>('/api/health-tips/daily-tips/active', { params: { lang: 'all' } });
}

export async function getLatestDailyTip(): Promise<ContentSingleResponse<DailyTip>> {
  return apiGet<ContentSingleResponse<DailyTip>>('/api/health-tips/daily-tips/latest');
}

export async function getDailyTipById(id: number): Promise<ContentSingleResponse<DailyTip>> {
  return apiGet<ContentSingleResponse<DailyTip>>(`/api/health-tips/daily-tips/${id}`, { params: { lang: 'all' } });
}

export async function createDailyTip(payload: DailyTipPayload): Promise<ContentSingleResponse<DailyTip>> {
  return apiPost<ContentSingleResponse<DailyTip>>('/api/health-tips/daily-tips', payload);
}

export async function updateDailyTip(id: number, payload: DailyTipPayload): Promise<ContentSingleResponse<DailyTip>> {
  return apiPut<ContentSingleResponse<DailyTip>>(`/api/health-tips/daily-tips/${id}`, payload);
}

export async function toggleDailyTipStatus(id: number): Promise<{ success: boolean; message?: string }> {
  return apiPatch<{ success: boolean; message?: string }>(`/api/health-tips/daily-tips/${id}/toggle-status`);
}

export async function deleteDailyTip(id: number): Promise<{ success: boolean; message?: string }> {
  return apiDelete<{ success: boolean; message?: string }>(`/api/health-tips/daily-tips/${id}`);
}

// ---------------------------------------------------------
// Medical Articles
// ---------------------------------------------------------

export async function getMedicalArticles(params?: BaseContentListParams): Promise<ContentListResponse<MedicalArticle>> {
  return apiGet<ContentListResponse<MedicalArticle>>('/api/health-tips/medical-articles', { params: { ...params, lang: 'all' } as unknown as Record<string, string | number> });
}

export async function getActiveMedicalArticles(): Promise<ContentListResponse<MedicalArticle>> {
  return apiGet<ContentListResponse<MedicalArticle>>('/api/health-tips/medical-articles/active', { params: { lang: 'all' } });
}

export async function getMedicalArticleById(id: number): Promise<ContentSingleResponse<MedicalArticle>> {
  return apiGet<ContentSingleResponse<MedicalArticle>>(`/api/health-tips/medical-articles/${id}`, { params: { lang: 'all' } });
}

export async function createMedicalArticle(payload: MedicalArticlePayload): Promise<ContentSingleResponse<MedicalArticle>> {
  return apiPost<ContentSingleResponse<MedicalArticle>>('/api/health-tips/medical-articles', payload);
}

export async function updateMedicalArticle(id: number, payload: MedicalArticlePayload): Promise<ContentSingleResponse<MedicalArticle>> {
  return apiPut<ContentSingleResponse<MedicalArticle>>(`/api/health-tips/medical-articles/${id}`, payload);
}

export async function toggleMedicalArticleStatus(id: number): Promise<{ success: boolean; message?: string }> {
  return apiPatch<{ success: boolean; message?: string }>(`/api/health-tips/medical-articles/${id}/toggle-status`);
}

export async function deleteMedicalArticle(id: number): Promise<{ success: boolean; message?: string }> {
  return apiDelete<{ success: boolean; message?: string }>(`/api/health-tips/medical-articles/${id}`);
}

// ---------------------------------------------------------
// Skin Diseases
// ---------------------------------------------------------

export async function getSkinDiseases(params?: BaseContentListParams): Promise<ContentListResponse<SkinDisease>> {
  return apiGet<ContentListResponse<SkinDisease>>('/api/health-tips/skin-diseases', { params: { ...params, lang: 'all' } as unknown as Record<string, string | number> });
}

export async function getActiveSkinDiseases(): Promise<ContentListResponse<SkinDisease>> {
  return apiGet<ContentListResponse<SkinDisease>>('/api/health-tips/skin-diseases/active', { params: { lang: 'all' } });
}

export async function getSkinDiseaseById(id: number): Promise<ContentSingleResponse<SkinDisease>> {
  return apiGet<ContentSingleResponse<SkinDisease>>(`/api/health-tips/skin-diseases/${id}`, { params: { lang: 'all' } });
}

export async function createSkinDisease(payload: SkinDiseasePayload): Promise<ContentSingleResponse<SkinDisease>> {
  return apiPost<ContentSingleResponse<SkinDisease>>('/api/health-tips/skin-diseases', payload);
}

export async function updateSkinDisease(id: number, payload: SkinDiseasePayload): Promise<ContentSingleResponse<SkinDisease>> {
  return apiPut<ContentSingleResponse<SkinDisease>>(`/api/health-tips/skin-diseases/${id}`, payload);
}

export async function toggleSkinDiseaseStatus(id: number): Promise<{ success: boolean; message?: string }> {
  return apiPatch<{ success: boolean; message?: string }>(`/api/health-tips/skin-diseases/${id}/toggle-status`);
}

export async function deleteSkinDisease(id: number): Promise<{ success: boolean; message?: string }> {
  return apiDelete<{ success: boolean; message?: string }>(`/api/health-tips/skin-diseases/${id}`);
}

// ---------------------------------------------------------
// Advanced APIs (Service-only as per UI specs)
// ---------------------------------------------------------

export async function getHealthContentStatistics(): Promise<AdvancedStatisticsResponse> {
  return apiGet<AdvancedStatisticsResponse>('/api/health-tips/advanced/statistics');
}

export async function searchHealthContent(params: AdvancedSearchParams): Promise<any> {
  return apiGet<any>('/api/health-tips/advanced/search', { params: { ...params, lang: 'all' } as unknown as Record<string, string | number> });
}

export async function getRecentHealthContent(limit?: number): Promise<any> {
  return apiGet<any>('/api/health-tips/advanced/recent', { params: limit ? { limit, lang: 'all' } : { lang: 'all' } });
}

export async function getHealthContentByAdmin(adminId: number, params?: BaseContentListParams): Promise<any> {
  return apiGet<any>(`/api/health-tips/advanced/by-admin/${adminId}`, { params: { ...params, lang: 'all' } as unknown as Record<string, string | number> });
}

export async function bulkUpdateContentStatus(payload: BulkStatusPayload): Promise<{ success: boolean; message?: string }> {
  return apiPatch<{ success: boolean; message?: string }>('/api/health-tips/advanced/bulk-status', payload);
}

export async function exportHealthContent(params?: ExportParams): Promise<any> {
  return apiGet<any>('/api/health-tips/advanced/export', { params: params as unknown as Record<string, string | number> });
}

export async function validateContentPayload(type: string, data: any): Promise<{ success: boolean; message?: string }> {
  return apiPost<{ success: boolean; message?: string }>('/api/health-tips/advanced/validate', { type, data });
}
