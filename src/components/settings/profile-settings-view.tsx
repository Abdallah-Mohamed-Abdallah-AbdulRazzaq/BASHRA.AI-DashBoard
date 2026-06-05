"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  UserCircle2, Globe, Building2, Smartphone, 
  MonitorDot, CreditCard, Settings2, ChevronDown, 
  Image as ImageIcon, Loader2
} from "lucide-react";
import { apiGet, apiPut, apiUpload, apiDelete } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { AdminCompleteProfile, ApiSuccessResponse, PictureUploadResponse } from "@/types/api";

interface ProfileSettingsViewProps {
  t: any;
}

export default function ProfileSettingsView({ t }: ProfileSettingsViewProps) {
  const [activeMenu, setActiveMenu] = useState("account");
  const [activeSubMenu, setActiveSubMenu] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    admin_type: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    profile_picture_url: "",
    emergency_contact_phone: "",
    timezone: "UTC",
    language_preference: "en",
    hire_date: "",
    full_name: "",
    job_title: "",
    department: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
  });

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const res = await apiGet<ApiSuccessResponse<AdminCompleteProfile>>(
          '/api/profile-admin/complete'
        );
        if (cancelled) return;
        const { account, profile } = res.data;
        setFormData({
          email: account.email || "",
          phone: account.phone || "",
          admin_type: account.admin_type || "",
          date_of_birth: profile.date_of_birth || "",
          gender: profile.gender || "",
          nationality: profile.nationality || "",
          profile_picture_url: profile.profile_picture_url || "",
          emergency_contact_phone: profile.emergency_contact_phone || "",
          timezone: profile.timezone || "UTC",
          language_preference: profile.language_preference || "en",
          hire_date: profile.hire_date || "",
          full_name: profile.full_name || "",
          job_title: profile.job_title || "",
          department: profile.department || "",
          emergency_contact_name: profile.emergency_contact_name || "",
          emergency_contact_relationship: profile.emergency_contact_relationship || "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const body: Record<string, string> = {};
      const fields: (keyof typeof formData)[] = [
        'full_name', 'job_title', 'department',
        'date_of_birth', 'gender', 'nationality',
        'emergency_contact_phone', 'emergency_contact_name', 'emergency_contact_relationship',
        'timezone', 'language_preference',
      ];
      for (const field of fields) {
        if (formData[field]) body[field] = formData[field];
      }
      await apiPut<ApiSuccessResponse<unknown>>('/api/profile-admin', body);
      setSuccess(t.settings?.save_success || 'Profile updated successfully');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('profile_picture', file);
      const res = await apiUpload<PictureUploadResponse>(
        '/api/profile-admin/picture',
        formDataUpload
      );
      setFormData(prev => ({ ...prev, profile_picture_url: res.data.profile_picture_url }));
      setSuccess(t.settings?.picture_uploaded || 'Profile picture updated');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!formData.profile_picture_url) return;
    setUploading(true);
    setError(null);
    try {
      await apiDelete('/api/profile-admin/picture');
      setFormData(prev => ({ ...prev, profile_picture_url: '' }));
      setSuccess(t.settings?.picture_deleted || 'Profile picture removed');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#F5F6F8]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-brand-primary" />
          <p className="text-sm text-[#6C7688]">{t.common?.loading || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <h2 className="text-[22px] font-bold text-[#0A1B39]">{t.settings.title}</h2>

      {error && (
        <div className="w-full rounded-[8px] border border-[#EF1E1E] bg-red-50 px-4 py-3">
          <p className="text-[13px] font-medium text-[#EF1E1E]">{error}</p>
        </div>
      )}

      {success && (
        <div className="w-full rounded-[8px] border border-green-500 bg-green-50 px-4 py-3">
          <p className="text-[13px] font-medium text-green-700">{success}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        
        {/* --- Left Settings Sidebar --- */}
        <div className="w-full lg:w-[260px] shrink-0 bg-white border border-[#E7E8EB] rounded-[12px] p-4 flex flex-col gap-2 h-fit">
          <div className="flex flex-col">
            <button 
              onClick={() => setActiveMenu(activeMenu === "account" ? "" : "account")}
              className={cn("flex items-center justify-between w-full p-3 rounded-[8px] transition-colors", 
                activeMenu === "account" ? "text-[#2E37A4]" : "text-[#0A1B39] hover:bg-[#F9FAFB]"
              )}
            >
              <div className="flex items-center gap-3 text-[14px] font-semibold">
                <UserCircle2 size={18} /> {t.settings.account_settings}
              </div>
              <ChevronDown size={16} className={cn("transition-transform duration-300", activeMenu === "account" ? "rotate-180" : "rotate-0")} />
            </button>

            <div className={cn("flex flex-col gap-1 overflow-hidden transition-all duration-300 pl-9 rtl:pr-9 rtl:pl-0", activeMenu === "account" ? "max-h-40 mt-1" : "max-h-0")}>
              {["profile", "security", "notifications", "integrations"].map((item) => (
                <button 
                  key={item}
                  onClick={() => setActiveSubMenu(item)}
                  className={cn("flex items-center gap-2 text-[13px] py-2 w-full text-start relative",
                    activeSubMenu === item ? "text-[#2E37A4] font-bold" : "text-[#6C7688] font-medium hover:text-[#0A1B39]"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full absolute left-[-14px] rtl:right-[-14px] rtl:left-auto", activeSubMenu === item ? "bg-[#2E37A4]" : "bg-[#E7E8EB]")}></span>
                  {t.settings[item]}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#E7E8EB] my-2" />

          {[
            { id: "website", icon: <Globe size={18} />, label: t.settings.website_settings },
            { id: "clinic", icon: <Building2 size={18} />, label: t.settings.clinic_settings },
            { id: "app", icon: <Smartphone size={18} />, label: t.settings.app_settings },
            { id: "system", icon: <MonitorDot size={18} />, label: t.settings.system_settings },
            { id: "finance", icon: <CreditCard size={18} />, label: t.settings.finance_accounts },
            { id: "other", icon: <Settings2 size={18} />, label: t.settings.other_settings },
          ].map((menu) => (
            <button key={menu.id} className="flex items-center justify-between w-full p-3 rounded-[8px] text-[#0A1B39] hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center gap-3 text-[14px] font-medium">
                {menu.icon} {menu.label}
              </div>
              <ChevronDown size={16} className="text-[#9DA4B0]" />
            </button>
          ))}
        </div>

        {/* --- Right Content Area (Forms) --- */}
        <div className="flex-1 bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden flex flex-col h-fit">
          
          {/* Section 1: Basic Information */}
          <div className="p-6 border-b border-[#E7E8EB]">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings.basic_info}</h3>
            
            <div className="flex flex-col gap-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.settings.profile_image}</label>
                <div className="flex items-end gap-3">
                  <div
                    onClick={handleProfilePictureClick}
                    className="relative w-[80px] h-[80px] rounded-full border border-[#E7E8EB] bg-[#F5F6F8] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden group shadow-sm"
                  >
                    {formData.profile_picture_url ? (
                      <img src={formData.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle2 size={36} className="text-[#9DA4B0]" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploading ? (
                        <Loader2 size={20} className="animate-spin text-white" />
                      ) : (
                        <ImageIcon size={20} className="text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                  />
                  <div className="flex flex-col gap-1">
                    {formData.profile_picture_url && (
                      <button
                        onClick={handleDeleteProfilePicture}
                        disabled={uploading}
                        className="text-[12px] font-medium text-[#EF1E1E] hover:underline disabled:opacity-50"
                      >
                        {t.address?.remove_image || 'Remove'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <InputGroup
                  label={t.settings.full_name}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label={t.settings.email}
                  value={formData.email}
                  type="email"
                  dir="ltr"
                  readonly
                />
                <InputGroup
                  label={t.settings.phone}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  dir="ltr"
                />
                <InputGroup
                  label={t.settings.dob}
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  dir="ltr"
                />
                <SelectGroup
                  label={t.settings.gender}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={["male", "female", "other", "prefer_not_to_say"]}
                />
                <InputGroup
                  label={t.settings.nationality}
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details (Read-only) */}
          <div className="p-6 border-b border-[#E7E8EB] bg-[#FAFBFC]/50">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings.employment_details}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <InputGroup label={t.settings.job_title} value={formData.job_title} readonly />
              <InputGroup label={t.settings.department} value={formData.department} readonly />
              <InputGroup
                label={t.settings.admin_type}
                value={formData.admin_type.replace(/_/g, ' ').toUpperCase()}
                readonly
              />
              <InputGroup label={t.settings.hire_date} value={formData.hire_date} type="date" readonly dir="ltr" />
            </div>
          </div>

          {/* Section 3: Emergency Contact */}
          <div className="p-6 border-b border-[#E7E8EB]">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings.emergency_contact}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <InputGroup
                label={t.settings.contact_name}
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
              />
              <InputGroup
                label={t.settings.relationship}
                name="emergency_contact_relationship"
                value={formData.emergency_contact_relationship}
                onChange={handleChange}
              />
              <InputGroup
                label={t.settings.phone}
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                type="tel"
                dir="ltr"
              />
            </div>
          </div>

          {/* Section 4: System Preferences */}
          <div className="p-6">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings.system_preferences}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <SelectGroup
                label={t.settings.timezone}
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                options={["UTC", "GMT", "EST", "PST", "AST", "Africa/Cairo", "Asia/Riyadh"]}
                dir="ltr"
              />
              <SelectGroup
                label={t.settings.language}
                name="language_preference"
                value={formData.language_preference}
                onChange={handleChange}
                options={["en", "ar"]}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-[#E7E8EB] bg-[#FAFBFC] flex items-center justify-end gap-3 rounded-b-[12px]">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#F5F6F8] text-[#0A1B39] text-[13px] font-bold rounded-[8px] hover:bg-[#E7E8EB] transition-colors border border-[#E7E8EB]"
            >
              {t.settings.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-[#2E37A4] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {t.settings.save_changes}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---
const InputGroup = ({ label, name, value, onChange, required, type = "text", dir = "auto", readonly = false }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-semibold text-[#0A1B39]">
      {label} {required && <span className="text-[#EF1E1E]">*</span>}
    </label>
    <input 
      type={type} 
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readonly}
      dir={dir}
      className={cn(
        "w-full h-[42px] px-3 border border-[#E7E8EB] rounded-[8px] text-[14px] transition-colors focus:outline-none",
        readonly ? "bg-[#F5F6F8] text-[#6C7688] cursor-not-allowed" : "bg-white text-[#0A1B39] focus:border-[#2E37A4]"
      )}
    />
  </div>
);

const SelectGroup = ({ label, name, value, onChange, options, dir = "auto" }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-semibold text-[#0A1B39]">{label}</label>
    <div className="relative">
      <select 
        name={name}
        value={value}
        onChange={onChange}
        dir={dir}
        className="w-full h-[42px] px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[14px] text-[#0A1B39] appearance-none focus:outline-none focus:border-[#2E37A4] transition-colors cursor-pointer capitalize"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0] pointer-events-none" />
    </div>
  </div>
);
