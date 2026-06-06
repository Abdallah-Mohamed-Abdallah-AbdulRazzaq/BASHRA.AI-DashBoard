import React from "react";
import { getDictionary } from "@/lib/dictionary";
import FilesView from "@/components/files-management/files-view";

export default async function FilesManagementPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <FilesView t={dictionary} lang={params.lang} />;
}
