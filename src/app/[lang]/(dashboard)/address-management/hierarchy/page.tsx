import React from "react";
import { getDictionary } from "@/lib/dictionary";
import AddressHierarchyView from "@/components/address-management/address-hierarchy-view";

export default async function AddressHierarchyPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <AddressHierarchyView t={dictionary} />;
}