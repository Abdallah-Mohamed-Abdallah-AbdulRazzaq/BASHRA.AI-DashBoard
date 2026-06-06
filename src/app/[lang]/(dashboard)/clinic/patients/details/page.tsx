import React, { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import PatientDetailsView from "@/components/clinic/patients/details/patient-details-view";

export default async function PatientDetailsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F5F6F8]">
        <div className="w-8 h-8 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PatientDetailsView t={dictionary} />
    </Suspense>
  );
}