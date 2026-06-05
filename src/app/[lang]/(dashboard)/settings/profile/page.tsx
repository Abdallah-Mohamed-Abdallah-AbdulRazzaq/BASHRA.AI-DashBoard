import React from "react";
import { getDictionary } from "@/lib/dictionary";
import ProfileSettingsView from "@/components/settings/profile-settings-view";

export default async function ProfileSettingsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <ProfileSettingsView t={dictionary} />;
}