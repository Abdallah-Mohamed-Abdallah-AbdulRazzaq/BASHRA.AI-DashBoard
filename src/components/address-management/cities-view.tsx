"use client";

import React, { useState, useMemo } from "react";
import { AddressHeader } from "./address-header";
import { AddressModal } from "./address-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";

interface CitiesViewProps { t: any; }

export default function CitiesView({ t }: CitiesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 👈 State للفلتر
  const [selectedCountry, setSelectedCountry] = useState("");

  const [cities, setCities] = useState([
    { id: 10, name_en: "Riyadh", name_ar: "الرياض", parent_id: 1, parent_name: "Saudi Arabia", image: "", created_at: "2025-01-20" },
    { id: 11, name_en: "Jeddah", name_ar: "جدة", parent_id: 1, parent_name: "Saudi Arabia", image: "", created_at: "2025-01-21" },
    { id: 12, name_en: "Cairo", name_ar: "القاهرة", parent_id: 2, parent_name: "Egypt", image: "", created_at: "2025-01-22" },
    { id: 13, name_en: "Dubai", name_ar: "دبي", parent_id: 3, parent_name: "United Arab Emirates", image: "", created_at: "2025-01-25" },
  ]);

  const countryOptions = [
    { id: 1, name: "Saudi Arabia" },
    { id: 2, name: "Egypt" },
    { id: 3, name: "United Arab Emirates" },
  ];

  // 👈 لوجيك الفلترة المدمج (بحث + فلتر dropdown)
  const filteredCities = useMemo(() => {
    return cities.filter(c => {
      const matchesSearch = c.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || c.name_ar.includes(searchTerm);
      const matchesCountry = selectedCountry ? c.parent_id.toString() === selectedCountry : true;
      return matchesSearch && matchesCountry;
    });
  }, [cities, searchTerm, selectedCountry]);

  // ... (باقي دوال الإضافة والحذف كما هي)
  const handleAddNew = () => { setEditingData(null); setIsModalOpen(true); };
  const handleEdit = (city: any) => { setEditingData(city); setIsModalOpen(true); };
  const handleDelete = (id: number) => { if(confirm("Are you sure?")) setCities(cities.filter(c => c.id !== id)); };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <AddressHeader 
        title={t.sidebar.cities} 
        totalCount={filteredCities.length} // تحديث العداد ديناميكياً
        searchPlaceholder={t.clinic.search || "Search..."}
        btnAddText={t.address.add_new}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
        // 👈 تمرير الفلاتر للهيدر
        filters={[
          {
            placeholder: t.address.all_countries || "All Countries",
            value: selectedCountry,
            options: countryOptions,
            onChange: setSelectedCountry
          }
        ]}
      />

      {/* ... (نفس كود الجدول السابق لـ cities بدون تغيير) ... */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.address.image}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.address.parent} (Country)</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">Date Added</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCities.map((city) => (
                <tr key={city.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  <td className="py-3 px-6"><div className="w-10 h-10 rounded-[8px] border border-[#E7E8EB] overflow-hidden bg-[#F5F6F8] flex items-center justify-center shadow-sm">{city.image ? <img src={city.image} alt={city.name_en} className="w-full h-full object-cover" /> : <span className="text-[10px] text-[#9DA4B0]">N/A</span>}</div></td>
                  <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39]">{city.name_en}</span></td>
                  <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39]">{city.name_ar}</span></td>
                  <td className="py-3 px-6"><span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#F0FDF4] text-[#27AE60] border border-[#27AE60]/20">{city.parent_name}</span></td>
                  <td className="py-3 px-6"><span className="text-[13px] text-[#6C7688]" dir="ltr">{city.created_at}</span></td>
                  <td className="py-3 px-6 text-end"><CustomDropdown trigger={<button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all"><MoreVerticalIcon /></button>} items={[{ label: t.address.edit, onClick: () => handleEdit(city) }, { label: t.address.delete, onClick: () => handleDelete(city.id), className: "text-[#EF1E1E]" }]} width="w-32" align="end"/></td>
                </tr>
              ))}
              {filteredCities.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">No cities found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} t={t} levelType="city" editData={editingData} parentOptions={countryOptions} />
    </div>
  );
}