"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/ui/icons/sidebar-icons";
import { 
  MailIcon, 
  LockIcon, 
  EyeOffIcon, 
  EyeIcon, 
} from "@/components/ui/icons/auth-icons";
import { useDictionary } from "@/components/shared/dictionary-provider";
import { loginAdmin } from "@/lib/admin-auth";
import { getApiErrorMessage } from "@/lib/error-utils";

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
          autoComplete={isPasswordField ? "current-password" : "email"}
          className="flex-1 bg-transparent font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39] placeholder:text-[#9DA4B0] outline-none"
        />
        {isPasswordField && (
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-[#9DA4B0] hover:text-[#0A1B39] transition-colors flex items-center justify-center"
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
    </div>
  );
};

export default function LoginPage() {
  const { dictionary, lang } = useDictionary();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim()) {
      setError(dictionary.auth.enter_email || 'Email is required');
      return;
    }
    if (!formData.password) {
      setError(dictionary.auth.password_required || 'Password is required');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin({ email: formData.email, password: formData.password });
      router.replace(`/${lang}/dashboard/admin`);
    } catch (err) {
      setError(getApiErrorMessage(err, lang as 'ar' | 'en'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-[480px] max-w-full justify-end items-center gap-[48px]">
      
      {/* Logo */}
      <div className="flex h-[28px] items-center gap-[6px]">
        <LogoIcon />
        <span className="font-inter text-[20px] font-bold text-[#0A1B39]">BashraAI</span>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="flex flex-col p-[40px] items-start gap-[24px] self-stretch rounded-[20px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]">
        
        {/* Header */}
        <div className="flex flex-col items-start gap-[8px] self-stretch">
          <h1 className="self-stretch text-center font-inter text-[22px] font-bold leading-[28px] text-[#0A1B39]">
            {dictionary.auth.login_title}
          </h1>
          <p className="self-stretch text-center font-inter text-[14px] font-normal leading-[21px] text-[#6C7688] opacity-70">
            {dictionary.auth.login_subtitle}
          </p>
        </div>

        {/* Inputs Group */}
        <div className="flex flex-col gap-[16px] self-stretch">
          
          {/* Email */}
          <FormInput 
            id="email"
            label={dictionary.auth.email}
            type="email"
            placeholder={dictionary.auth.enter_email}
            value={formData.email}
            onChange={handleChange}
            icon={<MailIcon />}
          />

          {/* Password */}
          <FormInput 
            id="password"
            label={dictionary.auth.password}
            type="password"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={<LockIcon />}
            isPasswordField={true}
          />

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end self-stretch">
            <Link 
              href={`/${lang}/forgot-password`} 
              className="font-inter text-[13px] font-medium leading-[19.5px] text-brand-primary hover:underline"
            >
              {dictionary.auth.forgot_password}
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div role="alert" className="w-full rounded-[6px] border border-[#EF1E1E] bg-red-50 px-4 py-3 text-center">
              <p className="font-inter text-[13px] font-medium text-[#EF1E1E]">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            className="flex h-[42px] px-[12px] py-[8px] justify-center items-center gap-[8px] self-stretch rounded-[8px] bg-brand-primary text-brand-white font-inter text-[14px] font-semibold leading-[21px] hover:opacity-90 transition-opacity active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {dictionary.auth.logging_in || 'Logging in...'}
              </span>
            ) : dictionary.auth.login}
          </button>

        </div>
      </form>

      {/* Copyright */}
      <div className="text-center font-inter text-[13px] font-normal leading-[21px] text-[#0A1B39] opacity-60">
        {dictionary.auth.copyright}
      </div>

    </div>
  );
}