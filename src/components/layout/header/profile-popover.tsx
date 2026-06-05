"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { User, Settings, Bell, CreditCard, LogOut } from "lucide-react";
import { useDictionary } from "@/components/shared/dictionary-provider";
import { useRouter, useParams } from "next/navigation";
import { getCurrentAdminFromStorage, logoutAdminLocal } from "@/lib/admin-auth";
import { apiPost } from "@/lib/api";
import { getAdminAccessToken } from "@/lib/api";

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfilePopover({ isOpen, onClose }: ProfilePopoverProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const { dictionary, isRTL } = useDictionary();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const admin = getCurrentAdminFromStorage();

  const handleNavigateToProfile = () => {
    onClose();
    router.push(`/${lang}/settings/profile`);
  };

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      if (getAdminAccessToken()) {
        await apiPost('/api/auth-admin/logout', {}, { auth: true }).catch(() => {});
      }
    } finally {
      logoutAdminLocal();
      setLoggingOut(false);
      onClose();
      router.replace(`/${lang}/login`);
    }
  }, [onClose, router, lang]);

  if (!isOpen) return null;

  const displayName = admin?.full_name || admin?.email || dictionary.profile.name;
  const displayRole = admin?.admin_type
    ? admin.admin_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : dictionary.profile.role;
  const profileImage = admin?.profile_picture_url;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div className={cn(
        "absolute mt-3 w-[260px] rounded-xl border border-border bg-card shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 overflow-hidden",
        isRTL ? "left-0 origin-top-left" : "right-0 origin-top-right"
      )}>
        
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border bg-secondary/10">
          <div className="relative h-10 w-10 flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={displayName} className="h-full w-full rounded-full object-cover border border-border" />
            ) : (
              <div className="h-full w-full rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-bold border border-border">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={cn("absolute bottom-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-card", isRTL ? "left-0" : "right-0")}></span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <h4 className="text-[14px] font-semibold text-foreground truncate">{displayName}</h4>
            <p className="text-[12px] text-muted-foreground truncate">{displayRole}</p>
          </div>
        </div>

        <div className="flex flex-col py-2">
          <button onClick={handleNavigateToProfile} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-colors group">
            <User size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            {dictionary.profile.profile_settings}
          </button>

          <button className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-colors group">
            <Settings size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            {dictionary.profile.account_settings}
          </button>

          <div className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary/50 transition-colors cursor-pointer group" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
            <div className="flex items-center gap-3">
               <Bell size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
               <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors">{dictionary.profile.notifications_toggle}</span>
            </div>
            <div className={cn("w-8 h-4 rounded-full p-0.5 transition-colors duration-300", notificationsEnabled ? "bg-primary" : "bg-muted")}>
                <div className={cn("w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300", notificationsEnabled ? (isRTL ? "-translate-x-4" : "translate-x-4") : "translate-x-0")} />
            </div>
          </div>

          <button className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-colors group">
            <CreditCard size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            {dictionary.profile.transactions}
          </button>
        </div>

        <div className="border-t border-border mt-1 p-2">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? 'Logging out...' : dictionary.profile.logout}
          </button>
        </div>
      </div>
    </>
  );
}
