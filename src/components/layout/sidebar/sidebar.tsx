"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { useDictionary } from "@/components/shared/dictionary-provider"; 
import { getSidebarData } from "@/constants/menu-data"; 
import { 
  LogoIcon, 
  SwitchVerticalIcon, 
  TreeActiveIcon, 
  TreeInactiveIcon,
  CloseIcon 
} from "@/components/ui/icons/sidebar-icons";

import Image from "next/image";

export function Sidebar() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Dashboard": false,
    "Applications": false
  });
  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  
  const { isOpen, onClose, isCollapsed, toggleCollapse } = useSidebarStore();
  const pathname = usePathname();
  const { dictionary, lang, isRTL } = useDictionary(); 

  const sidebarData = getSidebarData(dictionary, lang);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const toggleGroup = (title: string) => {
    if (isCollapsed) return;
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleSubGroup = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCollapsed) return;
    setOpenSubGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const currentWidth = isCollapsed ? "w-[88px]" : "w-[276px]";
  const hoverWidth = isCollapsed ? "md:hover:w-[276px]" : "";

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm" />
      )}

      {/* Spacer: يحجز مكاناً في الصفحة لكي لا يختفي المحتوى تحت السايدبار */}
      <div className={cn("hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out", currentWidth)} />

      <aside 
        className={cn(
          "fixed top-0 h-screen bg-background shadow-sm z-50 flex flex-col transition-all duration-300 ease-in-out group overflow-hidden",
          currentWidth,
          hoverWidth,
          // 1. تحديد المكان (يمين أو يسار)
          isRTL ? "right-0 border-l border-border" : "left-0 border-r border-border",
          
          // 2. حركة الموبايل (الانزلاق من اليمين أو اليسار)
          !isOpen && (isRTL ? "translate-x-full md:translate-x-0" : "-translate-x-full md:translate-x-0")
        )}
      >
        {/* HEADER */}
        <div className="flex flex-col w-full flex-shrink-0">
          <div className="flex h-[64px] items-center px-6 border-b border-border relative">
            <div className={cn(
              "flex items-center gap-[10px] whitespace-nowrap transition-all duration-300",
              isCollapsed ? "justify-center w-full group-hover:justify-start group-hover:w-auto" : ""
            )}>
              <img
                src="/images/BashraAI_logo-32.svg"
                alt="Logo"
                // className="block w-[30px] h-[27px] object-contain"
                // className="block w-[30px] h-[30px] object-cover rounded-full border-2 border-border overflow-hidden"
                className="block w-[30px] h-[30px] object-cover rounded-full border border-border overflow-hidden"
                // className="block w-[30px] h-[30px] object-contain rounded-full border-2 border-border overflow-hidden"

              />
              <span className={cn(
                "font-inter text-[18px] font-bold text-foreground transition-opacity duration-200",
                isCollapsed ? "opacity-0 w-0 hidden group-hover:block group-hover:opacity-100 group-hover:w-auto" : "opacity-100"
              )}>Admin Bashra AI</span>
            </div>
            
            {/* Toggle Button */}
            <button onClick={toggleCollapse} className={cn(
                "absolute top-1/2 -translate-y-1/2 h-[24px] w-[24px] items-center justify-center rounded-full bg-brand-light hover:bg-secondary border border-border z-50 hidden md:flex transition-opacity duration-200",
                // عكس مكان الزر في العربية
                isRTL ? "left-4" : "right-4",
                isCollapsed ? "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto" : "opacity-100"
              )}>
               {/* عكس اتجاه السهم */}
               {isCollapsed 
                  ? (isRTL ? <ChevronLeft size={14} className="text-foreground" /> : <ChevronRight size={14} className="text-foreground" />) 
                  : (isRTL ? <ChevronRight size={14} className="text-foreground" /> : <ChevronLeft size={14} className="text-foreground" />)
               }
            </button>
            
            <button onClick={onClose} className={cn("md:hidden absolute flex h-[28px] w-[28px] items-center justify-center rounded-[20px] bg-brand-light", isRTL ? "left-4" : "right-4")}>
                <CloseIcon />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          
          {/* CLINIC SELECTOR */}
          <div className="px-6 transition-all duration-300">
            <div className={cn(
                "flex items-center rounded-[6px] border border-border bg-background shadow-sm cursor-pointer hover:bg-brand-light transition-all overflow-hidden whitespace-nowrap",
                isCollapsed ? "justify-center p-0 border-none shadow-none bg-transparent h-10 w-10 mx-auto group-hover:w-full group-hover:justify-between group-hover:p-2 group-hover:border group-hover:bg-background group-hover:shadow-sm" : "justify-between p-2"
              )}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">B</div>
                <div className={cn("flex flex-col transition-all duration-200", isCollapsed ? "opacity-0 w-0 hidden group-hover:flex group-hover:w-auto group-hover:opacity-100" : "flex")}>
                  <span className="text-[14px] font-semibold text-foreground">Admin Dashboard</span>
                  <span className="text-[13px] font-normal text-muted-foreground">Power by Bashra AI</span>
                </div>
              </div>
            </div>
          </div>

          {/* MENUS */}
          <div className="flex flex-col gap-2">
            {sidebarData.map((section, index) => (
              <div key={index} className="flex flex-col">
                {section.title && (
                  <div className={cn(
                    "px-6 py-2 transition-all duration-200 overflow-hidden whitespace-nowrap", 
                    isCollapsed ? "h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:py-2" : ""
                  )}>
                    <span className="text-[13px] font-medium text-muted-foreground uppercase tracking-wide">{section.title}</span>
                  </div>
                )}

                <div className="flex flex-col px-3 gap-1">
                  {section.items.map((item, i) => {
                    const hasSubmenu = item.submenu && item.submenu.length > 0;
                    const isOpenGroup = openGroups[item.title];
                    const isParentActive = item.href === pathname || 
                      (hasSubmenu && item.submenu?.some((sub: any) => sub.href === pathname || sub.submenu?.some((deepSub: any) => deepSub.href === pathname)));

                    return (
                      <div key={i} className="flex flex-col">
                        <div
                          onClick={() => hasSubmenu && toggleGroup(item.title)}
                          className={cn(
                            "flex cursor-pointer items-center rounded-[6px] transition-all border border-transparent overflow-hidden whitespace-nowrap relative group/item",
                            isParentActive ? "bg-brand-primary/10 border-brand-primary/20 shadow-sm" : "hover:bg-brand-light",
                            isCollapsed ? "justify-center px-0 py-2.5 mx-0 w-10 self-center group-hover:w-auto group-hover:self-stretch group-hover:justify-start group-hover:px-3 group-hover:mx-3" : "justify-start px-3 py-2.5 mx-3"
                          )}
                        >
                          <div className={cn("flex-shrink-0 z-10 flex items-center justify-center transition-colors", 
                            isParentActive ? "text-brand-primary" : "text-muted-foreground group-hover/item:text-brand-primary")}> 
                            {item.icon && <item.icon className="h-5 w-5" />}
                          </div>

                          <div className={cn("flex items-center justify-between flex-1 ms-3 transition-all duration-200", isCollapsed ? "opacity-0 w-0 hidden group-hover:flex group-hover:w-auto group-hover:opacity-100" : "flex")}>
                             {hasSubmenu ? (
                               <span className={cn("text-[14px] font-medium leading-[21px] transition-colors", isParentActive ? "text-brand-primary" : "text-foreground group-hover/item:text-brand-primary")}>{item.title}</span>
                             ) : (
                               <Link href={item.href || "#"} className={cn("text-[14px] font-medium leading-[21px] transition-colors flex-1", isParentActive ? "text-brand-primary" : "text-foreground group-hover/item:text-brand-primary")}>{item.title}</Link>
                             )}
                             
                             {hasSubmenu && (
                               <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isOpenGroup ? "rotate-180" : "")} />
                             )}
                          </div>
                        </div>

                        {/* SUBMENU - Note: padding-left becomes padding-start for RTL support */}
                        {hasSubmenu && isOpenGroup && (
                          <div className={cn("flex flex-col mt-1 transition-all duration-200", isCollapsed ? "hidden group-hover:flex" : "flex")}>
                            {item.submenu?.map((subItem: any, j: number) => {
                               const hasDeepSubmenu = subItem.submenu && subItem.submenu.length > 0;
                               const isDeepOpen = openSubGroups[subItem.title];
                               const isSubActive = pathname === subItem.href || (hasDeepSubmenu && subItem.submenu.some((deep: any) => deep.href === pathname));

                               return (
                                <div key={j} className="flex flex-col">
                                  <div
                                    onClick={(e) => hasDeepSubmenu ? toggleSubGroup(e, subItem.title) : null}
                                    className="group/sub relative h-[32px] overflow-hidden whitespace-nowrap pe-2"
                                  >
                                    <div className="flex items-center h-full w-full">
                                        <div className={cn("ms-8 me-2 flex-shrink-0 transition-colors", isSubActive ? "text-brand-primary" : "text-border group-hover/sub:text-brand-primary")}> 
                                            {isSubActive ? <TreeActiveIcon /> : <TreeInactiveIcon />}
                                        </div>
                                        
                                        {hasDeepSubmenu ? (
                                            <div className="flex-1 flex items-center justify-between cursor-pointer">
                                                <span className={cn("text-[14px] font-normal leading-[21px] transition-colors", isSubActive ? "text-brand-primary" : "text-muted-foreground group-hover/sub:text-brand-primary")}>{subItem.title}</span>
                                                <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200", isDeepOpen ? "rotate-180" : "")} />
                                            </div>
                                        ) : (
                                            <Link href={subItem.href || "#"} className="flex-1 flex items-center justify-between">
                                                <span className={cn("text-[14px] font-normal leading-[21px] transition-colors", isSubActive ? "text-brand-primary" : "text-muted-foreground group-hover/sub:text-brand-primary")}>{subItem.title}</span>
                                            </Link>
                                        )}
                                    </div>
                                  </div>

                                  {/* LEVEL 3 */}
                                  {hasDeepSubmenu && isDeepOpen && (
                                    <div className="flex flex-col">
                                      {subItem.submenu.map((deepItem: any, k: number) => {
                                        const isDeepActive = pathname === deepItem.href;
                                        return (
                                          <Link
                                            key={k}
                                            href={deepItem.href}
                                            className="flex items-center group/deep relative h-[32px] overflow-hidden whitespace-nowrap"
                                          >
                                            <div className={cn("ms-12 me-2 flex-shrink-0 transition-colors", isDeepActive ? "text-brand-primary" : "text-border group-hover/deep:text-brand-primary")}> 
                                              {isDeepActive ? <TreeActiveIcon /> : <TreeInactiveIcon />}
                                            </div>
                                            <span className={cn("text-[14px] font-normal leading-[21px] transition-colors", isDeepActive ? "text-brand-primary" : "text-muted-foreground group-hover/deep:text-brand-primary")}>
                                              {deepItem.title}
                                            </span>
                                          </Link>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}