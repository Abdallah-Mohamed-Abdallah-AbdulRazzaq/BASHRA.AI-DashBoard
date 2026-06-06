"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDictionary } from "@/components/shared/dictionary-provider";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  StatDoctorIcon, StatPatientIcon, StatAppointmentIcon, StatRevenueIcon,
  ChartDoctors, ChartPatients, ChartAppointment, ChartRevenue,
} from "@/components/ui/icons/dashboard-icons";
import {
  getUserStats,
  getDoctorStatistics,
  getAppointmentStatistics,
  getAIUsageOverview,
} from "@/lib/admin-dashboard";
import { getApiErrorMessage } from "@/lib/error-utils";
import type {
  DashboardUserStats,
  DashboardDoctorStats,
  DashboardAppointmentStats,
  DashboardAIUsageOverview,
} from "@/types/admin-dashboard";

type CardLoadState<T> = { data?: T; error?: string; loading: boolean };

function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return "—";
  const num = typeof val === "string" ? Number(val) : val;
  if (isNaN(num)) return String(val);
  return num.toLocaleString();
}

export function DashboardStatsSection() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const { dictionary } = useDictionary();
  const t = dictionary.dashboard || {};

  const [users, setUsers] = useState<CardLoadState<DashboardUserStats>>({ loading: true });
  const [doctors, setDoctors] = useState<CardLoadState<DashboardDoctorStats>>({ loading: true });
  const [appts, setAppts] = useState<CardLoadState<DashboardAppointmentStats>>({ loading: true });
  const [aiUsage, setAiUsage] = useState<CardLoadState<DashboardAIUsageOverview>>({ loading: true });
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const periodKey = new Date().toISOString().slice(0, 7);

    getUserStats()
      .then((data) => setUsers({ data, loading: false }))
      .catch((err) => {
        setUsers({ error: getApiErrorMessage(err, lang as "ar" | "en"), loading: false });
        setLoadError(getApiErrorMessage(err, lang as "ar" | "en"));
      });

    getDoctorStatistics()
      .then((data) => setDoctors({ data, loading: false }))
      .catch((err) => {
        setDoctors({ error: getApiErrorMessage(err, lang as "ar" | "en"), loading: false });
        setLoadError(getApiErrorMessage(err, lang as "ar" | "en"));
      });

    getAppointmentStatistics()
      .then((data) => setAppts({ data, loading: false }))
      .catch((err) => {
        setAppts({ error: getApiErrorMessage(err, lang as "ar" | "en"), loading: false });
        setLoadError(getApiErrorMessage(err, lang as "ar" | "en"));
      });

    getAIUsageOverview(periodKey)
      .then((data) => setAiUsage({ data, loading: false }))
      .catch((err) => {
        setAiUsage({ error: getApiErrorMessage(err, lang as "ar" | "en"), loading: false });
        setLoadError(getApiErrorMessage(err, lang as "ar" | "en"));
      });
  }, [lang]);

  const usersValue = users.data ? formatNumber(users.data.total_users) : "—";
  const usersBadge = users.data ? formatNumber(users.data.active_users) : "—";
  const usersBadgeText = t.active || "Active";

  const doctorsValue = doctors.data ? formatNumber(doctors.data.total_doctors) : "—";
  const doctorsBadge = doctors.data ? formatNumber(doctors.data.verified_doctors) : "—";
  const doctorsBadgeText = t.verified || "Verified";

  const apptsValue = appts.data ? formatNumber(appts.data.total) : "—";
  const apptsCompleted = appts.data ? formatNumber(appts.data.completed) : "—";
  const apptsBadgeText = t.completed || "Completed";

  const aiRequests = aiUsage.data?.counters?.total_requests
    ? formatNumber(aiUsage.data.counters.total_requests)
    : "—";
  const aiTokens = aiUsage.data?.counters?.tokens_used
    ? formatNumber(aiUsage.data.counters.tokens_used)
    : "—";

  const allLoading = users.loading && doctors.loading && appts.loading && aiUsage.loading;

  if (allLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col w-full bg-white border border-[#E7E8EB] rounded-[6px] p-5 gap-2 h-[160px] animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex flex-col items-end gap-2">
                <div className="w-14 h-5 rounded bg-gray-200" />
                <div className="w-16 h-3 rounded bg-gray-200" />
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-1">
              <div className="w-12 h-3 rounded bg-gray-200" />
              <div className="w-20 h-6 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      <StatsCard
        title={t.doctors || "Doctors"}
        value={doctorsValue}
        badgeValue={doctorsBadge}
        badgeText={doctorsBadgeText}
        badgeColor="bg-[#27AE60]"
        icon={<StatDoctorIcon />}
        iconBgColor="bg-[#2E37A4]"
        chart={<ChartDoctors />}
      />
      <StatsCard
        title={t.patients || "Patients"}
        value={usersValue}
        badgeValue={usersBadge}
        badgeText={usersBadgeText}
        badgeColor="bg-[#27AE60]"
        icon={<StatPatientIcon />}
        iconBgColor="bg-[#EF1E1E]"
        chart={<ChartPatients />}
      />
      <StatsCard
        title={t.appointments || "Appointments"}
        value={apptsValue}
        badgeValue={apptsCompleted}
        badgeText={apptsBadgeText}
        badgeColor="bg-[#27AE60]"
        icon={<StatAppointmentIcon />}
        iconBgColor="bg-[#2F80ED]"
        chart={<ChartAppointment />}
      />
      <StatsCard
        title={t.ai_requests || "AI Requests"}
        value={aiRequests}
        badgeValue={aiTokens}
        badgeText={dictionary.dashboard?.tokens_used || "Tokens Used"}
        badgeColor="bg-[#27AE60]"
        icon={<StatRevenueIcon />}
        iconBgColor="bg-[#27AE60]"
        chart={<ChartRevenue />}
      />
    </div>
  );
}
