"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  UserCircle2, Globe, Building2, Smartphone, 
  MonitorDot, CreditCard, Settings2, ChevronDown, 
  Image as ImageIcon 
} from "lucide-react";

interface ProfileSettingsViewProps {
  t: any;
}

export default function ProfileSettingsView({ t }: ProfileSettingsViewProps) {
  const [activeMenu, setActiveMenu] = useState("account");
  const [activeSubMenu, setActiveSubMenu] = useState("profile");

  // --- محاكاة بيانات الـ Admin بناءً على الـ SQL ---
  const [adminData, setAdminData] = useState({
    // من جدول: admins
    email: "admin@bashraai.com",
    phone: "+1 234 567 8900",
    admin_type: "super_admin", // super_admin, system_admin, clinic_admin
    
    // من جدول: admin_profiles
    date_of_birth: "1985-10-15",
    gender: "male", // male, female, other, prefer_not_to_say
    nationality: "American",
    profile_picture_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
    emergency_contact_phone: "+1 987 654 3210",
    timezone: "UTC",
    language_preference: "en",
    hire_date: "2020-01-01",
    
    // من جدول: admin_profile_translations
    full_name: "John Doe",
    job_title: "Chief Technical Officer",
    department: "IT & Engineering",
    emergency_contact_name: "Jane Doe",
    emergency_contact_relationship: "Spouse"
  });

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <h2 className="text-[22px] font-bold text-[#0A1B39]">{t.settings.title}</h2>

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
                <div className="relative w-[80px] h-[80px] rounded-full border border-[#E7E8EB] bg-[#F5F6F8] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden group shadow-sm">
                  <img src={adminData.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon size={20} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Grid Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <InputGroup label={t.settings.full_name} value={adminData.full_name} required />
                <InputGroup label={t.settings.email} value={adminData.email} required type="email" dir="ltr" />
                <InputGroup label={t.settings.phone} value={adminData.phone} required type="tel" dir="ltr" />
                <InputGroup label={t.settings.dob} value={adminData.date_of_birth} type="date" dir="ltr" />
                <SelectGroup label={t.settings.gender} value={adminData.gender} options={["male", "female", "other", "prefer_not_to_say"]} />
                <InputGroup label={t.settings.nationality} value={adminData.nationality} />
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details (Read-only usually for Admins) */}
          <div className="p-6 border-b border-[#E7E8EB] bg-[#FAFBFC]/50">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings.employment_details}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <InputGroup label={t.settings.job_title} value={adminData.job_title} readonly />
              <InputGroup label={t.settings.department} value={adminData.department} readonly />
              <InputGroup label={t.settings.admin_type} value={adminData.admin_type.replace('_', ' ').toUpperCase()} readonly />
              <InputGroup label={t.settings.hire_date} value={adminData.hire_date} type="date" readonly dir="ltr" />
            </div>
          </div>

          {/* Section 3: Emergency Contact */}
          <div className="p-6 border-b border-[#E7E8EB]">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings.emergency_contact}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <InputGroup label={t.settings.contact_name} value={adminData.emergency_contact_name} />
              <InputGroup label={t.settings.relationship} value={adminData.emergency_contact_relationship} />
              <InputGroup label={t.settings.phone} value={adminData.emergency_contact_phone} type="tel" dir="ltr" />
            </div>
          </div>

          {/* Section 4: System Preferences */}
          <div className="p-6">
            <h3 className="text-[16px] font-bold text-[#0A1B39] mb-6">{t.settings.system_preferences}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <SelectGroup label={t.settings.timezone} value={adminData.timezone} options={["UTC", "GMT", "EST", "PST", "AST"]} dir="ltr" />
              <SelectGroup label={t.settings.language} value={adminData.language_preference} options={["en", "ar"]} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-[#E7E8EB] bg-[#FAFBFC] flex items-center justify-end gap-3 rounded-b-[12px]">
            <button className="px-5 py-2.5 bg-[#F5F6F8] text-[#0A1B39] text-[13px] font-bold rounded-[8px] hover:bg-[#E7E8EB] transition-colors border border-[#E7E8EB]">
              {t.settings.cancel}
            </button>
            <button className="px-5 py-2.5 bg-[#2E37A4] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#252D88] transition-colors shadow-sm">
              {t.settings.save_changes}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---
const InputGroup = ({ label, value, required, type = "text", dir = "auto", readonly = false }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-semibold text-[#0A1B39]">
      {label} {required && <span className="text-[#EF1E1E]">*</span>}
    </label>
    <input 
      type={type} 
      defaultValue={value}
      readOnly={readonly}
      dir={dir}
      className={cn(
        "w-full h-[42px] px-3 border border-[#E7E8EB] rounded-[8px] text-[14px] transition-colors focus:outline-none",
        readonly ? "bg-[#F5F6F8] text-[#6C7688] cursor-not-allowed" : "bg-white text-[#0A1B39] focus:border-[#2E37A4]"
      )}
    />
  </div>
);

const SelectGroup = ({ label, value, options, dir = "auto" }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-semibold text-[#0A1B39]">{label}</label>
    <div className="relative">
      <select 
        defaultValue={value} 
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