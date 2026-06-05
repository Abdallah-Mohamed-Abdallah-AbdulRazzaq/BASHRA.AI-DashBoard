"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  onClick: () => void;
  className?: string;
}

interface CustomDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  width?: string;
  align?: "start" | "end";
}

export const CustomDropdown = ({ trigger, items, width = "w-40", align = "start" }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={cn(
            "absolute top-full z-50 mt-2 bg-white border border-[#E7E8EB] rounded-[8px] shadow-lg py-1 animate-in fade-in zoom-in-95 duration-200",
            width,
            // 🚀 الحل الجذري: استخدام CSS أصلي للمحاذاة الذكية
            // inset-inline-start = left in LTR, right in RTL
            // inset-inline-end = right in LTR, left in RTL
            align === "start" ? "[inset-inline-start:0]" : "[inset-inline-end:0]"
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "block w-full text-start px-4 py-2.5 text-[13px] hover:bg-[#F5F6F8] transition-colors",
                item.className || "text-[#6C7688] hover:text-[#0A1B39]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};