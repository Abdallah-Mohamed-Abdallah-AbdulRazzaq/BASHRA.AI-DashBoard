import React from "react";
import { getDictionary } from "@/lib/dictionary";
import CountriesView from "@/components/address-management/countries-view";

export default async function CountriesPage({ params }: { params: { lang: string } }) {
  // جلب الترجمة على الخادم وتمريرها للمكون
  const dictionary = await getDictionary(params.lang);

  return <CountriesView t={dictionary} lang={params.lang} />;
}