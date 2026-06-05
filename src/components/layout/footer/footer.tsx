"use client";

import React from "react";
import { useDictionary } from "@/components/shared/dictionary-provider";

export function Footer() {
  const { dictionary } = useDictionary();

  return (
    <footer className="flex w-full items-center justify-between border-t border-border bg-background px-6 py-2 transition-colors duration-300">
      <div className="flex-1 text-center font-inter text-[14px] font-normal leading-[21px] text-foreground">
        2026 ©{" "}
        <a 
          href="https://bashraai.com"
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-brand-primary hover:underline font-medium transition-all"
        >
          Bashra AI
        </a>
        , {dictionary.footer.rights_reserved}
      </div>
    </footer>
  );
}