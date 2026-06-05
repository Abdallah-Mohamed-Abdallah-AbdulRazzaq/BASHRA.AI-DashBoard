import React from "react";
import { getDictionary } from "@/lib/dictionary";
import PackagesView from "@/components/packages-system/packages-view";

export default async function PackagesPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <PackagesView t={dictionary} />;
}