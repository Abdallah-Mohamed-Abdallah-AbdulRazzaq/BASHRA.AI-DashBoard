import React from "react";
import { getDictionary } from "@/lib/dictionary";
// سنقوم بإنشاء هذا المكون في الخطوة الخامسة، لكن نجهزه الآن
import PatientDetailsView from "@/components/clinic/patients/details/patient-details-view";

export default async function PatientDetailsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <PatientDetailsView t={dictionary} />;
}