import React from "react";
import { getDictionary } from "@/lib/dictionary";
import BlockedEntitiesView from "@/components/blocked-entities/blocked-entities-view";

export default async function BlockedEntitiesPage({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);
  return <BlockedEntitiesView t={dictionary.blocked_entities || {}} />;
}
