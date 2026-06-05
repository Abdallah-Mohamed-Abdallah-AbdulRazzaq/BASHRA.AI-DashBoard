"use client";

import React, { useState } from "react";
import { MedicalArticleModal } from "./medical-article-modal";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { cn } from "@/lib/utils";
import { 
  PlusIcon, 
  SearchIcon, 
  MoreVerticalIcon 
} from "@/components/ui/icons/dashboard-icons";

interface ArticlesViewProps {
  t: any;
}

export default function ArticlesView({ t }: ArticlesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Dummy Data (Matching `medical_articles` SQL Table) ---
  const [articles, setArticles] = useState([
    { 
      id: 1, 
      title_en: "The Benefits of Vitamin C", 
      title_ar: "فوائد فيتامين سي", 
      sub_title_en: "How it protects and brightens your skin",
      sub_title_ar: "كيف يحمي ويضيء بشرتك",
      description_en: "Vitamin C is a potent antioxidant that can neutralize free radicals...",
      description_ar: "فيتامين سي هو مضاد أكسدة قوي يمكنه تحييد الجذور الحرة...",
      is_active: true, 
      created_at: "2025-02-15 10:30 AM" 
    },
    { 
      id: 2, 
      title_en: "Understanding Eczema", 
      title_ar: "فهم الإكزيما", 
      sub_title_en: "Causes, Triggers, and Treatments",
      sub_title_ar: "الأسباب، المحفزات، والعلاجات",
      description_en: "Eczema is a condition that makes your skin red and itchy...",
      description_ar: "الإكزيما هي حالة تجعل بشرتك حمراء ومثيرة للحكة...",
      is_active: true, 
      created_at: "2025-02-10 02:15 PM" 
    },
    { 
      id: 3, 
      title_en: "Daily Skincare Routine", 
      title_ar: "روتين العناية بالبشرة اليومي", 
      sub_title_en: "Basic steps for healthy and glowing skin",
      sub_title_ar: "خطوات أساسية لبشرة صحية ومشرقة",
      description_en: "A good skincare routine is essential. Start with a gentle cleanser...",
      description_ar: "روتين العناية الجيد ضروري. ابدأ بغسول لطيف...",
      is_active: false, 
      created_at: "2025-01-25 09:00 AM" 
    },
  ]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (article: any) => {
    setEditingData(article);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setArticles(articles.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a));
  };

  const filteredArticles = articles.filter(article => 
    article.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.title_ar.includes(searchTerm) ||
    article.sub_title_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1B39]">{t.health_tips.articles_title}</h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {articles.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <input 
              type="text" 
              placeholder={t.health_tips.search_articles}
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
            <PlusIcon /> {t.health_tips.add_new_article}
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="bg-white border border-[#E7E8EB] rounded-[12px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full overflow-x-auto min-h-[400px]">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-[#FAFBFC]">
              <tr className="border-b border-[#E7E8EB]">
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.health_tips.title_en}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[30%]">{t.health_tips.title_ar}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.health_tips.date_added}</th>
                <th className="py-4 px-6 text-start text-[13px] font-bold text-[#0A1B39] w-[15%]">{t.health_tips.status}</th>
                <th className="py-4 px-6 text-end text-[13px] font-bold text-[#0A1B39] w-[10%]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F9FAFB] transition-colors group">
                  
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{article.title_en}</span>
                      <span className="text-[12px] text-[#6C7688] font-medium truncate max-w-[250px]">{article.sub_title_en}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">{article.title_ar}</span>
                      <span className="text-[12px] text-[#6C7688] font-medium truncate max-w-[250px]">{article.sub_title_ar}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-[13px] text-[#6C7688] font-medium" dir="ltr">{article.created_at}</span>
                  </td>

                  <td className="py-4 px-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={article.is_active} onChange={() => handleToggleStatus(article.id)} />
                      <div className="w-9 h-5 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#27AE60]"></div>
                      <span className={cn("ml-2 rtl:mr-2 rtl:ml-0 text-[11px] font-bold", article.is_active ? "text-[#27AE60]" : "text-[#9DA4B0]")}>
                        {article.is_active ? t.health_tips.active : t.health_tips.inactive}
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
                        { label: t.health_tips.edit_article, onClick: () => handleEdit(article) },
                        { label: t.common?.delete || "Delete", onClick: () => handleDelete(article.id), className: "text-[#EF1E1E] hover:text-[#EF1E1E] hover:bg-[#FEF2F2]" }
                      ]}
                      width="w-32"
                      align="end"
                    />
                  </td>

                </tr>
              ))}
              
              {filteredArticles.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[14px] text-[#6C7688]">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. The Modal */}
      <MedicalArticleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        t={t} 
        editData={editingData} 
      />

    </div>
  );
}