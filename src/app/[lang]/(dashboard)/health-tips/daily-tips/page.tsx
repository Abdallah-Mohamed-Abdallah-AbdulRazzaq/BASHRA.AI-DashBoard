import React from "react";
import { getDictionary } from "@/lib/dictionary";
import DailyTipsView from "@/components/health-tips/daily-tips-view";

export default async function DailyTipsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <DailyTipsView t={dictionary} />;
}