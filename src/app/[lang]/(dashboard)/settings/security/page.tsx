import React from "react";
import { getDictionary } from "@/lib/dictionary";
import SecuritySettingsView from "@/components/settings/security-settings-view";

export default async function SecuritySettingsPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);
  return <SecuritySettingsView t={dictionary as Record<string, Record<string, string>>} />;
}
