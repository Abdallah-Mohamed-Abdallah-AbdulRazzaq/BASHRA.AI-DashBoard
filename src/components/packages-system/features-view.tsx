"use client";

import React, { useState } from "react";
import { FeatureModal } from "./feature-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  SearchIcon, 
  MoreVerticalIcon,
  Layers
} from "lucide-react"; // نستخدم lucide-react لأننا أضفناها مسبقاً

interface FeaturesViewProps {
  t: any;
}

export default function FeaturesView({ t }: FeaturesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Dummy Data (Matching `features` SQL Table) ---
  const [features, setFeatures] = useState([
    { 
      id: 1, 
      name_en: "Doctor Accounts", 
      name_ar: "حسابات الأطباء", 
      unit_en: "Accounts",
      unit_ar: "حساب",
      is_active: true, 
      created_at: "2025-01-20 10:30 AM" 
    },
    { 
      id: 2, 
      name_en: "Cloud Storage", 
      name_ar: "التخزين السحابي", 
      unit_en: "GB",
      unit_ar: "جيجابايت",
      is_active: true, 
      created_at: "2025-01-22 02:15 PM" 
    },
    { 
      id: 3, 
      name_en: "SMS Reminders", 
      name_ar: "رسائل التذكير النصية", 
      unit_en: "Messages/Month",
      unit_ar: "رسالة/شهر",
      is_active: false, 
      created_at: "2025-01-25 09:00 AM" 
    },
    { 
      id: 4, 
      name_en: "AI Diagnosis Scans", 
      name_ar: "فحوصات الذكاء الاصطناعي", 
      unit_en: "Scans",
      unit_ar: "فحص",
      is_active: true, 
      created_at: "2025-02-10 11:00 AM" 
    },
  ]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (feature: any) => {
    setEditingData(feature);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this feature?")) {
      setFeatures(features.filter(f => f.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setFeatures(features.map(f => f.id === id ? { ...f, is_active: !f.is_active } : f));
  };

  const filteredFeatures = features.filter(feature => 
    feature.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    feature.name_ar.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E0E2F4] text-[#2E37A4] flex items-center justify-center shrink-0">
            <Layers size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1B39] leading-tight">{t.packages.features_title}</h2>
            <span className="text-[12px] font-medium text-[#6C7688]">Total: {features.length} features</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <input 
              type="text" 
              placeholder={t.packages.search_features}
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
            <PlusIcon size={16} /> {t.packages.add_new_feature}
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[35%]">{t.packages.feature_name_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[35%]">{t.packages.feature_name_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.packages.date_added}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.packages.status}</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredFeatures.map((feature) => (
                <tr key={feature.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{feature.name_en}</span>
                      {feature.unit_en && <span className="text-[11px] font-medium text-[#6C7688] bg-white border border-[#E7E8EB] px-2 py-0.5 rounded w-fit">Unit: {feature.unit_en}</span>}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{feature.name_ar}</span>
                      {feature.unit_ar && <span className="text-[11px] font-medium text-[#6C7688] bg-white border border-[#E7E8EB] px-2 py-0.5 rounded w-fit">الوحدة: {feature.unit_ar}</span>}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-[13px] text-[#6C7688] font-medium" dir="ltr">{feature.created_at}</span>
                  </td>

                  <td className="py-4 px-6">
                    {/* Toggle Switch in Table */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={feature.is_active} onChange={() => handleToggleStatus(feature.id)} />
                      <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]"></div>
                      <span className={cn("ml-2 rtl:mr-2 rtl:ml-0 text-[11px] font-bold", feature.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                        {feature.is_active ? t.packages.active : t.packages.inactive}
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
                        { label: t.packages.edit_feature, onClick: () => handleEdit(feature) },
                        { label: t.common?.delete || "Delete", onClick: () => handleDelete(feature.id), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                      ]}
                      width="w-32"
                      align="end"
                    />
                  </td>

                </tr>
              ))}
              
              {filteredFeatures.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                    No features found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. The Modal */}
      <FeatureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        t={t} 
        editData={editingData} 
      />

    </div>
  );
}