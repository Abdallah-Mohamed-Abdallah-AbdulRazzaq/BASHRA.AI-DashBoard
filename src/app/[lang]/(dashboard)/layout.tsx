import React from "react";
import { Sidebar } from "@/components/layout/sidebar/sidebar"; // تأكد من المسار
import { Header } from "@/components/layout/header/header";   // تأكد من المسار
import { Footer } from "@/components/layout/footer/footer";   // تأكد من المسار

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // استخدام flex لضمان ترتيب العناصر (Sidebar ثم المحتوى)
    // في الـ RTL، الـ Flex يعكس الترتيب تلقائياً
    <div className="flex min-h-screen bg-brand-light">
      
      {/* السايدبار سيأتي أولاً (يسار في الإنجليزي، يمين في العربي) */}
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}