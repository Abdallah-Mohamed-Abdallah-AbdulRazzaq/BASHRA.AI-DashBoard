"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  UserCircle2, Globe, Building2, Smartphone, 
  MonitorDot, CreditCard, Settings2, ChevronDown, 
  Image as ImageIcon, Loader2
} from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-utils";
import {
  getAdminCompleteProfile,
  updateAdminProfile,
  uploadAdminProfilePicture,
  deleteAdminProfilePicture,
  type ProfileUpdatePayload,
} from "@/lib/admin-profile";
import type { AdminCompleteProfile } from "@/types/api";

interface ProfileSettingsViewProps {
  t: Record<string, Record<string, string>>;
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
        const data: AdminCompleteProfile = await getAdminCompleteProfile();
        if (cancelled) return;
        const { account, profile } = data;
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
      // Only send fields that are documented in PUT /api/profile-admin
      const body: ProfileUpdatePayload = {};
      if (formData.full_name)                       body.full_name = formData.full_name;
      if (formData.job_title)                       body.job_title = formData.job_title;
      if (formData.department)                      body.department = formData.department;
      if (formData.date_of_birth)                   body.date_of_birth = formData.date_of_birth;
      if (formData.gender)                          body.gender = formData.gender as ProfileUpdatePayload['gender'];
      if (formData.nationality)                     body.nationality = formData.nationality;
      if (formData.emergency_contact_phone)         body.emergency_contact_phone = formData.emergency_contact_phone;
      if (formData.emergency_contact_name)          body.emergency_contact_name = formData.emergency_contact_name;
      if (formData.emergency_contact_relationship)  body.emergency_contact_relationship = formData.emergency_contact_relationship;
      if (formData.timezone)                        body.timezone = formData.timezone;
      if (formData.language_preference)             body.language_preference = formData.language_preference;

      await updateAdminProfile(body);
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
      // uploadAdminProfilePicture uses FormData with field name 'profile_picture'
      const res = await uploadAdminProfilePicture(file);
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
      await deleteAdminProfilePicture();
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
      
      <h2 className="text-[22px] font-bold text-[#0A1B39]">{t.settings?.title || 'Settings'}</h2>

      {error && (
        <div role="alert" className="w-full rounded-[8px] border border-[#EF1E1E] bg-red-50 px-4 py-3">
          <p className="text-[13px] font-medium text-[#EF1E1E]">{error}</p>
        </div>
      )}

      {success && (
        <div role="status" className="w-full rounded-[8px] border border-green-500 bg-green-50 px-4 py-3">
          <p className="text-[13px] font-medium text-green-700">{success}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        
        {/* --- Left Settings Sidebar --- */}
        {/* <div className="w-full lg:w-[260px] shrink-0 bg-white border border-[#E7E8EB] rounded-[12px] p-4 flex flex-col gap-2 h-fit">
          <div className="flex flex-col">
            <button 
              onClick={() => setActiveMenu(activeMenu === "account" ? "" : "account")}
              className={cn("flex items-center justify-between w-full p-3 rounded-[8px] transition-colors", 
                activeMenu === "account" ? "text-[#2E37A4]" : "text-[#0A1B39] hover:bg-[#F9FAFB]"
              )}
            >
              <div className="flex items-center gap-3 text-[14px] font-semibold">
                <UserCircle2 size={18} /> {t.settings?.account_settings || 'Account Settings'}
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
                  {t.settings?.[item] || item}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#E7E8EB] my-2" />

          {[
            { id: "website", icon: <Globe size={18} />, label: t.settings?.website_settings || 'Website Settings' },
            { id: "clinic", icon: <Building2 size={18} />, label: t.settings?.clinic_settings || 'Clinic Settings' },
            { id: "app", icon: <Smartphone size={18} />, label: t.settings?.app_settings || 'App Settings' },
            { id: "system", icon: <MonitorDot size={18} />, label: t.settings?.system_settings || 'System Settings' },
            { id: "finance", icon: <CreditCard size={18} />, label: t.settings?.finance_accounts || 'Finance & Accounts' },
            { id: "other", icon: <Settings2 size={18} />, label: t.settings?.other_settings || 'Other Settings' },
          ].map((menu) => (
            <button key={menu.id} className="flex items-center justify-between w-full p-3 rounded-[8px] text-[#0A1B39] hover:bg-[#F9FAFB] transition-colors">
              <div className="flex items-center gap-3 text-[14px] font-medium">
                {menu.icon} {menu.label}
              </div>
              <ChevronDown size={16} className="text-[#9DA4B0]" />
            </button>
          ))}
        </div> */}

        {/* --- Right Content Area (Forms) --- */}
        <div className="flex-1 bg-white border border-[#E7E8EB] rounded-[12px] overflow-hidden flex flex-col h-fit">
          
          {/* Section 1: Basic Information */}
          <div className="p-6 border-b border-[#E7E8EB]">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings?.basic_info || 'Basic Information'}</h3>
            
            <div className="flex flex-col gap-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#0A1B39]">{t.settings?.profile_image || 'Profile Image'}</label>
                <div className="flex items-end gap-3">
                  <div
                    onClick={handleProfilePictureClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload profile picture"
                    onKeyDown={(e) => e.key === 'Enter' && handleProfilePictureClick()}
                    className="relative w-[80px] h-[80px] rounded-full border border-[#E7E8EB] bg-[#F5F6F8] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden group shadow-sm"
                  >
                    {formData.profile_picture_url ? (
                      <Image src={formData.profile_picture_url} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized />
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
                  label={t.settings?.full_name || 'Full Name'}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
                <InputGroup
                  label={t.settings?.email || 'Email'}
                  value={formData.email}
                  type="email"
                  dir="ltr"
                  readonly
                />
                <InputGroup
                  label={t.settings?.phone || 'Phone Number'}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  dir="ltr"
                  readonly
                />
                <InputGroup
                  label={t.settings?.dob || 'Date of Birth'}
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  type="date"
                  dir="ltr"
                />
                <SelectGroup
                  label={t.settings?.gender || 'Gender'}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "— Select —" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                    { value: "prefer_not_to_say", label: "Prefer not to say" },
                  ]}
                />
                <InputGroup
                  label={t.settings?.nationality || 'Nationality'}
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details — editable per docs (job_title, department in PUT body) */}
          <div className="p-6 border-b border-[#E7E8EB] bg-[#FAFBFC]/50">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings?.employment_details || 'Employment Details'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* job_title and department are editable — both are valid PUT body fields per docs */}
              <InputGroup
                label={t.settings?.job_title || 'Job Title'}
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
              />
              <InputGroup
                label={t.settings?.department || 'Department'}
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
              {/* admin_type and hire_date are read-only — not editable via profile PUT */}
              <InputGroup
                label={t.settings?.admin_type || 'Admin Role'}
                value={formData.admin_type.replace(/_/g, ' ').toUpperCase()}
                readonly
              />
              <InputGroup
                label={t.settings?.hire_date || 'Hire Date'}
                value={formData.hire_date}
                type="date"
                readonly
                dir="ltr"
              />
            </div>
          </div>

