"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownSmall } from "@/components/ui/icons/dashboard-icons";
import { Globe, Map, Navigation, Compass, Network } from "lucide-react";
import { AdminLocationsService } from "@/lib/admin-locations";
import { LocationEntity } from "@/types/admin-locations";
import { getApiErrorMessage } from "@/lib/error-utils";

interface AddressHierarchyViewProps {
  t: any;
  lang?: string;
}

const levelConfig = {
  0: { icon: Globe, color: "text-[#2E37A4]", bg: "bg-[#F5F6F8]", border: "border-[#2E37A4]", badgeBg: "bg-[#E0E2F4] text-[#2E37A4]" },
  1: { icon: Map, color: "text-[#27AE60]", bg: "bg-white", border: "border-[#27AE60]", badgeBg: "bg-[#F0FDF4] text-[#27AE60]" },
  2: { icon: Navigation, color: "text-[#F2994A]", bg: "bg-[#FAFBFC]", border: "border-[#F2994A]", badgeBg: "bg-[#FFF9F2] text-[#F2994A]" },
  3: { icon: Compass, color: "text-[#6C7688]", bg: "bg-white", border: "border-[#E7E8EB]", badgeBg: "bg-[#F5F6F8] text-[#6C7688]" }
};

const getLevelIndex = (levelType: string) => {
  switch (levelType) {
    case "country": return 0;
    case "city": return 1;
    case "region": return 2;
    case "district": return 3;
    default: return 3;
  }
};

const TreeNode = ({ node, t, isAllExpanded, lang }: { node: any, t: any, isAllExpanded: boolean, lang: string }) => {
  const [isOpen, setIsOpen] = useState(isAllExpanded);
  
  useEffect(() => {
    setIsOpen(isAllExpanded);
  }, [isAllExpanded]);

  const hasChildren = node.children && node.children.length > 0;
  const level = getLevelIndex(node.level_type);
  const currentConfig = levelConfig[level as keyof typeof levelConfig] || levelConfig[3];
  const Icon = currentConfig.icon;
  const name = lang === "ar" ? node.name_ar : node.name_en;
  const secondaryName = lang === "ar" ? node.name_en : node.name_ar;

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-top-2 duration-300">
      <div 
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between p-3 rounded-[8px] border transition-all duration-200 select-none group",
          hasChildren ? "cursor-pointer hover:shadow-sm" : "",
          currentConfig.bg,
          isOpen ? `border-l-4 rtl:border-l-0 rtl:border-r-4 ${currentConfig.border} shadow-sm` : "border-[#E7E8EB] border-l-4 rtl:border-l-0 rtl:border-r-4 border-transparent hover:border-[#E7E8EB]"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", currentConfig.badgeBg)}>
            <Icon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">
              {name} <span className="text-[#9DA4B0] font-normal mx-1">/</span> <span className="text-[13px]">{secondaryName}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {hasChildren && (
            <span className={cn("px-2.5 py-0.5 text-[11px] font-semibold rounded-full", currentConfig.badgeBg)}>
               {node.children.length} {t.address?.contains || "contains"}
            </span>
          )}
          {hasChildren && (
            <div className={cn("text-[#6C7688] transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}>
              <ChevronDownSmall />
            </div>
          )}
        </div>
      </div>

      <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100 mt-3 mb-2" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pl-8 rtl:pl-0 rtl:pr-8 relative">
            <div className="absolute top-0 bottom-0 left-[20px] rtl:left-auto rtl:right-[20px] w-[2px] bg-[#E7E8EB] rounded-full"></div>
            {node.children?.map((child: any) => (
              <div key={child.id} className="relative">
                <div className="absolute top-[22px] left-[-12px] rtl:left-auto rtl:right-[-12px] w-[12px] h-[2px] bg-[#E7E8EB]"></div>
                <TreeNode node={child} t={t} isAllExpanded={isAllExpanded} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AddressHierarchyView({ t, lang = "en" }: AddressHierarchyViewProps) {
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [countries, setCountries] = useState<LocationEntity[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | "">("");
  const [hierarchyData, setHierarchyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await AdminLocationsService.getCountries(lang as "en" | "ar");
        if (res.success && res.data) {
          setCountries(res.data);
          if (res.data.length > 0) {
            setSelectedCountryId(res.data[0].id!);
          }
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, [lang]);

  const fetchHierarchy = useCallback(async (countryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await AdminLocationsService.getHierarchy(countryId, lang as "en" | "ar");
      if (res.success && res.data?.full_hierarchy) {
        const data = res.data.full_hierarchy;
        
        const map = new globalThis.Map<number, any>();
        const roots: any[] = [];
        data.forEach(item => map.set(item.id!, { ...item, children: [] }));
        
        data.forEach(item => {
          if (item.parent_id && map.has(item.parent_id)) {
            map.get(item.parent_id).children.push(map.get(item.id!));
          } else {
            roots.push(map.get(item.id!));
          }
        });
        
        setHierarchyData(roots);
      } else {
        setHierarchyData([]);
        setError(t.address?.action_failed || "Failed to load hierarchy");
      }
    } catch (err) {
      setHierarchyData([]);
      setError(getApiErrorMessage(err, lang as "en" | "ar") || t.address?.action_failed);
    } finally {
      setLoading(false);
    }
  }, [lang, t]);

  useEffect(() => {
    if (selectedCountryId !== "") {
      fetchHierarchy(selectedCountryId as number);
    } else {
      setHierarchyData([]);
    }
  }, [selectedCountryId, fetchHierarchy]);

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm">
        <div>
          <h2 className="text-[20px] font-bold text-[#0A1B39]">{t.sidebar?.address_hierarchy || "Address Hierarchy"}</h2>
          <p className="text-[13px] text-[#6C7688] mt-1">{t.address?.hierarchy_desc || "View the complete structure of locations."}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <select 
            value={selectedCountryId} 
            onChange={(e) => setSelectedCountryId(e.target.value ? Number(e.target.value) : "")}
            className="h-10 px-3 bg-white border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] min-w-[200px]"
          >
            <option value="" disabled>{t.address?.select_country || "Select Country"}</option>
            {countries.map(c => (
              <option key={c.id} value={c.id}>{lang === "ar" ? c.name_ar : c.name_en}</option>
            ))}
          </select>

          <button 
            onClick={() => setIsAllExpanded(!isAllExpanded)}
            disabled={loading || hierarchyData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E8EB] text-[#0A1B39] rounded-[8px] text-[13px] font-semibold hover:bg-[#F5F6F8] transition-colors shadow-sm disabled:opacity-50"
          >
            <Network size={16} className="text-[#2E37A4]" />
            {isAllExpanded ? (t.address?.collapse_all || "Collapse All") : (t.address?.expand_all || "Expand All")}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border border-[#E7E8EB] rounded-[12px] shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="w-8 h-8 border-4 border-[#2E37A4] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[14px] text-[#6C7688]">{t.common?.loading || "Loading..."}</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-red-600">
            <p>{error}</p>
            <button onClick={() => selectedCountryId && fetchHierarchy(selectedCountryId as number)} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md font-medium text-sm transition-colors mt-2">
              {t.address?.retry || "Retry"}
            </button>
          </div>
        ) : hierarchyData.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-[#6C7688]">
            {selectedCountryId === "" ? (t.address?.select_country_desc || "Please select a country to view its hierarchy.") : (t.address?.no_data || "No hierarchy data found.")}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {hierarchyData.map((node) => (
              <TreeNode 
                key={node.id} 
                node={node} 
                t={t} 
                isAllExpanded={isAllExpanded} 
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}