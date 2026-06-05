import React from "react";
import { getDictionary } from "@/lib/dictionary";
import CitiesView from "@/components/address-management/cities-view";

export default async function CitiesPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);

  return <CitiesView t={dictionary} />;
}