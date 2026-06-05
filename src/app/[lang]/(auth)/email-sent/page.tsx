"use client";

import React from "react";
import { LogoIcon } from "@/components/ui/icons/sidebar-icons";
import { SuccessCheckIcon } from "@/components/ui/icons/auth-icons";
import { useDictionary } from "@/components/shared/dictionary-provider";

export default function EmailSentPage() {
  const { dictionary } = useDictionary();

  return (
    <div className="flex flex-col w-[720px] max-w-full justify-end items-center gap-[74px]">
      
      {/* Logo */}
      <div className="flex h-[28px] items-center gap-[6px]">
        <LogoIcon />
        <span className="font-inter text-[20px] font-bold text-[#0A1B39]">Black Falcons</span>
      </div>

      {/* Card Container */}
      <div className="flex flex-col p-[40px] items-center justify-center gap-[30px] self-stretch rounded-[20px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] text-center">
        
        {/* Success Icon */}
        <div className="flex items-center justify-center">
            <SuccessCheckIcon />
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-[10px] self-stretch">
          <h2 className="self-stretch font-inter text-[20px] font-bold leading-[24px] text-[#0A1B39]">
            {dictionary.auth.email_sent_title}
          </h2>
          <p className="self-stretch font-inter text-[14px] font-normal leading-[21px] text-[#6C7688] opacity-70">
            {dictionary.auth.email_sent_subtitle}
          </p>
        </div>

        {/* Button */}
        {/* ملاحظة: الزر هنا قد يوجه لصفحة إعادة التعيين أو يفتح تطبيق الإيميل حسب المنطق البرمجي */}
        <button className="flex h-[38px] px-[12px] py-[8px] justify-center items-center gap-[8px] self-stretch rounded-[6px] bg-brand-primary text-brand-white font-inter text-[14px] font-medium leading-[21px] hover:opacity-90 transition-opacity active:scale-[0.99]">
            {dictionary.auth.reset_password_btn}
        </button>

      </div>

      {/* Copyright */}
      <div className="text-center font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39] opacity-80">
        {dictionary.auth.copyright}
      </div>

    </div>
  );
}