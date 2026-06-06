import { apiGet } from './api';
import type {
  DashboardUserStats,
  DashboardDoctorStats,
  DashboardAppointmentStats,
  DashboardAIUsageOverview,
  ApiDataResponse,
} from '@/types/admin-dashboard';

export async function getUserStats(): Promise<DashboardUserStats> {
  const res = await apiGet<ApiDataResponse<DashboardUserStats>>('/api/admin/users/stats');
  return res.data;
}

export async function getDoctorStatistics(): Promise<DashboardDoctorStats> {
  const res = await apiGet<ApiDataResponse<DashboardDoctorStats>>('/api/admin/doctors/statistics');
  return res.data;
}

export async function getAppointmentStatistics(): Promise<DashboardAppointmentStats> {
  const res = await apiGet<ApiDataResponse<DashboardAppointmentStats>>('/api/admin/appointments/statistics');
  return res.data;
}

export async function getAIUsageOverview(periodKey: string): Promise<DashboardAIUsageOverview> {
  const res = await apiGet<ApiDataResponse<DashboardAIUsageOverview>>('/api/admin/ai-usage/overview', {
    params: { period_key: periodKey },
  });
  return res.data;
}
