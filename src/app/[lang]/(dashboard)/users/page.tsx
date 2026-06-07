import { getDictionary } from "@/lib/dictionary";
import { UsersView } from "@/components/users/users-view";

export default async function UsersPage({
  params: { lang },
}: {
  params: { lang: "en" | "ar" };
}) {
  const dict = await getDictionary(lang);
  
  return (
    <div className="flex-1 w-full space-y-6">
      <UsersView t={dict} />
    </div>
  );
}
