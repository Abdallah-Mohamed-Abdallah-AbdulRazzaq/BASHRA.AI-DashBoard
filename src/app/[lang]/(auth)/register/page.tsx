"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/icons/sidebar-icons";
import { 
  UserIcon, 
  MailIcon, 
  LockIcon, 
  EyeOffIcon, 
  EyeIcon, // ✅ استيراد أيقونة العين الجديدة
  FacebookIcon, 
  GoogleIcon, 
  AppleIcon 
} from "@/components/ui/icons/auth-icons";
import { useDictionary } from "@/components/shared/dictionary-provider";

// --- 1. مكون إدخال قابل لإعادة الاستخدام (لتقليل التكرار) ---
interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  isPasswordField?: boolean;
}

const FormInput = ({ 
  id, label, type, placeholder, value, onChange, icon, isPasswordField 
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // تحديد نوع الحقل: إذا كان باسورد ومفعل الإظهار يصبح text، غير ذلك يبقى كما هو
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col items-start gap-[4px] self-stretch">
      <label htmlFor={id} className="self-stretch font-inter text-[14px] font-medium leading-[21px] text-[#0A1B39]">
        {label}
      </label>
      <div className="flex h-[36px] px-[12px] py-[6px] items-center gap-[8px] self-stretch rounded-[6px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] focus-within:border-brand-primary transition-colors">
        {/* الأيقونة الأساسية للحقل */}
        <span className="text-[#0A1B39]">{icon}</span>
        
        <input 
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39] placeholder:text-[#9DA4B0] outline-none"
        />

        {/* زر تبديل ظهور كلمة المرور */}
        {isPasswordField && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#9DA4B0] hover:text-[#0A1B39] transition-colors flex items-center justify-center"
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- 2. الصفحة الرئيسية ---
export default function RegisterPage() {
  const { dictionary, lang } = useDictionary();

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add your registration logic here
  };

  return (
    <div className="flex flex-col w-[720px] max-w-full justify-end items-center gap-[40px]">
      
      {/* Logo */}
      <div className="flex h-[28px] items-center gap-[6px]">
        <LogoIcon />
        <span className="font-inter text-[20px] font-bold text-[#0A1B39]">Black Falcons</span>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col p-[40px] items-start gap-[30px] self-stretch rounded-[20px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]">
        
        {/* Header */}
        <div className="flex flex-col items-start gap-[20px] self-stretch">
          <h2 className="self-stretch text-center font-inter text-[20px] font-bold leading-[24px] text-[#0A1B39]">
            {dictionary.auth.register_title}
          </h2>
          <p className="self-stretch text-center font-inter text-[14px] font-normal leading-[21px] text-[#6C7688] opacity-70">
            {dictionary.auth.register_subtitle}
          </p>
        </div>

        {/* Inputs Group */}
        <div className="flex flex-col gap-[20px] self-stretch">
          
          <FormInput 
            id="fullName"
            label={dictionary.auth.full_name}
            type="text"
            placeholder={dictionary.auth.enter_name}
            value={formData.fullName}
            onChange={handleChange}
            icon={<UserIcon />}
          />

          <FormInput 
            id="email"
            label={dictionary.auth.email}
            type="email"
            placeholder={dictionary.auth.enter_email}
            value={formData.email}
            onChange={handleChange}
            icon={<MailIcon />}
          />

          <FormInput 
            id="password"
            label={dictionary.auth.password}
            type="password"
            placeholder="************"
            value={formData.password}
            onChange={handleChange}
            icon={<LockIcon />}
            isPasswordField={true} // تفعيل زر العين
          />

          <FormInput 
            id="confirmPassword"
            label={dictionary.auth.confirm_password}
            type="password"
            placeholder="************"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<LockIcon />}
            isPasswordField={true} // تفعيل زر العين
          />

          {/* Terms Checkbox */}
          <div className="flex items-center gap-[8px]">
            <input 
                type="checkbox" 
                id="terms" 
                className="w-[14px] h-[14px] rounded border-[#E7E8EB] text-brand-primary focus:ring-brand-primary cursor-pointer"
            />
            <label htmlFor="terms" className="font-inter text-[14px] font-normal leading-[21px] text-[#6C7688] cursor-pointer">
                {dictionary.auth.agree_terms}{" "}
                <Link href="#" className="text-brand-primary underline decoration-solid hover:text-[#0A1B39] transition-colors">{dictionary.auth.terms}</Link> &{" "}
                <Link href="#" className="text-brand-primary underline decoration-solid hover:text-[#0A1B39] transition-colors">{dictionary.auth.privacy}</Link>
            </label>
          </div>

          {/* Register Button */}
          <button type="submit" className="flex h-[38px] px-[12px] py-[8px] justify-center items-center gap-[8px] self-stretch rounded-[6px] bg-brand-primary text-brand-white font-inter text-[14px] font-medium leading-[21px] hover:opacity-90 transition-opacity active:scale-[0.99]">
            {dictionary.auth.register_btn}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-[12px] self-stretch justify-center">
            <div className="h-[1px] w-[162.5px] bg-[#E7E8EB]" />
            <span className="font-inter text-[13px] font-normal leading-[19.5px] text-[#6C7688]">{dictionary.auth.or}</span>
            <div className="h-[1px] w-[162.5px] bg-[#E7E8EB]" />
          </div>

          {/* Social Buttons */}
          <div className="flex items-start gap-[16px] self-stretch">
            <button type="button" className="flex flex-1 px-[12px] py-[8px] flex-col justify-center items-center gap-[10px] rounded-[6px] border-[1.1px] border-[#E7E8EB] bg-brand-white hover:bg-grey-50 transition-colors">
                <FacebookIcon />
            </button>
            <button type="button" className="flex flex-1 px-[12px] py-[8px] justify-center items-center gap-[10px] rounded-[6px] border-[1.1px] border-[#E7E8EB] bg-brand-white hover:bg-grey-50 transition-colors">
                <GoogleIcon />
            </button>
            <button type="button" className="flex flex-1 px-[12px] py-[8px] justify-center items-center gap-[10px] rounded-[6px] border-[1.1px] border-[#E7E8EB] bg-brand-white hover:bg-grey-50 transition-colors">
                <AppleIcon />
            </button>
          </div>

          {/* Login Link */}
          <div className="flex justify-center items-center gap-[10px] self-stretch">
            <span className="font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39]">{dictionary.auth.already_have_account}</span>
            <Link href={`/${lang}/login`} className="font-inter text-[14px] font-medium leading-[21px] text-brand-primary hover:underline">
                {dictionary.auth.login}
            </Link>
          </div>

        </div>
      </form>

      {/* Copyright */}
      <div className="text-center font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39]">
        {dictionary.auth.copyright}
      </div>

    </div>
  );
}