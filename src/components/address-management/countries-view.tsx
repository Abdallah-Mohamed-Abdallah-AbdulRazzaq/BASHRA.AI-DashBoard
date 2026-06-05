"use client";

import React, { useState } from "react";
import { AddressHeader } from "./address-header";
import { AddressModal } from "./address-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";

interface CountriesViewProps {
  t: any;
}

export default function CountriesView({ t }: CountriesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Dummy Data المطابقة لجدول countries_cities ---
  const [countries, setCountries] = useState([
    { id: 1, name_en: "Saudi Arabia", name_ar: "المملكة العربية السعودية", image: "https://flagcdn.com/w80/sa.png", created_at: "2025-01-20" },
    { id: 2, name_en: "Egypt", name_ar: "مصر", image: "https://flagcdn.com/w80/eg.png", created_at: "2025-01-22" },
    { id: 3, name_en: "United Arab Emirates", name_ar: "الإمارات العربية المتحدة", image: "https://flagcdn.com/w80/ae.png", created_at: "2025-01-25" },
  ]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (country: any) => {
    setEditingData(country);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this country?")) {
      setCountries(countries.filter(c => c.id !== id));
    }
  };

  const filteredCountries = countries.filter(c => 
    c.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.name_ar.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Page Header */}
      <AddressHeader 
        title={t.sidebar.countries} 
        totalCount={countries.length}
        searchPlaceholder={t.clinic.search || "Search..."}
        btnAddText={t.address.add_new}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
      />

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[800px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.address.image}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.address.name_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.address.name_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">Date Added</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country) => (
                <tr key={country.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  
                  {/* Image / Flag */}
                  <td className="py-3 px-6">
                    <div className="w-10 h-7 rounded-[4px] border border-[#E7E8EB] overflow-hidden bg-[#F5F6F8] flex items-center justify-center shadow-sm">
                      {country.image ? (
                        <img src={country.image} alt={country.name_en} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-[#9DA4B0]">N/A</span>
                      )}
                    </div>
                  </td>

                  {/* English Name */}
                  <td className="py-3 px-6">
                    <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{country.name_en}</span>
                  </td>

                  {/* Arabic Name */}
                  <td className="py-3 px-6">
                    <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{country.name_ar}</span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-6">
                    <span className="text-[13px] text-[#6C7688]" dir="ltr">{country.created_at}</span>
                  </td>

                  {/* Actions (Using our standard CustomDropdown) */}
                  <td className="py-3 px-6 text-end">
                    <CustomDropdown 
                      trigger={
                        <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                          <MoreVerticalIcon />
                        </button>
                      }
                      items={[
                        { label: t.address.edit, onClick: () => handleEdit(country) },
                        { label: t.address.delete, onClick: () => handleDelete(country.id), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                      ]}
                      width="w-32"
                      align="end" // تفتح للداخل لتجنب الخروج من الشاشة
                    />
                  </td>

                </tr>
              ))}
              
              {filteredCountries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                    No countries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. The Reusable Modal Form */}
      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        t={t} 
        levelType="country" 
        editData={editingData} 
      />

    </div>
  );
}