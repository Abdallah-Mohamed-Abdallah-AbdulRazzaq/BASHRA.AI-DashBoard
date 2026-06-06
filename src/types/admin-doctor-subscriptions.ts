import { AdminPackage } from "./admin-packages";

export type DoctorSubscriptionStatus = 'active' | 'pending' | 'expired' | 'canceled';

export interface AdminDoctorSubscription {
  id: number;
  doctor_id: number;
  package_id: number;
  subscription_status: DoctorSubscriptionStatus;
  is_trial: boolean | number;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
  approved_by_admin_id?: number | null;
  last_modified_by_admin_id?: number | null;
  
  // Relations that might be included
  package?: AdminPackage;
  doctor?: {
    id?: number;
    uuid?: string;
    full_name?: string;
    name_en?: string;
    name_ar?: string;
    email?: string;
    phone?: string;
    profile_picture_url?: string;
    [key: string]: unknown;
  };
}

export interface GetAdminSubscriptionsParams {
  status?: DoctorSubscriptionStatus | string;
  doctor_id?: number;
  package_id?: number;
}

export interface UpdateDoctorSubscriptionPayload {
  subscription_status?: DoctorSubscriptionStatus;
  is_trial?: boolean;
  start_date?: string;
  end_date?: string;
}

export interface ExpireDoctorSubscriptionPayload {
  reason?: string;
}
