import React, { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import DoctorDetailsView from "@/components/clinic/doctors/details/doctor-details-view";

export default async function DoctorDetailsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DoctorDetailsView t={dictionary} />
    </Suspense>
  );
}