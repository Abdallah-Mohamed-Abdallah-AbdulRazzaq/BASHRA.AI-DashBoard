"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { XIcon, SendIcon, BotIcon, UserIcon, Loader2Icon } from "lucide-react";
import { useDictionary } from "@/components/shared/dictionary-provider";

interface AiAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiAssistantChat({ isOpen, onClose }: AiAssistantChatProps) {
  const { dictionary, isRTL } = useDictionary();
  const t = dictionary.ai_chat;
  
  // State للمسجات المبدئية
  const [messages, setMessages] = useState([
    { role: "ai", content: t.welcome_message }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // النزول التلقائي لأسفل الشات عند إضافة رسالة جديدة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  if (!isOpen) return null;

  // دالة إرسال مبدئية (سنقوم بربطها بالـ API الحقيقي في الخطوة القادمة)
//   const handleSend = (e?: React.FormEvent) => {
//     e?.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = input.trim();
//     setMessages(prev => [...prev, { role: "user", content: userMessage }]);
//     setInput("");
//     setIsLoading(true);

//     // محاكاة مؤقتة للرد (Fake Delay) حتى نربط الـ API
//     setTimeout(() => {
//       setMessages(prev => [...prev, {
//         role: "ai",
//         content: "This is a dummy response. We will connect the real Google Gemini API in the next step! 🚀"
//       }]);
//       setIsLoading(false);
//     }, 1500);
//   };

    
    
const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    // تجهيز مصفوفة الرسائل الجديدة لإرسالها
    const newMessages = [...messages, { role: "user", content: userMessage }];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      
      // إضافة رد الذكاء الاصطناعي للشات
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: data.text 
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: isRTL ? "عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً." : "Sorry, an error occurred. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
    
    
    
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Chat Drawer */}
      <div className={cn(
        "fixed top-0 bottom-0 z-[70] w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out",
        isRTL ? "left-0" : "right-0",
        // حركات الدخول والخروج
        isOpen ? "translate-x-0" : (isRTL ? "-translate-x-full" : "translate-x-full")
      )}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#2E37A4] to-[#0E9384] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
              <BotIcon size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[16px] font-bold leading-tight">{t.title}</h3>
              <p className="text-[11px] text-white/80">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#F9FAFB] custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3 max-w-[85%]", msg.role === "user" ? "self-end flex-row-reverse" : "self-start")}>
              
              {/* Avatar */}
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm", 
                msg.role === "user" ? "bg-[#2E37A4] text-white" : "bg-white border border-[#E7E8EB] text-[#0E9384]"
              )}>
                {msg.role === "user" ? <UserIcon size={16} /> : <BotIcon size={18} />}
              </div>

              {/* Message Bubble */}
              <div className={cn("p-3 rounded-[12px] text-[13px] leading-relaxed shadow-sm",
                msg.role === "user" 
                  ? "bg-[#2E37A4] text-white rounded-tr-none rtl:rounded-tr-[12px] rtl:rounded-tl-none" 
                  : "bg-white border border-[#E7E8EB] text-[#0A1B39] rounded-tl-none rtl:rounded-tl-[12px] rtl:rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
             <div className={cn("flex gap-3 max-w-[85%] self-start")}>
               <div className="w-8 h-8 rounded-full bg-white border border-[#E7E8EB] text-[#0E9384] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                 <BotIcon size={18} />
               </div>
               <div className="p-3 bg-white border border-[#E7E8EB] rounded-[12px] rounded-tl-none rtl:rounded-tl-[12px] rtl:rounded-tr-none flex items-center gap-2 text-[#6C7688] text-[12px]">
                 <Loader2Icon size={14} className="animate-spin" /> {t.typing}
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[#E7E8EB]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-[#F5F6F8] border border-[#E7E8EB] rounded-full pl-4 pr-12 rtl:pr-4 rtl:pl-12 py-3 text-[13px] text-[#0A1B39] focus:outline-none focus:border-[#2E37A4] focus:ring-1 focus:ring-[#2E37A4] transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn("absolute right-1.5 rtl:left-1.5 rtl:right-auto w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2E37A4] to-[#0E9384] text-white transition-opacity", 
                (!input.trim() || isLoading) ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 shadow-md"
              )}
            >
              <SendIcon size={16} className={cn(isRTL ? "rotate-180" : "")} />
            </button>
          </form>
        </div>

      </div>
    </>
  );
}