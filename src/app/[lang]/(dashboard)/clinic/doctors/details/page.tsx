import React from "react";
import { getDictionary } from "@/lib/dictionary";
import DoctorDetailsView from "@/components/clinic/doctors/details/doctor-details-view";

export default async function DoctorDetailsPage({ params }: { params: { lang: string } }) {
  // 1. Fetch Dictionary on Server
  const dictionary = await getDictionary(params.lang);

  // 2. Pass to Client View
  return <DoctorDetailsView t={dictionary} />;
}