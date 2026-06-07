"use client";

import React, { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AiIcon, CalendarIcon, CommandIcon, NotificationIcon,
  SearchIcon, SettingsIcon, GlobeIcon
} from "@/components/ui/icons/icons";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { HamburgerIcon, SearchIconMobile } from "@/components/ui/icons/sidebar-icons";
// import { NotificationsPopover } from "./notifications-popover";
import { ProfilePopover } from "./profile-popover";
import { useDictionary } from "@/components/shared/dictionary-provider";
import { getCurrentAdminFromStorage } from "@/lib/admin-auth";

import { AiAssistantChat } from "./ai-assistant-chat"; 

export function Header() {
  const { toggle } = useSidebarStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [isAiChatOpen, setIsAiChatOpen] = useState(false); 
  
  const { dictionary } = useDictionary();
  const router = useRouter();
  const pathname = usePathname();

  const admin = useMemo(() => getCurrentAdminFromStorage(), []);

  const toggleLanguage = () => {
    if (!pathname) return;
    const segments = pathname.split('/');
    const currentLang = segments[1];
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    segments[1] = newLang;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <>
      <header className="flex h-[60px] md:h-[52px] w-full items-center justify-between border-b border-border bg-background px-4 md:px-6 py-2 sticky top-0 z-30 transition-colors duration-300">
        
        <div className="flex items-center gap-4 flex-1">
          <button onClick={toggle} className="md:hidden flex items-center justify-center p-1 rounded-md text-foreground hover:bg-brand-light transition-colors">
            <HamburgerIcon />
          </button>

          <div className="hidden md:flex flex-1 max-w-[400px]">
            <div className="flex h-[32px] w-full items-center gap-[10px] rounded-[6px] border border-border bg-background px-[6px] py-[6px] pl-3 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-brand-primary">
              <div className="text-muted-foreground"><SearchIcon /></div>
              <input
                type="text"
                placeholder={dictionary.common.search_placeholder}
                className="flex-1 bg-transparent text-[14px] font-normal leading-[21px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-center gap-2 rounded-[8px] bg-brand-light p-1"><CommandIcon /></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-brand-light transition-colors"><SearchIconMobile /></button>

          {/* 👇 ربط الزر لفتح الشات */}
          <button 
            onClick={() => setIsAiChatOpen(true)}
            className="hidden sm:flex h-[32px] items-center justify-center gap-1 rounded-[6px] bg-gradient-to-r from-[#2E37A4] to-[#0E9384] px-[10px] py-[6px] text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <AiIcon />
            <span className="text-[13px] font-semibold leading-[19.5px]">{dictionary.header.ai_assistance}</span>
          </button>

          <div className="flex items-center gap-1 md:gap-[10px]">
            <button onClick={toggleLanguage} className="flex h-8 w-8 items-center justify-center rounded-[20px] border border-border bg-background text-foreground shadow-sm hover:bg-brand-light transition-colors group" title="Switch Language">
              <GlobeIcon />
            </button>

            {/* <button className="flex h-8 w-8 items-center justify-center rounded-[20px] border border-border bg-background text-foreground shadow-sm hover:bg-brand-light transition-colors">
              <SettingsIcon />
            </button> */}

            {/* <div className="relative">
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative flex h-8 w-8 items-center justify-center rounded-[20px] border border-border bg-background text-foreground shadow-sm hover:bg-brand-light transition-colors">
                 <NotificationIcon />
                <span className="absolute right-[10px] top-[8px] h-[6px] w-[6px] rounded-full bg-destructive" />
              </button>
              <NotificationsPopover isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
            </div> */}
          </div>

          <div className="relative">
            <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="relative flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-transparent hover:ring-border transition-all cursor-pointer">
              {admin?.profile_picture_url ? (
                <img src={admin.profile_picture_url} alt="User" className="h-full w-full rounded-full object-cover"/>
              ) : (
                <div className="h-full w-full rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-bold">
                  {(admin?.full_name || admin?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-[1px] flex items-center justify-center rounded-[20px] bg-background p-[2px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 5 5" fill="none"><path d="M5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0C3.88071 0 5 1.11929 5 2.5Z" fill="#27AE60"/></svg>
              </div>
            </div>
            <ProfilePopover isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
          </div>
        </div>
      </header>

      {/* 👇 استدعاء المكون هنا خارج الـ Header لكي لا يتأثر بالـ overflow */}
      <AiAssistantChat isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
    </>
  );
}