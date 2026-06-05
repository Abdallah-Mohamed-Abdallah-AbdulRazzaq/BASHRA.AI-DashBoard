"use client";

import React, { useState, useMemo } from "react";
import { AddressHeader } from "./address-header";
import { AddressModal } from "./address-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";

interface DistrictsViewProps { t: any; }

export default function DistrictsView({ t }: DistrictsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 👈 States للفلاتر
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const [districts, setDistricts] = useState([
    { id: 30, name_en: "Makram Ebeid", name_ar: "مكرم عبيد", parent_id: 22, parent_name: "Nasr City", city_id: 12, country_id: 2, image: "", created_at: "2025-01-20" },
    { id: 31, name_en: "Abbas El Akkad", name_ar: "عباس العقاد", parent_id: 22, parent_name: "Nasr City", city_id: 12, country_id: 2, image: "", created_at: "2025-01-21" },
    { id: 33, name_en: "Al Faisaliyah", name_ar: "الفيصلية", parent_id: 21, parent_name: "Al Malaz", city_id: 10, country_id: 1, image: "", created_at: "2025-01-25" },
  ]);

  const countryOptions = [
    { id: 1, name: "Saudi Arabia" },
    { id: 2, name: "Egypt" },
  ];

  const allCityOptions = [
    { id: 10, name: "Riyadh", country_id: 1 },
    { id: 12, name: "Cairo", country_id: 2 },
  ];

  const allRegionOptions = [
    { id: 21, name: "Al Malaz", city_id: 10, country_id: 1 },
    { id: 22, name: "Nasr City", city_id: 12, country_id: 2 },
  ];

  // Cascading Logic
  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    setSelectedCity("");
    setSelectedRegion("");
  };

  const handleCityChange = (val: string) => {
    setSelectedCity(val);
    setSelectedRegion("");
  };

  const availableCities = useMemo(() => {
    return selectedCountry ? allCityOptions.filter(c => c.country_id.toString() === selectedCountry) : allCityOptions;
  }, [selectedCountry]);

  const availableRegions = useMemo(() => {
    let filtered = allRegionOptions;
    if (selectedCountry) filtered = filtered.filter(r => r.country_id.toString() === selectedCountry);
    if (selectedCity) filtered = filtered.filter(r => r.city_id.toString() === selectedCity);
    return filtered;
  }, [selectedCountry, selectedCity]);

  // فلترة الجدول
  const filteredDistricts = useMemo(() => {
    return districts.filter(d => {
      const matchesSearch = d.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || d.name_ar.includes(searchTerm);
      const matchesCountry = selectedCountry ? d.country_id.toString() === selectedCountry : true;
      const matchesCity = selectedCity ? d.city_id.toString() === selectedCity : true;
      const matchesRegion = selectedRegion ? d.parent_id.toString() === selectedRegion : true;
      return matchesSearch && matchesCountry && matchesCity && matchesRegion;
    });
  }, [districts, searchTerm, selectedCountry, selectedCity, selectedRegion]);

  // ... الدوال الاساسية
  const handleAddNew = () => { setEditingData(null); setIsModalOpen(true); };
  const handleEdit = (district: any) => { setEditingData(district); setIsModalOpen(true); };
  const handleDelete = (id: number) => { if(confirm("Are you sure?")) setDistricts(districts.filter(d => d.id !== id)); };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <AddressHeader 
        title={t.sidebar.districts} 
        totalCount={filteredDistricts.length}
        searchPlaceholder={t.clinic.search || "Search..."}
        btnAddText={t.address.add_new}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
        // 👈 تمرير 3 فلاتر متسلسلة
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
            onChange: handleCityChange
          },
          {
            placeholder: t.address.all_regions || "All Regions",
            value: selectedRegion,
            options: availableRegions,
            onChange: setSelectedRegion
          }
        ]}
      />

      {/* ... (نفس كود الجدول السابق لـ Districts) ... */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.address.image}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.address.parent} (Region)</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">Date Added</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((district) => (
                <tr key={district.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  <td className="py-3 px-6"><div className="w-10 h-10 rounded-[8px] border border-[#E7E8EB] overflow-hidden bg-[#F5F6F8] flex items-center justify-center shadow-sm">{district.image ? <img src={district.image} alt={district.name_en} className="w-full h-full object-cover" /> : <span className="text-[10px] text-[#9DA4B0]">N/A</span>}</div></td>
                  <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{district.name_en}</span></td>
                  <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{district.name_ar}</span></td>
                  <td className="py-3 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#FFF9F2] text-[#F2994A] border border-[#F2994A]/20">{district.parent_name}</span></td>
                  <td className="py-3 px-6"><span className="text-[13px] text-[#6C7688]" dir="ltr">{district.created_at}</span></td>
                  <td className="py-3 px-6 text-end"><CustomDropdown trigger={<button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all"><MoreVerticalIcon /></button>} items={[{ label: t.address.edit, onClick: () => handleEdit(district) }, { label: t.address.delete, onClick: () => handleDelete(district.id), className: "text-[#EF1E1E]" }]} width="w-32" align="end"/></td>
                </tr>
              ))}
              {filteredDistricts.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">No districts found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} t={t} levelType="district" editData={editingData} parentOptions={allRegionOptions} />
    </div>
  );
}