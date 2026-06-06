import React from "react";
import { getDictionary } from "@/lib/dictionary";
import MedicationsView from "@/components/clinic/medications/medications-view";

export default async function MedicationsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <MedicationsView t={dictionary} lang={params.lang} />;
}
