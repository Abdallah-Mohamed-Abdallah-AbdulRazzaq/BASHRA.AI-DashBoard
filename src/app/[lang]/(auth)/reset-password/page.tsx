"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoIcon } from "@/components/ui/icons/sidebar-icons";
import { 
  LockIcon, 
  EyeOffIcon, 
  EyeIcon 
} from "@/components/ui/icons/auth-icons";
import { useDictionary } from "@/components/shared/dictionary-provider";
import { resetPassword } from "@/lib/admin-auth";
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

function ResetPasswordForm() {
  const { dictionary, lang } = useDictionary();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError(dictionary.auth.invalid_reset_link || 'Invalid or expired reset link');
      return;
    }
    if (formData.password.length < 6) {
      setError(dictionary.auth.password_min_length || 'Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(dictionary.auth.passwords_do_not_match || 'Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPassword(token, formData.password);
      setSuccess(true);
      setTimeout(() => router.push(`/${lang}/login`), 3000);
    } catch (err) {
      setError(getApiErrorMessage(err, lang as 'ar' | 'en'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-10">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[18px] font-bold text-[#0A1B39]">{dictionary.auth.password_reset_success || 'Password reset successfully!'}</h3>
        <p className="text-[14px] text-[#6C7688]">{dictionary.auth.redirecting_to_login || 'Redirecting to login...'}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] self-stretch">
      {error && (
        <div className="w-full rounded-[6px] border border-[#EF1E1E] bg-red-50 px-4 py-3 text-center">
          <p className="font-inter text-[13px] font-medium text-[#EF1E1E]">{error}</p>
        </div>
      )}

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

      <button type="submit" disabled={loading} className="flex h-[38px] px-[12px] py-[8px] justify-center items-center gap-[8px] self-stretch rounded-[6px] bg-brand-primary text-brand-white font-inter text-[14px] font-medium leading-[21px] hover:opacity-90 transition-opacity active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {dictionary.auth.resetting || 'Resetting...'}
          </span>
        ) : dictionary.auth.submit_btn}
      </button>

      <div className="flex justify-center items-center self-stretch">
        <Link href={`/${lang}/login`} className="font-inter text-[14px] font-medium leading-[21px] text-brand-primary hover:underline">
            {dictionary.auth.return_login}
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { dictionary, lang } = useDictionary();

  return (
    <div className="flex flex-col w-[720px] max-w-full justify-end items-center gap-[74px]">
      <div className="flex h-[28px] items-center gap-[6px]">
        <LogoIcon />
        <span className="font-inter text-[20px] font-bold text-[#0A1B39]">Black Falcons</span>
      </div>

      <div className="flex flex-col p-[40px] items-start gap-[30px] self-stretch rounded-[20px] border border-[#E7E8EB] bg-brand-white shadow-[0_1px_1px_0_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center gap-[10px] self-stretch text-center">
          <h2 className="self-stretch font-inter text-[20px] font-bold leading-[24px] text-[#0A1B39]">
            {dictionary.auth.reset_page_title}
          </h2>
          <p className="self-stretch font-inter text-[14px] font-normal leading-[21px] text-[#6C7688] opacity-70">
            {dictionary.auth.reset_page_subtitle}
          </p>
        </div>

        <Suspense fallback={<div className="py-10 text-center text-[#6C7688]">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>

      <div className="text-center font-inter text-[14px] font-normal leading-[21px] text-[#0A1B39] opacity-80">
        {dictionary.auth.copyright}
      </div>
    </div>
  );
}
