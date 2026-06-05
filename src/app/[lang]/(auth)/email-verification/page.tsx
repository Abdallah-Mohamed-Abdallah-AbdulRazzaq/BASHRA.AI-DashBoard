"use client";

import React, { useState, useEffect, useRef } from "react";
import { LogoIcon } from "@/components/ui/icons/sidebar-icons";
import { useDictionary } from "@/components/shared/dictionary-provider";

export default function EmailVerificationPage() {
  const { dictionary } = useDictionary();
  
  // 1. حالة الـ OTP (مكونة من 6 خانات فارغة)
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 2. حالة العداد (Timer)
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds
  const [canResend, setCanResend] = useState(false);

  // منطق العداد التنازلي
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // تنسيق الوقت (00:45)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // التعامل مع تغيير القيم في الخانات
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // الانتقال للخانة التالية إذا تم إدخال رقم
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // التعامل مع زر الحذف (Backspace)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // الرجوع للخانة السابقة
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = otp.join("");
    console.log("Submitted OTP:", finalCode);
    // Add verification logic here
  };

  return (
    <div className="flex flex-col w-[720px] max-w-full justify-end items-center gap-[74px]">
      
      {/* Logo */}
      <div className="flex h-[28px] items-center gap-[6px]">
        <LogoIcon />
        <span className="font-inter text-[20px] font-bold text-[#0A1B39]">Black Falcons</span>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col p-[40px] items-center justify-center gap-[30px] self-stretch rounded-[20px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-[10px] self-stretch text-center">
          <h2 className="self-stretch font-inter text-[20px] font-bold leading-[24px] text-[#0A1B39]">
            {dictionary.auth.verify_title}
          </h2>
          <p className="self-stretch font-inter text-[14px] font-normal leading-[21px] text-[#6C7688] opacity-70 max-w-[400px] mx-auto">
            {dictionary.auth.verify_subtitle} <span className="font-medium text-[#0A1B39]">******doe@example.com</span>
          </p>
        </div>

        {/* 6-Digit OTP Inputs */}
        <div className="flex items-center justify-center gap-[12px] sm:gap-[16px]">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength={1}
              value={data}
              ref={(el) => { inputRefs.current[index] = el; }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] text-center font-inter text-[20px] font-semibold text-[#0A1B39] rounded-[6px] border border-[#E7E8EB] bg-brand-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all shadow-sm"
            />
          ))}
        </div>

        {/* Timer & Resend */}
        <div className="flex items-center gap-2 text-[14px]">
            <span className="text-[#6C7688]">{dictionary.auth.didnt_receive}</span>
            {canResend ? (
                <button 
                    type="button" 
                    onClick={() => { setTimeLeft(45); setCanResend(false); }}
                    className="text-brand-primary font-medium hover:underline"
                >
                    {dictionary.auth.resend}
                </button>
            ) : (
                <span className="text-brand-primary font-medium">
                    {dictionary.auth.resend} <span className="text-[#EF1E1E] ml-1">{formatTime(timeLeft)}</span>
                </span>
            )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="flex h-[38px] px-[12px] py-[8px] justify-center items-center gap-[8px] self-stretch rounded-[6px] bg-brand-primary text-brand-white font-inter text-[14px] font-medium leading-[21px] hover:opacity-90 transition-opacity active:scale-[0.99]">
            {dictionary.auth.submit}
        </button>

      </form>

      {/* Copyright */}
      <div className="text-center font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39] opacity-80">
        {dictionary.auth.copyright}
      </div>

    </div>
  );
}