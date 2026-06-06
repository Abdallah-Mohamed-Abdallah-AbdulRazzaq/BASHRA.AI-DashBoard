import React from "react";
import { getDictionary } from "@/lib/dictionary";
import PrescriptionsView from "@/components/clinic/prescriptions/prescriptions-view";

export default async function PrescriptionsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <PrescriptionsView t={dictionary} lang={params.lang} />;
}
