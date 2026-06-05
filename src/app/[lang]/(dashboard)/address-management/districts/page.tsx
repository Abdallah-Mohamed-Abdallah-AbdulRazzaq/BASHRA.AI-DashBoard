import React from "react";
import { getDictionary } from "@/lib/dictionary";
import DistrictsView from "@/components/address-management/districts-view";

export default async function DistrictsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <DistrictsView t={dictionary} />;
}