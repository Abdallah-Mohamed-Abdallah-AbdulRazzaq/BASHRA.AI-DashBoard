"use client";

import React, { useState } from "react";
import { DoctorHeader } from "@/components/clinic/doctors/doctor-header";
import { DoctorGrid } from "@/components/clinic/doctors/doctor-grid";
import { DoctorList } from "@/components/clinic/doctors/doctor-list";


interface DoctorsViewProps {
  t: any; // Dictionary passed from server
}

export default function DoctorsView({ t }: DoctorsViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="flex flex-col items-start gap-6 w-full p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* --- 1. The Smart Header --- */}
      <DoctorHeader 
        t={t} 
        view={viewMode} 
        setView={setViewMode} 
        totalDoctors={565} 
      />

      {/* --- 2. Content Area --- */}
      <div className="w-full">
        {viewMode === "list" ? (
        //   <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
        //     Doctors List Table Component Will Go Here
        //   </div>
          <DoctorList t={t} />
        ) : (
        //   <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
        //     Doctors Grid Cards Component Will Go Here
        //   </div>
          <DoctorGrid t={t} />
        )}
      </div>

    </div>
  );
}