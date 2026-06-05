"use client";

import React, { useState } from "react";
import { SkinDiseaseModal } from "./skin-disease-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  SearchIcon, 
  MoreVerticalIcon 
} from "@/components/ui/icons/dashboard-icons";

// أيقونة الرابط الخارجي للجدول
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

interface SkinDiseasesViewProps {
  t: any;
}

export default function SkinDiseasesView({ t }: SkinDiseasesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Dummy Data (Matching `skin_diseases_info` SQL Table) ---
  const [diseases, setDiseases] = useState([
    { 
      id: 1, 
      title_en: "Psoriasis", 
      title_ar: "الصدفية", 
      description_en: "A condition in which skin cells build up and form scales and itchy, dry patches.",
      description_ar: "حالة تتراكم فيها خلايا الجلد وتشكل قشوراً وبقعاً جافة ومثيرة للحكة.",
      website_link: "https://www.mayoclinic.org/diseases-conditions/psoriasis",
      is_active: true, 
      created_at: "2025-02-18 11:00 AM" 
    },
    { 
      id: 2, 
      title_en: "Acne Vulgaris", 
      title_ar: "حب الشباب", 
      description_en: "A skin condition that occurs when your hair follicles become plugged with oil and dead skin cells.",
      description_ar: "حالة جلدية تحدث عندما تنسد بصيلات الشعر بالزيوت وخلايا الجلد الميتة.",
      website_link: "https://www.aad.org/public/diseases/acne",
      is_active: true, 
      created_at: "2025-02-10 09:30 AM" 
    },
    { 
      id: 3, 
      title_en: "Vitiligo", 
      title_ar: "البهاق", 
      description_en: "A disease that causes the loss of skin color in blotches.",
      description_ar: "مرض يسبب فقدان لون الجلد على شكل بقع.",
      website_link: "", // لا يوجد رابط
      is_active: false, 
      created_at: "2025-01-20 04:15 PM" 
    },
  ]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (disease: any) => {
    setEditingData(disease);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this info?")) {
      setDiseases(diseases.filter(d => d.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setDiseases(diseases.map(d => d.id === id ? { ...d, is_active: !d.is_active } : d));
  };

  const filteredDiseases = diseases.filter(disease => 
    disease.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    disease.title_ar.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1B39]">{t.health_tips.skin_diseases_title}</h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {diseases.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <input 
              type="text" 
              placeholder={t.health_tips.search_diseases}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2.5 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
            />
            <span className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]">
               <SearchIcon />
            </span>
          </div>

          <button 
            onClick={handleAddNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200 shrink-0"
          >
            <PlusIcon /> {t.health_tips.add_new_disease}
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.health_tips.title_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[25%]">{t.health_tips.title_ar}</th>
                <th className="py-4 px-4 text-center text-[13px] font-bold text-[#0A1B39] w-[15%]">Link</th>
                <th className="py-4 px-4 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.health_tips.date_added}</th>
                <th className="py-4 px-4 text-start text-[13px] font-bold text-[#0A1B39] w-[10%]">{t.health_tips.status}</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDiseases.map((disease) => (
                <tr key={disease.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{disease.title_en}</span>
                      <span className="text-[12px] text-[#6C7688] truncate max-w-[220px]">{disease.description_en}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{disease.title_ar}</span>
                      <span className="text-[12px] text-[#6C7688] truncate max-w-[220px]">{disease.description_ar}</span>
                    </div>
                  </td>

                  {/* Website Link Column */}
                  <td className="py-4 px-4 text-center">
                    {disease.website_link ? (
                      <a 
                        href={disease.website_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2F80ED] hover:bg-[#2F80ED] hover:text-white transition-colors text-[11px] font-bold rounded-[6px] border border-[#2F80ED]/20"
                      >
                        <ExternalLinkIcon /> {t.health_tips.visit_link}
                      </a>
                    ) : (
                      <span className="text-[12px] text-[#9DA4B0]">-</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[13px] text-[#6C7688] font-medium" dir="ltr">{disease.created_at}</span>
                  </td>

                  <td className="py-4 px-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={disease.is_active} onChange={() => handleToggleStatus(disease.id)} />
                      <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]"></div>
                      <span className={cn("ml-2 rtl:mr-2 rtl:ml-0 text-[11px] font-bold", disease.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                        {disease.is_active ? t.health_tips.active : t.health_tips.inactive}
                      </span>
                    </label>
                  </td>

                  <td className="py-4 px-6 text-end">
                    <CustomDropdown 
                      trigger={
                        <button className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[#E7E8EB] text-[#6C7688] hover:border-[#2E37A4] hover:text-[#2E37A4] hover:bg-white transition-all">
                          <MoreVerticalIcon />
                        </button>
                      }
                      items={[
                        { label: t.health_tips.edit_disease, onClick: () => handleEdit(disease) },
                        { label: t.common?.delete || "Delete", onClick: () => handleDelete(disease.id), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                      ]}
                      width="w-32"
                      align="end"
                    />
                  </td>

                </tr>
              ))}
              
              {filteredDiseases.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[14px] text-[#6C7688]">
                    No skin diseases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. The Modal */}
      <SkinDiseaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        t={t} 
        editData={editingData} 
      />

    </div>
  );
}