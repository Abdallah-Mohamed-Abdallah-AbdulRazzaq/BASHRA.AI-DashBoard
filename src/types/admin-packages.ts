export interface PackageFeatureRelation {
  id: number;
  package_id: number;
  feature_id: number;
  feature_value?: string;
  is_included: boolean;
  feature?: AdminFeature;
}

export interface AdminFeature {
  id: number;
  name?: string;
  name_ar: string;
  name_en?: string;
  unit?: string;
  unit_ar?: string;
  unit_en?: string;
  is_active: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminPackage {
  id: number;
  name?: string;
  name_ar: string;
  name_en?: string;
  secondary_name?: string;
  secondary_name_ar?: string;
  secondary_name_en?: string;
  duration_days: number;
  price: string | number;
  currency_code?: string;
  is_active: boolean | number;
  created_at?: string;
  updated_at?: string;
  features?: PackageFeatureRelation[];
}

export interface CreateFeaturePayload {
  name_ar: string;
  name_en?: string;
  unit_ar?: string;
  unit_en?: string;
  is_active?: boolean;
}

export interface UpdateFeaturePayload extends Partial<CreateFeaturePayload> {}

export interface CreatePackagePayload {
  name_ar: string;
  name_en?: string;
  secondary_name_ar?: string;
  secondary_name_en?: string;
  duration_days: number;
  price: number;
  currency_code?: string;
  is_active?: boolean;
}

export interface UpdatePackagePayload extends Partial<CreatePackagePayload> {}

export interface AddPackageFeaturePayload {
  package_id: number;
  feature_id: number;
  feature_value?: string;
  is_included: boolean;
}

export interface UpdatePackageFeaturePayload {
  feature_value?: string;
  is_included?: boolean;
}

export interface BulkAddPackageFeaturesPayload {
  package_id: number;
  features: Omit<AddPackageFeaturePayload, 'package_id'>[];
}
