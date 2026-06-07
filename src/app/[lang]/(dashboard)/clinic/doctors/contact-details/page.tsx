import { getDictionary } from "@/lib/dictionary";
import ContactDetailsView from "@/components/clinic/doctors/contact-details-view";

export default async function ContactDetailsPage({
  params: { lang },
}: {
  params: { lang: "en" | "ar" };
}) {
  const dict = await getDictionary(lang);
  return <ContactDetailsView t={dict} />;
}
