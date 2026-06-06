import React from "react";
import { getDictionary } from "@/lib/dictionary";
import RegionsView from "@/components/address-management/regions-view";

export default async function RegionsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <RegionsView t={dictionary} lang={params.lang} />;
}