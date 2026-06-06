import { apiGet, apiPut, apiPatch, apiDelete } from "./api";
import { ApiSuccessResponse } from "@/types/api";
import {
  AdminDoctorSubscription,
  GetAdminSubscriptionsParams,
  UpdateDoctorSubscriptionPayload,
  ExpireDoctorSubscriptionPayload,
} from "@/types/admin-doctor-subscriptions";

export const getAdminDoctorSubscriptions = (params?: GetAdminSubscriptionsParams) => {
  return apiGet<ApiSuccessResponse<AdminDoctorSubscription[]>>("/api/doctor-subscriptions/admin/all", { params: params as any });
};

export const getAdminDoctorSubscriptionById = (id: number) => {
  return apiGet<ApiSuccessResponse<AdminDoctorSubscription>>(`/api/doctor-subscriptions/admin/${id}`);
};

export const approveAdminDoctorSubscription = (id: number) => {
  return apiPatch<ApiSuccessResponse<any>>(`/api/doctor-subscriptions/admin/${id}/approve`, {});
};

export const updateAdminDoctorSubscription = (id: number, payload: UpdateDoctorSubscriptionPayload) => {
  return apiPut<ApiSuccessResponse<AdminDoctorSubscription>>(`/api/doctor-subscriptions/admin/${id}`, payload);
};

export const expireAdminDoctorSubscription = (id: number, payload: ExpireDoctorSubscriptionPayload) => {
  return apiPatch<ApiSuccessResponse<any>>(`/api/doctor-subscriptions/admin/${id}/expire`, payload);
};

export const deleteAdminDoctorSubscription = (id: number) => {
  return apiDelete<ApiSuccessResponse<any>>(`/api/doctor-subscriptions/admin/${id}`);
};
