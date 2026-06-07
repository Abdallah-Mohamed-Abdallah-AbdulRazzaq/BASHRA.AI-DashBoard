import React from "react";
import { getDictionary } from "@/lib/dictionary";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStatsSection } from "@/components/dashboard/dashboard-stats-section";
import { 
  AppointmentStatistics, 
  PopularDoctors, 
  AppointmentsWidget,
  AllAppointmentsTable,
  PendingDoctorsWidget
} from "@/components/dashboard/dashboard-widgets";

export default async function AdminDashboardPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header */}
      <DashboardHeader 
        title={dictionary.dashboard.title}
      />

      {/* 2. Top Stats Section (Grid 4) — Real API Data */}
      <DashboardStatsSection />

      {/* 3. Middle Section: Charts & Widgets */}
      <div className="grid grid-cols-12 gap-6 w-full">
        
        {/* Left Column spans 8/12 on large screens */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
           <AppointmentStatistics t={dictionary} />
           <PopularDoctors t={dictionary} />
           <AllAppointmentsTable t={dictionary} />
        </div>

        {/* Right Column spans 4/12 on large screens */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
           <AppointmentsWidget t={dictionary} />
           <PendingDoctorsWidget t={dictionary} />
        </div>
      </div>
      
    </div>
  );
}