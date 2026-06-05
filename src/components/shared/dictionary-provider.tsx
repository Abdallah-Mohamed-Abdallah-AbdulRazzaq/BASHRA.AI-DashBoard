"use client";

import React, { createContext, useContext } from "react";

// تعريف نوع البيانات (يمكن تحسينه باستيراد التايب من ملف الـ json)
type Dictionary = Record<string, any>;

interface DictionaryContextType {
  dictionary: Dictionary;
  lang: string;
  isRTL: boolean;
}

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function DictionaryProvider({
  children,
  dictionary,
  lang,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  lang: string;
}) {
  const isRTL = lang === 'ar';

  return (
    <DictionaryContext.Provider value={{ dictionary, lang, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "font-cairo" : "font-inter"}>
        {children}
      </div>
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
}