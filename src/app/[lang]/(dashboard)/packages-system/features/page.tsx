import React from "react";
import { getDictionary } from "@/lib/dictionary";
import FeaturesView from "@/components/packages-system/features-view";

export default async function FeaturesPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <FeaturesView t={dictionary} />;
}