"use client";

import React, { useState } from "react";
import { PatientHeader } from "./patient-header";
import { PatientGrid } from "./patient-grid";
import { PatientList } from "./patient-list"; // 👈 قمنا بفك التعليق

interface PatientsViewProps {
  t: any;
}

export default function PatientsView({ t }: PatientsViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="flex flex-col items-start gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. The Smart Header */}
      <PatientHeader 
        t={t} 
        view={viewMode} 
        setView={setViewMode} 
        totalPatients={1250} 
      />

      {/* 2. Content Area */}
      <div className="w-full">
        {viewMode === "list" ? (
          // 👈 تم تفعيل الـ List (Table)
          <PatientList t={t} />
        ) : (
          <PatientGrid t={t} />
        )}
      </div>

    </div>
  );
}