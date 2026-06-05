import React from 'react';
import { getDictionary } from '@/lib/dictionary';
import { DictionaryProvider } from '@/components/shared/dictionary-provider';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    // تمرير القاموس واللغة لجميع المكونات الداخلية
    <DictionaryProvider dictionary={dictionary} lang={params.lang}>
      {children}
    </DictionaryProvider>
  );
}