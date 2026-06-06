import React from "react";
import { getDictionary } from "@/lib/dictionary";
import RatingsView from "@/components/clinic/ratings/ratings-view";

export default async function RatingsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <RatingsView t={dictionary} lang={params.lang} />;
}
