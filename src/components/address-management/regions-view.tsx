"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { AddressHeader } from "./address-header";
import { AddressModal } from "./address-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { MoreVerticalIcon } from "@/components/ui/icons/dashboard-icons";
import { AdminLocationsService } from "@/lib/admin-locations";
import { LocationEntity } from "@/types/admin-locations";
import { getApiErrorMessage } from "@/lib/error-utils";

interface RegionsViewProps { t: any; lang?: string; }

export default function RegionsView({ t, lang = "en" }: RegionsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<LocationEntity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countries, setCountries] = useState<LocationEntity[]>([]);
  const [cities, setCities] = useState<LocationEntity[]>([]);
  const [regions, setRegions] = useState<LocationEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [countriesRes, citiesRes, regionsRes] = await Promise.all([
        AdminLocationsService.getCountries(lang as "ar" | "en"),
        AdminLocationsService.getLocations({ level_type: "city", lang: lang as "en" | "ar" }),
        AdminLocationsService.getLocations({ level_type: "region", lang: lang as "en" | "ar" })
      ]);

      if (countriesRes.success && citiesRes.success && regionsRes.success) {
        setCountries(countriesRes.data || []);
        setCities(citiesRes.data || []);
        setRegions(regionsRes.data || []);
      } else {
        setError(t.address?.action_failed || "Failed to load data");
      }
    } catch (err) {
      setError(getApiErrorMessage(err, lang as "en" | "ar") || t.address?.action_failed);
    } finally {
      setLoading(false);
    }
  }, [lang, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const countryOptions = countries.map(c => ({ id: c.id!, name: lang === "ar" ? c.name_ar : c.name_en }));
  const allCityOptions = cities.map(c => ({ id: c.id!, name: lang === "ar" ? c.name_ar : c.name_en, country_id: c.parent_id }));

  const availableCities = useMemo(() => {
    if (!selectedCountry) return allCityOptions;
    return allCityOptions.filter(city => city.country_id?.toString() === selectedCountry);
  }, [selectedCountry, allCityOptions]);

  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    setSelectedCity(""); 
  };

  const filteredRegions = useMemo(() => {
    return regions.filter(r => {
      const matchesSearch = (r.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) || "") || (r.name_ar?.includes(searchTerm) || "");
      const rCity = cities.find(c => c.id === r.parent_id);
      const rCountryId = rCity?.parent_id?.toString();
      const matchesCountry = selectedCountry ? rCountryId === selectedCountry : true;
      const matchesCity = selectedCity ? r.parent_id?.toString() === selectedCity : true;
      return matchesSearch && matchesCountry && matchesCity;
    });
  }, [regions, cities, searchTerm, selectedCountry, selectedCity]);

  const handleAddNew = () => { setEditingData(null); setIsModalOpen(true); };
  const handleEdit = (region: LocationEntity) => { setEditingData(region); setIsModalOpen(true); };
  
  const handleDelete = async (id: number) => {
    if (confirm(t.address?.confirm_delete || "Are you sure?")) {
      try {
        setLoading(true);
        const res = await AdminLocationsService.deleteLocation(id);
        if (res.success) {
          await fetchData();
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

  const getCityName = (parentId?: number | null) => {
    if (!parentId) return "—";
    const city = cities.find(c => c.id === parentId);
    return city ? (lang === "ar" ? city.name_ar : city.name_en) : "—";
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      <AddressHeader 
        title={t.sidebar.regions} 
        totalCount={filteredRegions.length}
        searchPlaceholder={t.common?.search_placeholder || "Search..."}
        btnAddText={t.address.add_new}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
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

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex flex-col items-center justify-center min-h-[200px]">
          <p className="mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md font-medium text-sm transition-colors">
            {t.address?.retry || "Retry"}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full overflow-x-auto min-h-[400px]">
            <table className="w-full min-w-[900px]">
              <thead className="bg-[#FAFBFC]">
                <tr className="border-b border-[#E7E8EB]">
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.address.image}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_en}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.address.name_ar}</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[20%]">{t.address.parent} (City)</th>
                  <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.health_tips?.date_added || "Date Added"}</th>
                  <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[13px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRegions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">
                      {t.address?.no_regions_found || "No regions found."}
                    </td>
                  </tr>
                ) : (
                  filteredRegions.map((region) => (
                    <tr key={region.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                      <td className="py-3 px-6">
                        <div className="w-10 h-10 relative rounded-[8px] border border-[#E7E8EB] overflow-hidden bg-[#F5F6F8] flex items-center justify-center shadow-sm">
                          {region.image ? <Image src={region.image} alt={region.name_en || 'Region'} fill className="object-cover" unoptimized /> : <span className="text-[10px] text-[#9DA4B0]">N/A</span>}
                        </div>
                      </td>
                      <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{region.name_en}</span></td>
                      <td className="py-3 px-6"><span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{region.name_ar}</span></td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#EFF6FF] text-[#2F80ED] border border-[#2F80ED]/20">
                          {getCityName(region.parent_id)}
                        </span>
                      </td>
                      <td className="py-3 px-6"><span className="text-[13px] text-[#6C7688]" dir="ltr">{region.created_at ? new Date(region.created_at).toLocaleDateString() : "—"}</span></td>
                      <td className="py-3 px-6 text-end">
                        <CustomDropdown 
                          trigger={<button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all"><MoreVerticalIcon /></button>} 
                          items={[
                            { label: t.address.edit, onClick: () => handleEdit(region) }, 
                            { label: t.address.delete, onClick: () => region.id && handleDelete(region.id), className: "text-[#EF1E1E] hover:bg-[#FEF2F2]" }
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
          levelType="region" 
          editData={editingData} 
          parentOptions={allCityOptions}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}