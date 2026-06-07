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

/**
 * Normalize a location entity returned from the backend.
 * The backend uses `countries_cities_id` as the primary key,
 * but the frontend works with `id`. This helper ensures `id`
 * is always populated so all downstream code can use `.id` safely.
 */
function normalizeLocation(item: LocationEntity): LocationEntity {
  return {
    ...item,
    id: item.id ?? item.countries_cities_id,
  };
}

function normalizeLocations(items: LocationEntity[]): LocationEntity[] {
  return items.map(normalizeLocation);
}

async function getAndNormalizeList(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiSuccessResponse<LocationEntity[]>> {
  const res = await apiGet<ApiSuccessResponse<LocationEntity[]>>(endpoint, { params });
  if (res.success && Array.isArray(res.data)) {
    return { ...res, data: normalizeLocations(res.data) };
  }
  return res;
}

export const AdminLocationsService = {
  /** GET /api/countries-cities — generic list with optional filters */
  getLocations: async (
    params?: GetLocationsParams
  ): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return getAndNormalizeList(BASE_PATH, params as Record<string, any>);
  },

  /** GET /api/countries-cities/countries — dedicated countries endpoint */
  getCountries: async (lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return getAndNormalizeList(`${BASE_PATH}/countries`, { lang });
  },

  /** GET /api/countries-cities/cities/:country_id — cities by country */
  getCities: async (countryId: number, lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return getAndNormalizeList(`${BASE_PATH}/cities/${countryId}`, { lang });
  },

  /** GET /api/countries-cities/regions/:city_id — regions by city */
  getRegions: async (cityId: number, lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return getAndNormalizeList(`${BASE_PATH}/regions/${cityId}`, { lang });
  },

  /** GET /api/countries-cities/districts/:region_id — districts by region */
  getDistricts: async (regionId: number, lang: "ar" | "en" = "ar"): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return getAndNormalizeList(`${BASE_PATH}/districts/${regionId}`, { lang });
  },

  /** GET /api/countries-cities/hierarchy/:id — full hierarchy for a location */
  getHierarchy: async (
    id: number,
    lang: "ar" | "en" = "ar"
  ): Promise<ApiSuccessResponse<LocationHierarchy>> => {
    const res = await apiGet<ApiSuccessResponse<LocationHierarchy>>(`${BASE_PATH}/hierarchy/${id}`, {
      params: { lang },
    });
    if (res.success && res.data) {
      return {
        ...res,
        data: {
          full_hierarchy: res.data.full_hierarchy
            ? normalizeLocations(res.data.full_hierarchy)
            : [],
          country: res.data.country ? normalizeLocation(res.data.country) : undefined,
          city: res.data.city ? normalizeLocation(res.data.city) : undefined,
          region: res.data.region ? normalizeLocation(res.data.region) : undefined,
          district: res.data.district ? normalizeLocation(res.data.district) : undefined,
        },
      };
    }
    return res;
  },

  /** GET /api/countries-cities/search?q=... */
  searchLocations: async (
    q: string,
    level_type?: string,
    lang: "ar" | "en" = "ar"
  ): Promise<ApiSuccessResponse<LocationEntity[]>> => {
    return getAndNormalizeList(`${BASE_PATH}/search`, { q, level_type, lang });
  },

  /** GET /api/countries-cities/:id */
  getLocationById: async (
    id: number,
    lang: "ar" | "en" = "ar"
  ): Promise<ApiSuccessResponse<LocationEntity>> => {
    const res = await apiGet<ApiSuccessResponse<LocationEntity>>(`${BASE_PATH}/${id}`, {
      params: { lang },
    });
    if (res.success && res.data) {
      return { ...res, data: normalizeLocation(res.data) };
    }
    return res;
  },

  /** POST /api/countries-cities — create location (multipart/form-data) */
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

    const res = await apiRequest<ApiSuccessResponse<LocationEntity>>(BASE_PATH, {
      method: "POST",
      body: formData,
      isFormData: true,
    });
    if (res.success && res.data) {
      return { ...res, data: normalizeLocation(res.data) };
    }
    return res;
  },

  /** PUT /api/countries-cities/:id — update location (multipart/form-data) */
  updateLocation: async (
    id: number,
    data: UpdateLocationFormData
  ): Promise<ApiSuccessResponse<LocationEntity>> => {
    const formData = new FormData();
    if (data.name_ar) formData.append("name_ar", data.name_ar);
    if (data.name_en) formData.append("name_en", data.name_en);
    if (data.parent_id) formData.append("parent_id", String(data.parent_id));
    if (data.image) formData.append("image", data.image);

    const res = await apiRequest<ApiSuccessResponse<LocationEntity>>(`${BASE_PATH}/${id}`, {
      method: "PUT",
      body: formData,
      isFormData: true,
    });
    if (res.success && res.data) {
      return { ...res, data: normalizeLocation(res.data) };
    }
    return res;
  },

  /** DELETE /api/countries-cities/:id */
  deleteLocation: async (id: number): Promise<ApiSuccessResponse<null>> => {
    return apiDelete<ApiSuccessResponse<null>>(`${BASE_PATH}/${id}`);
  },
};
