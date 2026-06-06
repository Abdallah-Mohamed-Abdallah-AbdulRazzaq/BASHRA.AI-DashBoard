import React from "react";
import { getDictionary } from "@/lib/dictionary";
import MedicalRecordsView from "@/components/clinic/medical-records/medical-records-view";

export default async function MedicalRecordsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <MedicalRecordsView t={dictionary} />;
}
