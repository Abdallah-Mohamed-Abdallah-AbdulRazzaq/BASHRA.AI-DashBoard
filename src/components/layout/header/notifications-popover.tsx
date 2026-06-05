"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, Clock, MoreHorizontal, Settings } from "lucide-react";
import { useDictionary } from "@/components/shared/dictionary-provider"; // استدعاء الترجمة

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPopover({ isOpen, onClose }: NotificationsPopoverProps) {
  const { dictionary, isRTL } = useDictionary(); // استخدام القاموس والاتجاه

  // نقل البيانات لداخل المكون لاستخدام الترجمة
  const notifications = [
    {
      id: 1,
      title: dictionary.notifications.new_patient,
      message: dictionary.notifications.patient_desc,
      time: "2 min ago",
      unread: true,
      type: "user",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: 2,
      title: dictionary.notifications.dr_note,
      message: dictionary.notifications.note_desc,
      time: "1 hour ago",
      unread: true,
      type: "user",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: 3,
      title: dictionary.notifications.system_update,
      message: dictionary.notifications.update_desc,
      time: "Yesterday",
      unread: false,
      type: "system",
      image: null,
    },
    {
      id: 4,
      title: dictionary.notifications.hr_msg,
      message: dictionary.notifications.hr_desc,
      time: "2 days ago",
      unread: false,
      type: "message",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose}
      />

      <div className={cn(
        "absolute mt-3 w-[360px] origin-top-right rounded-xl border border-border bg-card shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 overflow-hidden",
        isRTL ? "left-[-60px] md:left-0 origin-top-left" : "right-[-60px] md:right-0 origin-top-right"
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-foreground">{dictionary.notifications.title}</h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
              2
            </span>
          </div>
          <div className="flex gap-2">
             <button className="text-muted-foreground hover:text-primary transition-colors">
                <Settings size={16} />
             </button>
             <button className="text-[12px] text-primary hover:underline font-medium transition-colors">
                {dictionary.notifications.mark_all_read}
             </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "group flex gap-3 px-4 py-4 border-b border-border last:border-0 hover:bg-secondary/40 transition-all cursor-pointer relative",
                    notification.unread ? "bg-primary/[0.03]" : ""
                  )}
                >
                  <div className="relative flex-shrink-0">
                    {notification.image ? (
                        <img 
                            src={notification.image} 
                            alt={notification.title}
                            className="h-10 w-10 rounded-full object-cover border border-border"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Check size={18} />
                        </div>
                    )}
                    
                    {notification.unread && (
                        <span className={cn("absolute bottom-0 h-3 w-3 rounded-full bg-primary border-2 border-card", isRTL ? "left-0" : "right-0")}></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <p className={cn(
                            "text-[14px] truncate px-1", 
                            notification.unread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                        )}>
                            {notification.title}
                        </p>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                            {notification.time}
                        </span>
                    </div>
                    
                    <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                    </p>
                  </div>

                  <div className={cn("absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity", isRTL ? "left-2" : "right-2")}>
                      <button className="p-1 rounded-full hover:bg-background border border-transparent hover:border-border text-muted-foreground shadow-sm">
                          <MoreHorizontal size={16} />
                      </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                 <Check className="h-6 w-6 opacity-50" />
              </div>
              <p className="text-[14px]">{dictionary.notifications.caught_up}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-secondary/10">
            <button className="flex items-center justify-center w-full py-2 rounded-md bg-background border border-border text-[13px] font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-all shadow-sm">
                {dictionary.notifications.view_all}
            </button>
        </div>

      </div>
    </>
  );
}