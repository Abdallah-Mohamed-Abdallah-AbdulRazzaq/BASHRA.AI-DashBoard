import React from "react";
import { getDictionary } from "@/lib/dictionary";
import DoctorsView from "@/components/clinic/doctors/doctors-view"; // استدعاء المكون الجديد

export default async function DoctorsPage({ params }: { params: { lang: string } }) {
  // 1. Fetch Dictionary on Server
  const dictionary = await getDictionary(params.lang);

  // 2. Pass it to the Client Component
  return <DoctorsView t={dictionary} />;
}