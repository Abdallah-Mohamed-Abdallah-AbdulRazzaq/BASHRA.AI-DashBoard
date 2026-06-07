"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AddressHeader } from "./address-header";
import { AddressModal } from "./address-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";
import { AdminLocationsService } from "@/lib/admin-locations";
import { LocationEntity } from "@/types/admin-locations";
import { getApiErrorMessage } from "@/lib/error-utils";

interface CountriesViewProps {
  t: any;
  lang?: string;
}

export default function CountriesView({ t, lang = "en" }: CountriesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<LocationEntity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [countries, setCountries] = useState<LocationEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await AdminLocationsService.getCountries(lang as "ar" | "en");
      if (res.success) {
        setCountries(res.data || []);
      } else {
        setError(res.message || t.address?.action_failed);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, lang as "en" | "ar") || t.address?.action_failed);
    } finally {
      setLoading(false);
    }
  }, [lang, t]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (country: LocationEntity) => {
    setEditingData(country);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm(t.address?.confirm_delete || "Are you sure you want to delete this country?")) {
      try {
        setLoading(true);
        const res = await AdminLocationsService.deleteLocation(id);
        if (res.success) {
          await fetchCountries();
        } else {
          alert(res.message || t.address?.action_failed);
          setLoading(false);
        }
      } catch (err) {
        alert(getApiErrorMessage(err, lang as "en" | "ar"));
        setLoading(false);
      }
    }
  };

  const filteredCountries = countries.filter(c => 
    (c.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) || "") || 
    (c.name_ar?.includes(searchTerm) || "")
  );

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <AddressHeader 
        title={t.sidebar.countries} 
        totalCount={filteredCountries.length}
        searchPlaceholder={t.common?.search_placeholder || "Search..."}
        btnAddText={t.address.add_new}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
      />

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <p className="mb-4">{error}</p>
          <button onClick={fetchCountries} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md font-medium text-sm transition-colors">
            {t.address?.retry || "Retry"}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full overflow-x-auto min-h-[400px]">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#FAFBFC]">
                <tr className="border-b border-[#E7E8EB]">
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.address.image}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.address.name_en}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.address.name_ar}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.health_tips?.date_added || "Date Added"}</th>
                  <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCountries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                      {t.address?.no_countries_found || "No countries found."}
                    </td>
                  </tr>
                ) : (
                  filteredCountries.map((country) => (
                    <tr key={country.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                      
                      <td className="py-3 px-6">
                        <div className="w-10 h-7 rounded-[4px] border border-[#E7E8EB] overflow-hidden bg-[#F5F6F8] flex items-center justify-center shadow-sm">
                          {country.image ? (
                            <img src={country.image} alt={country.name_en} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-[#9DA4B0]">N/A</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-6">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{country.name_en}</span>
                      </td>

                      <td className="py-3 px-6">
                        <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{country.name_ar}</span>
                      </td>

                      <td className="py-3 px-6">
                        <span className="text-[13px] text-[#6C7688]" dir="ltr">
                          {country.created_at ? new Date(country.created_at).toLocaleDateString() : "—"}
                        </span>
                      </td>

                      <td className="py-3 px-6 text-end">
                        <CustomDropdown 
                          trigger={
                            <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                              <MoreVerticalIcon />
                            </button>
                          }
                          items={[
                            { label: t.address.edit, onClick: () => handleEdit(country) },
                            { label: t.address.delete, onClick: () => country.id && handleDelete(country.id), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                          ]}
                          width="w-32"
                          align="end"
                        />
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <AddressModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          t={t} 
          lang={lang}
          levelType="country" 
          editData={editingData} 
          onSuccess={fetchCountries}
        />
      )}
    </div>
  );
}