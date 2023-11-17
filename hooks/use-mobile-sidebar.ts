import { create } from "zustand";

export type MobileSidebarStore = {
    isOpen: boolean;
    onOpen: VoidFunction;
    onClose: VoidFunction;
};

export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
