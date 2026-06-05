"use client";

import React from "react";
import { PlusIcon, SearchIcon, FilterIcon } from "@/components/ui/icons/dashboard-icons";

// تعريف نوع الفلتر
export interface FilterOption {
  placeholder: string;
  value: string | number;
  options: { id: string | number; name: string }[];
  onChange: (value: string) => void;
}

interface AddressHeaderProps {
  title: string;
  totalCount: number;
  searchPlaceholder: string;
  btnAddText: string;
  onAddNew: () => void;
  onSearch: (term: string) => void;
  filters?: FilterOption[]; // 👈 إضافة الفلاتر كخاصية اختيارية
}

export const AddressHeader = ({ title, totalCount, searchPlaceholder, btnAddText, onAddNew, onSearch, filters }: AddressHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 w-full bg-white p-5 border border-[#E7E8EB] rounded-[12px] shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* الصف الأول: العنوان وزر الإضافة */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0A1B39]">{title}</h2>
          <span className="px-3 py-1 bg-[#E0E2F4]/50 text-[#2E37A4] text-[12px] font-semibold rounded-[6px] border border-[#E0E2F4]">
            {totalCount}
          </span>
        </div>

        <button 
          onClick={onAddNew}
          className="hidden sm:flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shadow-indigo-200 shrink-0"
        >
          <PlusIcon /> {btnAddText}
        </button>
      </div>

      {/* الخط الفاصل */}
      <div className="w-full border-t border-[#E7E8EB]"></div>

      {/* الصف الثاني: الفلاتر ومربع البحث */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 w-full">
        
        {/* منطقة الفلاتر الديناميكية */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {filters && filters.length > 0 && (
            <div className="flex items-center gap-2 text-[#6C7688] mr-2 rtl:ml-2 rtl:mr-0">
              <FilterIcon />
            </div>
          )}
          
          {filters?.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="h-10 px-3 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] font-medium focus:outline-none focus:border-[#2E37A4] transition-colors min-w-[140px] cursor-pointer"
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          ))}
        </div>

        {/* منطقة البحث */}
        <div className="relative w-full xl:w-[300px]">
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2.5 bg-[#F9FAFB] border border-[#E7E8EB] rounded-[8px] text-[13px] text-[#0A1B39] placeholder:text-[#9DA4B0] focus:outline-none focus:border-[#2E37A4] transition-colors"
          />
          <span className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-[#9DA4B0]">
             <SearchIcon />
          </span>
        </div>

        {/* زر الإضافة للموبايل فقط */}
        <button 
          onClick={onAddNew}
          className="sm:hidden w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2E37A4] text-white rounded-[8px] text-[13px] font-semibold hover:bg-[#252D88] transition-colors shadow-sm shrink-0"
        >
          <PlusIcon /> {btnAddText}
        </button>

      </div>

    </div>
  );
};