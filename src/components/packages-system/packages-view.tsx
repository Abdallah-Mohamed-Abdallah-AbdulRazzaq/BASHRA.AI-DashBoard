"use client";

import React, { useState } from "react";
import { PackageModal } from "./package-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  SearchIcon, 
  MoreVerticalIcon,
  Package as PackageIcon
} from "lucide-react";

interface PackagesViewProps {
  t: any;
}

export default function PackagesView({ t }: PackagesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Dummy Data (Matching `packages` SQL Table) ---
  const [packages, setPackages] = useState([
    { 
      id: 1, 
      name_en: "Basic Plan", 
      name_ar: "الباقة الأساسية", 
      secondary_name_en: "Best for individual doctors",
      secondary_name_ar: "الأفضل للأطباء الأفراد",
      duration_days: 30,
      price: "29.99",
      currency_code: "USD",
      is_active: true, 
      created_at: "2025-01-20" 
    },
    { 
      id: 2, 
      name_en: "Pro Plan", 
      name_ar: "الباقة الاحترافية", 
      secondary_name_en: "Great for small clinics",
      secondary_name_ar: "رائعة للعيادات الصغيرة",
      duration_days: 180,
      price: "149.99",
      currency_code: "USD",
      is_active: true, 
      created_at: "2025-01-22" 
    },
    { 
      id: 3, 
      name_en: "Enterprise Plan", 
      name_ar: "باقة الشركات", 
      secondary_name_en: "Full features for large hospitals",
      secondary_name_ar: "ميزات كاملة للمستشفيات الكبيرة",
      duration_days: 365,
      price: "499.99",
      currency_code: "USD",
      is_active: false, 
      created_at: "2025-02-05" 
    },
  ]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingData(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setPackages(packages.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pkg.name_ar.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0">
            <PackageIcon size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1B39] leading-tight">{t.packages.packages_title}</h2>
            <span className="text-[12px] font-medium text-[#6C7688]">Total: {packages.length} packages</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <input 
              type="text" 
              placeholder={t.packages.search_packages}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]">
               <SearchIcon size={16} />
            </span>
          </div>

          <button 
            onClick={handleAddNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200 shrink-0"
          >
            <PlusIcon size={16} /> {t.packages.add_new_package}
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.packages.package_name_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.packages.package_name_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">Pricing & Duration</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.packages.status}</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{pkg.name_en}</span>
                      {pkg.secondary_name_en && <span className="text-[12px] font-medium text-[#6C7688] truncate">{pkg.secondary_name_en}</span>}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{pkg.name_ar}</span>
                      {pkg.secondary_name_ar && <span className="text-[12px] font-medium text-[#6C7688] truncate">{pkg.secondary_name_ar}</span>}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5 w-fit">
                      <span className="text-[14px] font-bold text-[#27AE60] bg-[#F0FDF4] border border-[#27AE60]/20 px-2.5 py-0.5 rounded-[6px]" dir="ltr">
                        {pkg.price} {pkg.currency_code}
                      </span>
                      <span className="text-[11px] font-semibold text-[#6C7688] bg-[#F5F6F8] px-2 py-0.5 rounded border border-[#E7E8EB]">
                        {pkg.duration_days} Days
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={pkg.is_active} onChange={() => handleToggleStatus(pkg.id)} />
                      <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]"></div>
                      <span className={cn("ml-2 rtl:mr-2 rtl:ml-0 text-[11px] font-bold", pkg.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                        {pkg.is_active ? t.packages.active : t.packages.inactive}
                      </span>
                    </label>
                  </td>

                  <td className="py-4 px-6 text-end">
                    <CustomDropdown 
                      trigger={
                        <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                          <MoreVerticalIcon size={16} />
                        </button>
                      }
                      items={[
                        { label: t.packages.edit_package, onClick: () => handleEdit(pkg) },
                        { label: t.common?.delete || "Delete", onClick: () => handleDelete(pkg.id), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                      ]}
                      width="w-32"
                      align="end"
                    />
                  </td>

                </tr>
              ))}
              
              {filteredPackages.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                    No packages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. The Modal */}
      <PackageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        t={t} 
        editData={editingData} 
      />

    </div>
  );
}