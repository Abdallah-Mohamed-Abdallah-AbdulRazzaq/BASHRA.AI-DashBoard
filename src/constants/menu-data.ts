import {
  LayoutDashboard, LayoutGrid, Stethoscope, Users,
  CalendarDays, MapPin, Briefcase, Activity, MessageSquare, UserCog,
  Building2, BadgeCheck, Clock, LogOut, Plane, CreditCard, Wallet,
  ShieldCheck, Globe, Map, Navigation, Compass, Network,
  HeartPulse, BookOpen, Dna,
  Package, Layers, Link, ServerCog, Settings
} from "lucide-react";
import { SidebarSection } from "@/types/navigation";

export const getSidebarData = (t: any, lang: string): SidebarSection[] => [
  {
    title: t.sidebar.main_menu,
    items: [
      {
        title: t.common.dashboard,
        icon: LayoutDashboard,
        submenu: [
          { title: t.sidebar.admin_dashboard, href: `/${lang}/dashboard/admin` },
        ],
      },
    ],
  },
  {
    title: t.sidebar.clinic,
    items: [
      { 
        title: t.sidebar.doctors, 
        icon: Stethoscope, 
        href: "#",
        submenu: [
          { title: t.sidebar.all_doctors, href: `/${lang}/clinic/doctors` },
          { title: t.sidebar.doctor_details, href: `/${lang}/clinic/doctors/details` },
        ]
      },
      { 
        title: t.sidebar.patients, 
        icon: Users, 
        href: "#",
        submenu: [
          { title: t.sidebar.all_patients, href: `/${lang}/clinic/patients` },
          { title: t.sidebar.patient_details, href: `/${lang}/clinic/patients/details` },
        ]
      }
    ],
  },

  {
    title: t.clinic.health_tips_system,
    items: [
      { title: t.clinic.daily_tips, icon: HeartPulse, href: `/${lang}/health-tips/daily-tips` },
      { title: t.clinic.medical_articles, icon: BookOpen, href: `/${lang}/health-tips/articles` },
      { title: t.clinic.skin_diseases, icon: Dna, href: `/${lang}/health-tips/skin-diseases` },
    ],
  },

  {
    title: t.sidebar?.packages_system || "Packages & Subscriptions",
    items: [
      { title: t.sidebar?.packages || "Packages", icon: Package, href: `/${lang}/packages-system/packages` },
      { title: t.sidebar?.features || "Features", icon: Layers, href: `/${lang}/packages-system/features` },
      { title: t.sidebar?.package_features || "Package Features Mapping", icon: Link, href: `/${lang}/packages-system/package-features` },
    ],
  },

  {
    title: t.sidebar?.account_management || "Account & Security",
    items: [
      {
        title: t.sidebar?.profile_settings || "Profile Settings",
        icon: Settings,
        href: `/${lang}/settings/profile`,
      },
      {
        title: t.sidebar?.security || "Security",
        icon: ShieldCheck,
        href: `/${lang}/settings/security`,
      },
    ],
  },

  {
    title: t.sidebar.address_management,
    items: [
      { title: t.sidebar.address_hierarchy, icon: Network, href: `/${lang}/address-management/hierarchy` },
      { title: t.sidebar.countries, icon: Globe, href: `/${lang}/address-management/countries` },
      { title: t.sidebar.cities, icon: Map, href: `/${lang}/address-management/cities` },
      { title: t.sidebar.regions, icon: Navigation, href: `/${lang}/address-management/regions` },
      { title: t.sidebar.districts, icon: Compass, href: `/${lang}/address-management/districts` },
    ],
  }
];