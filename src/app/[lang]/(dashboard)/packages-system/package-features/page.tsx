import React from "react";
import { getDictionary } from "@/lib/dictionary";
import PackageFeaturesView from "@/components/packages-system/package-features-view";

export default async function PackageFeaturesPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <PackageFeaturesView t={dictionary} />;
}