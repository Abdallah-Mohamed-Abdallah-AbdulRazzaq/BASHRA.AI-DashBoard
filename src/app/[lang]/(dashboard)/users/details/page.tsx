import { getDictionary } from "@/lib/dictionary";
import PatientDetailsView from "@/components/users/details/patient-details-view";

export default async function UserDetailsPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: "en" | "ar" };
  searchParams: { id?: string };
}) {
  const dict = await getDictionary(lang);
  
  if (!searchParams.id) {
    return <div className="p-6">Invalid User ID</div>;
  }

  return (
    <div className="flex-1 w-full space-y-6">
      <PatientDetailsView t={dict} />
    </div>
  );
}
