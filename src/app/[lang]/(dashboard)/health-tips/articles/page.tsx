import React from "react";
import { getDictionary } from "@/lib/dictionary";
import ArticlesView from "@/components/health-tips/articles-view";

export default async function ArticlesPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <ArticlesView t={dictionary} />;
}