          {/* Section 3: Emergency Contact */}
          <div className="p-6 border-b border-[#E7E8EB]">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings?.emergency_contact || 'Emergency Contact'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <InputGroup
                label={t.settings?.contact_name || 'Contact Name'}
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
              />
              <InputGroup
                label={t.settings?.relationship || 'Relationship'}
                name="emergency_contact_relationship"
                value={formData.emergency_contact_relationship}
                onChange={handleChange}
              />
              <InputGroup
                label={t.settings?.phone || 'Phone Number'}
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
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings?.system_preferences || 'System Preferences'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <SelectGroup
                label={t.settings?.timezone || 'Timezone'}
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                options={[
                  { value: "UTC", label: "UTC" },
                  { value: "GMT", label: "GMT" },
                  { value: "EST", label: "EST" },
                  { value: "PST", label: "PST" },
                  { value: "AST", label: "AST" },
                  { value: "Africa/Cairo", label: "Africa/Cairo" },
                  { value: "Asia/Riyadh", label: "Asia/Riyadh" },
                ]}
                dir="ltr"
              />
              <SelectGroup
                label={t.settings?.language || 'Language Preference'}
                name="language_preference"
                value={formData.language_preference}
                onChange={handleChange}
                options={[
                  { value: "en", label: "English" },
                  { value: "ar", label: "العربية" },
                ]}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-[#E7E8EB] bg-[#FAFBFC] flex items-center justify-end gap-3 rounded-b-[12px]">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#F5F6F8] text-[#0A1B39] text-[13px] font-bold rounded-[8px] hover:bg-[#E7E8EB] transition-colors border border-[#E7E8EB]"
            >
              {t.settings?.cancel || 'Cancel'}
            </button>
            <button
              id="profile-save-btn"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-[#2E37A4] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {t.settings?.save_changes || 'Save Changes'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

interface InputGroupProps {
  label: string;
  name?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  dir?: string;
  readonly?: boolean;
}

const InputGroup = ({ label, name, value, onChange, required, type = "text", dir = "auto", readonly = false }: InputGroupProps) => (
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

interface SelectOption {
  value: string;
  label: string;
}

interface SelectGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  dir?: string;
}

const SelectGroup = ({ label, name, value, onChange, options, dir = "auto" }: SelectGroupProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-semibold text-[#0A1B39]">{label}</label>
    <div className="relative">
      <select 
        name={name}
        value={value}
        onChange={onChange}
        dir={dir}
        className="w-full h-[42px] px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[14px] text-[#0A1B39] appearance-none focus:outline-none focus:border-[#2E37A4] transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0] pointer-events-none" />
    </div>
  </div>
);
