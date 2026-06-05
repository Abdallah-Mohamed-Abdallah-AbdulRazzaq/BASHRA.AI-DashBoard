import { LucideIcon } from "lucide-react";

export interface SubMenuItem {
  title: string;
  href?: string;
  submenu?: SubMenuItem[];
}

export interface MenuItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  submenu?: SubMenuItem[];
}

export interface SidebarSection {
  title: string;
  items: MenuItem[];
}