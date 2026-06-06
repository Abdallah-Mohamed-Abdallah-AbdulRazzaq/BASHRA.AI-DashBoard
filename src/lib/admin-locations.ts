import { apiGet, apiDelete, apiRequest } from "./api";
import { ApiSuccessResponse } from "@/types/api";
import {
  LocationEntity,
  GetLocationsParams,
  CreateLocationFormData,
  UpdateLocationFormData,
  LocationHierarchy,
} from "@/types/admin-locations";

const BASE_PATH = "/api/countries-cities";

export const AdminLocationsService = {
  getLocations: async (
    params?: GetLocationsParams
  ): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return apiGet<ApiSuccessResponse<LocationEntity[]>>(BASE_PATH, { params: params as Record<string, any> });
  },

  getCountries: async (lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return apiGet<ApiSuccessResponse<LocationEntity[]>>(`${BASE_PATH}/countries`, { params: { lang } });
  },

  getCities: async (countryId: number, lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return apiGet<ApiSuccessResponse<LocationEntity[]>>(`${BASE_PATH}/cities/${countryId}`, { params: { lang } });
  },

  getRegions: async (cityId: number, lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return apiGet<ApiSuccessResponse<LocationEntity[]>>(`${BASE_PATH}/regions/${cityId}`, { params: { lang } });
  },

  getDistricts: async (regionId: number, lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return apiGet<ApiSuccessResponse<LocationEntity[]>>(`${BASE_PATH}/districts/${regionId}`, { params: { lang } });
  },

  getHierarchy: async (
    id: number,
    lang: "ar" | "en" = "ar"
  ): Promise<ApiSuccessResponse<LocationHierarchy>> => {
    return apiGet<ApiSuccessResponse<LocationHierarchy>>(`${BASE_PATH}/hierarchy/${id}`, {
      params: { lang },
    });
  },

  searchLocations: async (
    q: string,
    level_type?: string,
    lang: "ar" | "en" = "ar"
  ): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return apiGet<ApiSuccessResponse<LocationEntity[]>>(`${BASE_PATH}/search`, {
      params: { q, level_type, lang },
    });
  },

  getLocationById: async (
    id: number,
    lang: "ar" | "en" = "ar"
  ): Promise<ApiSuccessResponse<LocationEntity>> => {
    return apiGet<ApiSuccessResponse<LocationEntity>>(`${BASE_PATH}/${id}`, {
      params: { lang },
    });
  },

  createLocation: async (
    data: CreateLocationFormData
  ): Promise<ApiSuccessResponse<LocationEntity>> => {
    const formData = new FormData();
    formData.append("name_ar", data.name_ar);
    formData.append("name_en", data.name_en);
    formData.append("level_type", data.level_type);
    if (data.parent_id) {
      formData.append("parent_id", String(data.parent_id));
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    return apiRequest<ApiSuccessResponse<LocationEntity>>(BASE_PATH, {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },

  updateLocation: async (
    id: number,
    data: UpdateLocationFormData
  ): Promise<ApiSuccessResponse<LocationEntity>> => {
    const formData = new FormData();
    if (data.name_ar) formData.append("name_ar", data.name_ar);
    if (data.name_en) formData.append("name_en", data.name_en);
    if (data.parent_id) formData.append("parent_id", String(data.parent_id));
    if (data.image) formData.append("image", data.image);

    return apiRequest<ApiSuccessResponse<LocationEntity>>(`${BASE_PATH}/${id}`, {
      method: "PUT",
      body: formData,
      isFormData: true,
    });
  },

  deleteLocation: async (id: number): Promise<ApiSuccessResponse<null>> => {
    return apiDelete<ApiSuccessResponse<null>>(`${BASE_PATH}/${id}`);
  },
};
