import React from "react";
import { getDictionary } from "@/lib/dictionary";
import SkinDiseasesView from "@/components/health-tips/skin-diseases-view";

export default async function SkinDiseasesPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <SkinDiseasesView t={dictionary} />;
}