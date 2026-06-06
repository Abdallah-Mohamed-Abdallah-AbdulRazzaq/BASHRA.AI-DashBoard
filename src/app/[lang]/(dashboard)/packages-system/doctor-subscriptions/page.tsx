import React from "react";
import { getDictionary } from "@/lib/dictionary";
import DoctorSubscriptionsView from "@/components/packages-system/doctor-subscriptions-view";

export default async function DoctorSubscriptionsPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <DoctorSubscriptionsView t={dictionary} />;
}
