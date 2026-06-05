"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownSmall } from "@/components/ui/icons/dashboard-icons";
import { Globe, Map, Navigation, Compass, Network} from "lucide-react";

interface AddressHierarchyViewProps {
  t: any;
}

// ---------------------------------------------------------------------------
// 1. Recursive Tree Node Component
// ---------------------------------------------------------------------------
const TreeNode = ({ node, level, t, isAllExpanded }: { node: any, level: number, t: any, isAllExpanded: boolean }) => {
  const [isOpen, setIsOpen] = useState(isAllExpanded);
  
  // تحديث الحالة إذا تم النقر على زر "توسيع الكل" من الخارج
  React.useEffect(() => {
    setIsOpen(isAllExpanded);
  }, [isAllExpanded]);

  const hasChildren = node.children && node.children.length > 0;

  // إعدادات التصميم بناءً على المستوى (Level)
  const levelConfig = {
    0: { icon: Globe, color: "text-[#2E37A4]", bg: "bg-[#F5F6F8]", border: "border-[#2E37A4]", badgeBg: "bg-[#E0E2F4] text-[#2E37A4]", label: t.sidebar.countries }, // Country
    1: { icon: Map, color: "text-[#27AE60]", bg: "bg-white", border: "border-[#27AE60]", badgeBg: "bg-[#F0FDF4] text-[#27AE60]", label: t.sidebar.cities },     // City
    2: { icon: Navigation, color: "text-[#F2994A]", bg: "bg-[#FAFBFC]", border: "border-[#F2994A]", badgeBg: "bg-[#FFF9F2] text-[#F2994A]", label: t.sidebar.regions }, // Region
    3: { icon: Compass, color: "text-[#6C7688]", bg: "bg-white", border: "border-[#E7E8EB]", badgeBg: "bg-[#F5F6F8] text-[#6C7688]", label: t.sidebar.districts }  // District
  };

  const currentConfig = levelConfig[level as keyof typeof levelConfig] || levelConfig[3];
  const Icon = currentConfig.icon;

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Node Header (Clickable) */}
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
          {/* Icon */}
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", currentConfig.badgeBg)}>
            <Icon size={16} />
          </div>
          
          {/* Name */}
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#0A1B39] group-hover:text-[#2E37A4] transition-colors">
              {node.name_en} <span className="text-[#9DA4B0] font-normal mx-1">/</span> <span className="text-[13px]">{node.name_ar}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Children Count Badge */}
          {hasChildren && (
            <span className={cn("px-2.5 py-0.5 text-[11px] font-semibold rounded-full", currentConfig.badgeBg)}>
               {node.children.length} {t.address.contains}
            </span>
          )}
          
          {/* Chevron */}
          {hasChildren && (
            <div className={cn("text-[#6C7688] transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")}>
              <ChevronDownSmall />
            </div>
          )}
        </div>
      </div>

      {/* Children Container (Animated) */}
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-3 mb-2" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pl-8 rtl:pl-0 rtl:pr-8 relative">
            {/* Vertical Tree Line */}
            <div className="absolute top-0 bottom-0 left-[20px] rtl:left-auto rtl:right-[20px] w-[2px] bg-[#E7E8EB] rounded-full"></div>
            
            {/* Render Children */}
            {node.children?.map((child: any) => (
              <div key={child.id} className="relative">
                {/* Horizontal Branch Line */}
                <div className="absolute top-[22px] left-[-12px] rtl:left-auto rtl:right-[-12px] w-[12px] h-[2px] bg-[#E7E8EB]"></div>
                <TreeNode node={child} level={level + 1} t={t} isAllExpanded={isAllExpanded} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 2. Main View Component
// ---------------------------------------------------------------------------
export default function AddressHierarchyView({ t }: AddressHierarchyViewProps) {
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  // --- الهيكل الشجري (Mock Data) يمثل البيانات بعد دمج الـ Parent IDs ---
  const hierarchyData = [
    {
      id: 1, name_en: "Saudi Arabia", name_ar: "المملكة العربية السعودية",
      children: [
        {
          id: 10, name_en: "Riyadh", name_ar: "الرياض",
          children: [
            {
              id: 20, name_en: "Al Olaya", name_ar: "العليا",
              children: [
                { id: 30, name_en: "King Fahd Road", name_ar: "طريق الملك فهد" },
                { id: 31, name_en: "Tahlia Street", name_ar: "شارع التحلية" }
              ]
            },
            {
              id: 21, name_en: "Al Malaz", name_ar: "الملز",
              children: [
                { id: 32, name_en: "Siteen Street", name_ar: "شارع الستين" }
              ]
            }
          ]
        },
        {
          id: 11, name_en: "Jeddah", name_ar: "جدة",
          children: [
            {
              id: 22, name_en: "Al Rawdah", name_ar: "الروضة",
              children: [
                { id: 33, name_en: "Tahlia Dist", name_ar: "حي التحلية" }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2, name_en: "Egypt", name_ar: "مصر",
      children: [
        {
          id: 12, name_en: "Cairo", name_ar: "القاهرة",
          children: [
            {
              id: 23, name_en: "Nasr City", name_ar: "مدينة نصر",
              children: [
                { id: 34, name_en: "Makram Ebeid", name_ar: "مكرم عبيد" },
                { id: 35, name_en: "Abbas El Akkad", name_ar: "عباس العقاد" }
              ]
            },
            {
              id: 24, name_en: "Maadi", name_ar: "المعادي",
              children: [] // فارغ للتجربة
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 bg-[#F5F6F8] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm">
        <div>
          <h2 className="text-[20px] font-bold text-[#0A1B39]">{t.sidebar.address_hierarchy}</h2>
          <p className="text-[13px] text-[#6C7688] mt-1">View the complete structure of locations from Countries to Districts.</p>
        </div>
        
        {/* Expand / Collapse All Toggle */}
        <button 
          onClick={() => setIsAllExpanded(!isAllExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E8EB] text-[#0A1B39] rounded-[8px] text-[13px] font-semibold hover:bg-[#F5F6F8] transition-colors shadow-sm"
        >
          <Network size={16} className="text-[#2E37A4]" />
          {isAllExpanded ? t.address.collapse_all : t.address.expand_all}
        </button>
      </div>

      {/* Tree Container */}
      <div className="bg-white p-6 border border-[#E7E8EB] rounded-[12px] shadow-sm">
        <div className="flex flex-col gap-4">
          {hierarchyData.map((country) => (
            <TreeNode 
              key={country.id} 
              node={country} 
              level={0} 
              t={t} 
              isAllExpanded={isAllExpanded} 
            />
          ))}
        </div>
      </div>

    </div>
  );
}