"use client";

import React, { useState, useMemo } from "react";
import { AddressHeader } from "./address-header";
import { AddressModal } from "./address-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";

interface RegionsViewProps { t: any; }

export default function RegionsView({ t }: RegionsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 👈 States للفلاتر المتسلسلة
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // في قاعدة البيانات الحقيقية، الـ API سيجلب هذه البيانات. هنا نضع `country_id` للمحاكاة.
  const [regions, setRegions] = useState([
    { id: 20, name_en: "Al Olaya", name_ar: "العليا", parent_id: 10, parent_name: "Riyadh", country_id: 1, image: "", created_at: "2025-01-20" },
    { id: 21, name_en: "Al Malaz", name_ar: "الملز", parent_id: 10, parent_name: "Riyadh", country_id: 1, image: "", created_at: "2025-01-21" },
    { id: 22, name_en: "Nasr City", name_ar: "مدينة نصر", parent_id: 12, parent_name: "Cairo", country_id: 2, image: "", created_at: "2025-01-22" },
  ]);

  const countryOptions = [
    { id: 1, name: "Saudi Arabia" },
    { id: 2, name: "Egypt" },
  ];

  const allCityOptions = [
    { id: 10, name: "Riyadh", country_id: 1 },
    { id: 11, name: "Jeddah", country_id: 1 },
    { id: 12, name: "Cairo", country_id: 2 },
  ];

  // فلترة المدن بناءً على البلد المختار (Cascading Logic)
  const availableCities = useMemo(() => {
    if (!selectedCountry) return allCityOptions;
    return allCityOptions.filter(city => city.country_id.toString() === selectedCountry);
  }, [selectedCountry]);

  // عند تغيير البلد، نقوم بتفريغ حقل المدينة تلقائياً
  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    setSelectedCity(""); 
  };

  // فلترة الجدول النهائي
  const filteredRegions = useMemo(() => {
    return regions.filter(r => {
      const matchesSearch = r.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || r.name_ar.includes(searchTerm);
      const matchesCountry = selectedCountry ? r.country_id.toString() === selectedCountry : true;
      const matchesCity = selectedCity ? r.parent_id.toString() === selectedCity : true;
      return matchesSearch && matchesCountry && matchesCity;
    });
  }, [regions, searchTerm, selectedCountry, selectedCity]);

  // ... الدوال الاساسية
  const handleAddNew = () => { setEditingData(null); setIsModalOpen(true); };
  const handleEdit = (region: any) => { setEditingData(region); setIsModalOpen(true); };
  const handleDelete = (id: number) => { if(confirm("Are you sure?")) setRegions(regions.filter(r => r.id !== id)); };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <AddressHeader 
        title={t.sidebar.regions} 
        totalCount={filteredRegions.length}
        searchPlaceholder={t.clinic.search || "Search..."}
        btnAddText={t.address.add_new}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
        // 👈 تمرير فلاتر البلد والمدينة
        filters={[
          {
            placeholder: t.address.all_countries || "All Countries",
            value: selectedCountry,
            options: countryOptions,
            onChange: handleCountryChange
          },
          {
            placeholder: t.address.all_cities || "All Cities",
            value: selectedCity,
            options: availableCities,
            onChange: setSelectedCity
          }
        ]}
      />

      {/* ... (نفس كود الجدول السابق لـ Regions) ... */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.address.image}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.address.parent} (City)</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">Date Added</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRegions.map((region) => (
                <tr key={region.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  <td className="py-3 px-6"><div className="w-10 h-10 rounded-[8px] border border-[#E7E8EB] overflow-hidden bg-[#F5F6F8] flex items-center justify-center shadow-sm">{region.image ? <img src={region.image} alt={region.name_en} className="w-full h-full object-cover" /> : <span className="text-[10px] text-[#9DA4B0]">N/A</span>}</div></td>
                  <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{region.name_en}</span></td>
                  <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{region.name_ar}</span></td>
                  <td className="py-3 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#EFF6FF] text-[#2F80ED] border border-[#2F80ED]/20">{region.parent_name}</span></td>
                  <td className="py-3 px-6"><span className="text-[13px] text-[#6C7688]" dir="ltr">{region.created_at}</span></td>
                  <td className="py-3 px-6 text-end"><CustomDropdown trigger={<button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all"><MoreVerticalIcon /></button>} items={[{ label: t.address.edit, onClick: () => handleEdit(region) }, { label: t.address.delete, onClick: () => handleDelete(region.id), className: "text-[#EF1E1E]" }]} width="w-32" align="end"/></td>
                </tr>
              ))}
              {filteredRegions.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">No regions found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} t={t} levelType="region" editData={editingData} parentOptions={allCityOptions} />
    </div>
  );
}