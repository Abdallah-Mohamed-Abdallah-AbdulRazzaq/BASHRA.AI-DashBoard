"use client";

import React, { useState } from "react";
import { DoctorCard } from "./doctor-card";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons/dashboard-icons";

interface DoctorGridProps {
  t: any;
}

export const DoctorGrid = ({ t }: DoctorGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Generate 40 Dummy Doctors
  const doctors = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: i % 2 === 0 ? "Dr. Mick Thompson" : "Dr. Sarah Johnson",
    specialty: i % 2 === 0 ? "Cardiologist" : "Orthopedic Surgeon",
    image: i % 2 === 0 
      ? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop" 
      : "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&auto=format&fit=crop",
    available: "Mon, 20 Jan 2025",
    price: i % 2 === 0 ? "$499" : "$450"
  }));

  // Pagination Logic
  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const currentData = doctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentData.map((doctor) => (
          <DoctorCard key={doctor.id} t={t} doctor={doctor} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {/* Prev Button */}
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white"
        >
          <ChevronLeftIcon />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-[8px] text-[13px] font-medium transition-all",
              currentPage === page 
                ? "bg-[#2E37A4] text-white shadow-md shadow-indigo-200" 
                : "bg-white border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4]"
            )}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 border border-[#E7E8EB] rounded-[8px] text-[#6C7688] hover:bg-white hover:text-[#2E37A4] hover:border-[#2E37A4] disabled:opacity-50 disabled:hover:border-[#E7E8EB] disabled:hover:text-[#6C7688] transition-all bg-white"
        >
          <ChevronRightIcon />
        </button>
      </div>

    </div>
  );
};