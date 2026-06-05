"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/icons/sidebar-icons";
import { 
  LockIcon, 
  EyeOffIcon, 
  EyeIcon 
} from "@/components/ui/icons/auth-icons";
import { useDictionary } from "@/components/shared/dictionary-provider";

// --- مكون إدخال قابل لإعادة الاستخدام ---
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
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col items-start gap-[4px] self-stretch">
      <label htmlFor={id} className="self-stretch font-inter text-[14px] font-medium leading-[21px] text-[#0A1B39]">
        {label}
      </label>
      <div className="flex h-[36px] px-[12px] py-[6px] items-center gap-[8px] self-stretch rounded-[6px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)] focus-within:border-brand-primary transition-colors">
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

// --- الصفحة الرئيسية ---
export default function ResetPasswordPage() {
  const { dictionary, lang } = useDictionary();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    console.log("Resetting password...", formData);
    // Add API logic here
  };

  return (
    <div className="flex flex-col w-[720px] max-w-full justify-end items-center gap-[74px]">
      
      {/* Logo */}
      <div className="flex h-[28px] items-center gap-[6px]">
        <LogoIcon />
        <span className="font-inter text-[20px] font-bold text-[#0A1B39]">Black Falcons</span>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col p-[40px] items-start gap-[30px] self-stretch rounded-[20px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-[10px] self-stretch text-center">
          <h2 className="self-stretch font-inter text-[20px] font-bold leading-[24px] text-[#0A1B39]">
            {dictionary.auth.reset_page_title}
          </h2>
          <p className="self-stretch font-inter text-[14px] font-normal leading-[21px] text-[#6C7688] opacity-70">
            {dictionary.auth.reset_page_subtitle}
          </p>
        </div>

        {/* Inputs Group */}
        <div className="flex flex-col gap-[20px] self-stretch">
          
          {/* Password */}
          <FormInput 
            id="password"
            label={dictionary.auth.new_password}
            type="password"
            placeholder="************"
            value={formData.password}
            onChange={handleChange}
            icon={<LockIcon />}
            isPasswordField={true}
          />

          {/* Confirm Password */}
          <FormInput 
            id="confirmPassword"
            label={dictionary.auth.confirm_new_password}
            type="password"
            placeholder="************"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<LockIcon />}
            isPasswordField={true}
          />

          {/* Submit Button */}
          <button type="submit" className="flex h-[38px] px-[12px] py-[8px] justify-center items-center gap-[8px] self-stretch rounded-[6px] bg-brand-primary text-brand-white font-inter text-[14px] font-medium leading-[21px] hover:opacity-90 transition-opacity active:scale-[0.99]">
            {dictionary.auth.submit_btn}
          </button>

          {/* Return to Login */}
          <div className="flex justify-center items-center self-stretch">
            <Link href={`/${lang}/login`} className="font-inter text-[14px] font-medium leading-[21px] text-brand-primary hover:underline">
                {dictionary.auth.return_login}
            </Link>
          </div>

        </div>
      </form>

      {/* Copyright */}
      <div className="text-center font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39] opacity-80">
        {dictionary.auth.copyright}
      </div>

    </div>
  );
}