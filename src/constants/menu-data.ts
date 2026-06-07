import {
  LayoutDashboard, LayoutGrid, Stethoscope, Users,
  CalendarDays, MapPin, Briefcase, Activity, MessageSquare, UserCog,
  Building2, BadgeCheck, Clock, LogOut, Plane, CreditCard, Wallet,
  ShieldCheck, Globe, Map, Navigation, Compass, Network,
  HeartPulse, BookOpen, Dna,
  Package, Layers, Link, ServerCog, Settings,
  Pill, ClipboardList, Star, Cpu, Ban
} from "lucide-react";
import { SidebarSection } from "@/types/navigation";

export const getSidebarData = (t: any, lang: string): SidebarSection[] => [
  {
    title: t.sidebar.main_menu,
    items: [
      {
        title: t.common.dashboard,
        icon: LayoutDashboard,
        href: `/${lang}`,
      },
    ],
  },
  {
    title: t.sidebar?.user_management || "User Management",
    items: [
      {
        title: t.sidebar?.all_users || "All Users",
        icon: Users,
        href: `/${lang}/users`
      }
    ]
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
          { title: t.clinic?.all_doctors_contact_details || "Contact Details", href: `/${lang}/clinic/doctors/contact-details` },
        ]
      },
      { 
        title: t.sidebar.patients, 
        icon: Users, 
        href: `/${lang}/clinic/patients`
      },
      {
        title: t.sidebar.appointments || t.clinic?.appointments || "Appointments",
        icon: CalendarDays,
        href: `/${lang}/clinic/appointments`
      },
      {
        title: t.clinic?.medical_records || "Medical Records",
        icon: Activity,
        href: `/${lang}/clinic/medical-records`
      },
      {
        title: t.sidebar?.medications || "Medications",
        icon: Pill,
        href: `/${lang}/clinic/medications`
      },
      {
        title: t.sidebar?.prescriptions || "Prescriptions",
        icon: ClipboardList,
        href: `/${lang}/clinic/prescriptions`
      },
      {
        title: t.sidebar?.ratings || "Ratings & Reviews",
        icon: Star,
        href: `/${lang}/clinic/ratings`
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
      { title: t.sidebar?.doctor_subscriptions || "Doctor Subscriptions", icon: Stethoscope, href: `/${lang}/packages-system/doctor-subscriptions` },
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
      {
        title: t.sidebar?.blocked_entities || "Blocked Entities",
        icon: Ban,
        href: `/${lang}/blocked-entities`,
      },
      {
        title: t.sidebar?.files_management || "Files Management",
        icon: ServerCog,
        href: `/${lang}/files-management`,
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
  },
  {
    title: t.ai_usage?.ai_management || "AI Management",
    items: [
      {
        title: t.ai_usage?.ai_usage || "AI Usage & Policies",
        icon: Cpu,
        href: `/${lang}/ai-usage`,
      }
    ]
  }
];