import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";
import { ApiSuccessResponse } from "@/types/api";
import {
  AdminFeature,
  AdminPackage,
  PackageFeatureRelation,
  CreateFeaturePayload,
  UpdateFeaturePayload,
  CreatePackagePayload,
  UpdatePackagePayload,
  AddPackageFeaturePayload,
  UpdatePackageFeaturePayload,
  BulkAddPackageFeaturesPayload,
} from "@/types/admin-packages";

// --- Features Management ---

export const getAdminFeatures = (params?: { is_active?: boolean | string }) => {
  return apiGet<ApiSuccessResponse<AdminFeature[]>>("/api/features", { params: params as any });
};

export const getAdminFeatureById = (id: number) => {
  return apiGet<ApiSuccessResponse<AdminFeature>>(`/api/features/${id}`);
};

export const createAdminFeature = (payload: CreateFeaturePayload) => {
  return apiPost<ApiSuccessResponse<AdminFeature>>("/api/features", payload);
};

export const updateAdminFeature = (id: number, payload: UpdateFeaturePayload) => {
  return apiPut<ApiSuccessResponse<AdminFeature>>(`/api/features/${id}`, payload);
};

export const toggleAdminFeatureStatus = (id: number) => {
  return apiPatch<ApiSuccessResponse<any>>(`/api/features/${id}/toggle-status`, {});
};

export const deleteAdminFeature = (id: number) => {
  return apiDelete<ApiSuccessResponse<any>>(`/api/features/${id}`);
};

// --- Packages Management ---

export const getAdminPackages = (params?: { is_active?: boolean | string; include_features?: boolean | string }) => {
  return apiGet<ApiSuccessResponse<AdminPackage[]>>("/api/packages", { params: params as any });
};

export const getAdminPackageById = (id: number) => {
  return apiGet<ApiSuccessResponse<AdminPackage>>(`/api/packages/${id}`);
};

export const createAdminPackage = (payload: CreatePackagePayload) => {
  return apiPost<ApiSuccessResponse<AdminPackage>>("/api/packages", payload);
};

export const updateAdminPackage = (id: number, payload: UpdatePackagePayload) => {
  return apiPut<ApiSuccessResponse<AdminPackage>>(`/api/packages/${id}`, payload);
};

export const toggleAdminPackageStatus = (id: number) => {
  return apiPatch<ApiSuccessResponse<any>>(`/api/packages/${id}/toggle-status`, {});
};

export const deleteAdminPackage = (id: number) => {
  return apiDelete<ApiSuccessResponse<any>>(`/api/packages/${id}`);
};

// --- Package Features Management ---

export const getPackageFeatures = (packageId: number) => {
  // Assuming it returns ApiSuccessResponse array of relations or just data
  return apiGet<ApiSuccessResponse<PackageFeatureRelation[]>>(`/api/package-features/package/${packageId}`);
};

export const getPackagesForFeature = (featureId: number) => {
  return apiGet<ApiSuccessResponse<PackageFeatureRelation[]>>(`/api/package-features/feature/${featureId}`);
};

export const addPackageFeature = (payload: AddPackageFeaturePayload) => {
  return apiPost<ApiSuccessResponse<PackageFeatureRelation>>("/api/package-features", payload);
};

export const bulkAddPackageFeatures = (payload: BulkAddPackageFeaturesPayload) => {
  return apiPost<ApiSuccessResponse<any>>("/api/package-features/bulk", payload);
};

export const updatePackageFeature = (id: number, payload: UpdatePackageFeaturePayload) => {
  return apiPut<ApiSuccessResponse<PackageFeatureRelation>>(`/api/package-features/${id}`, payload);
};

export const deletePackageFeature = (id: number) => {
  return apiDelete<ApiSuccessResponse<any>>(`/api/package-features/${id}`);
};
