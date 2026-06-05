import React from "react";
import { getDictionary } from "@/lib/dictionary";
import PatientsView from "@/components/clinic/patients/patients-view";

export default async function PatientsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <PatientsView t={dictionary} />;
}