import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean; // للموبايل (Mobile Drawer)
  isCollapsed: boolean; // للديسكتوب (Mini Sidebar)
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  toggleCollapse: () => void; // دالة جديدة لتبديل الانكماش
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  isCollapsed: false, // القيمة الافتراضية (غير منكمش)
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));