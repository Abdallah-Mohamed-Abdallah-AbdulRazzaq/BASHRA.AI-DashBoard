"use client";

import React, { useState } from "react";
import { PatientCard } from "./patient-card";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons/dashboard-icons";

interface PatientGridProps {
  t: any;
}

export const PatientGrid = ({ t }: PatientGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // توليد بيانات وهمية لـ 40 مريض للتجربة
  const patients = Array.from({ length: 40 }, (_, i) => {
    const isMale = i % 2 === 0;
    const statuses: ("Active" | "In-patient" | "Discharged")[] = ["Active", "In-patient", "Discharged"];
    const status = statuses[i % 3];

    return {
      id: i + 1,
      patientId: `#PT-${1000 + i}`,
      name: isMale ? "James Anderson" : "Emma Watson",
      age: isMale ? "45 Years" : "29 Years",
      gender: isMale ? "Male" : "Female",
      bloodGroup: isMale ? "O+" : "AB-",
      image: isMale 
        ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop" 
        : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
      lastVisit: "15 Feb 2026",
      status: status
    };
  });

  // Pagination Logic
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const currentData = patients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentData.map((patient) => (
          <PatientCard key={patient.id} t={t} patient={patient} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {/* زر السابق */}
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white shadow-sm"
        >
          <ChevronLeftIcon />
        </button>

        {/* أرقام الصفحات */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-[8px] text-[13px] font-medium transition-all shadow-sm",
              currentPage === page 
                ? "bg-[#2E37A4] text-white shadow-md shadow-indigo-200" 
                : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
            )}
          >
            {page}
          </button>
        ))}

        {/* زر التالي */}
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white shadow-sm"
        >
          <ChevronRightIcon />
        </button>
      </div>

    </div>
  );
};