import React from "react";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { Header } from "@/components/layout/header/header";
import { Footer } from "@/components/layout/footer/footer";
import { DashboardAuthGuard } from "@/components/auth/dashboard-auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <div className="flex min-h-screen bg-brand-light">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </DashboardAuthGuard>
  );
}