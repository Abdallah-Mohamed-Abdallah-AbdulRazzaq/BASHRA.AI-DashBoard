import { PaginationMeta } from "./api";

export type LocationLevel = "country" | "city" | "region" | "district";

export interface LocationEntity {
  id?: number;
  countries_cities_id?: number;
  name_ar: string;
  name_en: string;
  level_type: LocationLevel;
  parent_id?: number | null;
  image?: string | null;
  is_active?: boolean | number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetLocationsParams {
  level_type?: LocationLevel;
  parent_id?: number;
  lang?: "ar" | "en";
  q?: string;
}

export interface CreateLocationFormData {
  name_ar: string;
  name_en: string;
  level_type: LocationLevel;
  parent_id?: number;
  image?: File;
}

export interface UpdateLocationFormData {
  name_ar?: string;
  name_en?: string;
  parent_id?: number;
  image?: File;
}

export interface LocationHierarchy {
  full_hierarchy: LocationEntity[];
  country?: LocationEntity;
  city?: LocationEntity;
  region?: LocationEntity;
  district?: LocationEntity;
}
