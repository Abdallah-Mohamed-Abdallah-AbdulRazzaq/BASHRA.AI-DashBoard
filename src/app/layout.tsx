import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider"; // استيراد

const inter = Inter({ subsets: ["latin"] });

// إعدادات الـ Metadata المتقدمة (أيقونات الموقع و Open Graph لمواقع التواصل)
export const metadata: Metadata = {
  metadataBase: new URL("https://bashraai.com"), // 👈 أضف هذا السطر
  title: "BashraAI Admin Dashboard",
  description: "Medical & Clinic Management Dashboard",
  icons: {
    icon: "/favicon.ico", // الأيقونة الأساسية
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png", // أيقونة أجهزة أبل
  },
  openGraph: {
    title: "BashraAI Admin Dashboard",
    description: "Medical & Clinic Management Dashboard",
    url: "https://bashraai.com", // استبدله برابط موقعك الفعلي لاحقاً
    siteName: "Bashra AI",
    images: [
      {
        url: "/images/og-image.png", // صورة المشاركة (السوشيال ميديا)
        width: 1200,
        height: 630,
        alt: "Bashra AI Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning مهم جداً لمنع أخطاء التوافق بين السيرفر والعميل
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}