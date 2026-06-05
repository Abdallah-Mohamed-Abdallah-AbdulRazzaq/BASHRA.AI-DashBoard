import React from "react";
import Image from "next/image"; // 👈 استيراد مكون الصورة
import { getDictionary } from "@/lib/dictionary";
import { DictionaryProvider } from "@/components/shared/dictionary-provider";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <DictionaryProvider dictionary={dictionary} lang={params.lang}>
      <div className="flex min-h-screen w-full bg-brand-light overflow-hidden">
        
        {/* 1. LEFT OVERLAY SECTION */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#1295CC] to-[#16BB9A] items-center justify-center p-8 overflow-hidden">
          
          {/* Decorative Circles (Background) */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full border-[40px] border-white/10 blur-[3px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full border-[60px] border-white/10 blur-[3px]" />

          {/* Glass Card Container */}
          <div className="relative z-10 w-full max-w-[600px] h-[90vh] max-h-[900px] flex flex-col items-center p-10 gap-8 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md shadow-2xl text-center">
            
            {/* Text Content */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-3xl font-bold text-white leading-tight drop-shadow-sm">
                {dictionary.auth.overlay_title}
              </h1>
              <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-[90%] mx-auto">
                {dictionary.auth.overlay_subtitle}
              </p>
            </div>

            {/* Image Container */}
            <div className="relative w-full flex-1 min-h-[300px] bg-white/5 rounded-xl border border-white/20 overflow-hidden shadow-inner flex items-center justify-center p-4">
               <Image 
                 src="/images/auth-illustration-2.png"
                 alt="Healthcare Illustration"
                 fill
                 className="object-contain"
                 priority
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
            </div>
            
          </div>
        </div>

        {/* 2. RIGHT FORM SECTION */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-brand-white">
          <div className="w-full max-w-[550px]">
            {children}
          </div>
        </div>

      </div>
    </DictionaryProvider>
  );
}