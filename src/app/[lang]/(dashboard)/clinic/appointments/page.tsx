import React from "react";
import { getDictionary } from "@/lib/dictionary";
import AppointmentsView from "@/components/clinic/appointments/appointments-view";

export default async function AppointmentsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <AppointmentsView t={dictionary} />;
}
