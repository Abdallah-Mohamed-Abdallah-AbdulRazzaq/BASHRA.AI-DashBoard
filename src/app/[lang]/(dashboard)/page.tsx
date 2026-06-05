import React from "react";
import { getDictionary } from "@/lib/dictionary";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { 
  AppointmentStatistics, 
  PopularDoctors, 
  AppointmentsWidget,
  TopDepartments,   
  DoctorsSchedule,  
  IncomeByTreatment,
  AllAppointmentsTable,
  TopPatients,    
  RecentTransactions,
  LeaveRequests 
} from "@/components/dashboard/dashboard-widgets"; 
import { 
  StatDoctorIcon, StatPatientIcon, StatAppointmentIcon, StatRevenueIcon,
  ChartDoctors, ChartPatients, ChartAppointment, ChartRevenue
} from "@/components/ui/icons/dashboard-icons";

export default async function AdminDashboardPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header */}
      <DashboardHeader 
        title={dictionary.dashboard.title}
        btnNewAppointment={dictionary.dashboard.new_appointment}
        btnSchedule={dictionary.dashboard.schedule_availability}
      />

      {/* 2. Top Stats Section (Grid 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Doctors */}
        <StatsCard 
          title={dictionary.dashboard.doctors}
          value="247"
          badgeValue="+95%"
          badgeText={dictionary.dashboard.last_7_days}
          badgeColor="bg-[#27AE60]" 
          icon={<StatDoctorIcon />}
          iconBgColor="bg-[#2E37A4]" 
          chart={<ChartDoctors />}
        />
        {/* Patients */}
        <StatsCard 
          title={dictionary.dashboard.patients}
          value="4178"
          badgeValue="+25%"
          badgeText={dictionary.dashboard.last_7_days}
          badgeColor="bg-[#27AE60]" 
          icon={<StatPatientIcon />}
          iconBgColor="bg-[#EF1E1E]" 
          chart={<ChartPatients />}
        />
        {/* Appointments */}
        <StatsCard 
          title={dictionary.dashboard.appointments}
          value="12178"
          badgeValue="-15%"
          badgeText={dictionary.dashboard.last_7_days}
          badgeColor="bg-[#EF1E1E]" 
          icon={<StatAppointmentIcon />}
          iconBgColor="bg-[#2F80ED]" 
          chart={<ChartAppointment />}
        />
        {/* Revenue */}
        <StatsCard 
          title={dictionary.dashboard.revenue}
          value="$55,1240"
          badgeValue="+25%"
          badgeText={dictionary.dashboard.last_7_days}
          badgeColor="bg-[#27AE60]" 
          icon={<StatRevenueIcon />}
          iconBgColor="bg-[#27AE60]" 
          chart={<ChartRevenue />}
        />
      </div>

      {/* 3. Middle Section: Charts & Widgets */}
      <div className="grid grid-cols-12 gap-6 w-full">
        
        {/* Left Column (Stats + Doctors) spans 8/12 on large screens */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
           <AppointmentStatistics t={dictionary} />
           <PopularDoctors t={dictionary} />
        </div>

        {/* Right Column (Appointments Calendar) spans 4/12 on large screens */}
        <div className="col-span-12 lg:col-span-4 flex flex-col">
           <AppointmentsWidget t={dictionary} />
        </div>
      </div>

      {/* 4. Bottom Section: 3 Columns Grid (NEW SECTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Donut Chart */}
        <TopDepartments t={dictionary} />
        
        {/* Doctors List */}
        <DoctorsSchedule t={dictionary} />
        
        {/* Income List */}
        <IncomeByTreatment t={dictionary} />
      </div>
      
      {/* 5. All Appointments Table (NEW SECTION) */}
      <div className="w-full">
        <AllAppointmentsTable t={dictionary} />
      </div>

      {/* 6. Last Section: 3 Columns Grid (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <TopPatients t={dictionary} />
        <RecentTransactions t={dictionary} />
        <LeaveRequests t={dictionary} />
      </div>
      
    </div>
  );
}