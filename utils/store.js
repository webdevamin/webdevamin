import { create } from 'zustand'

const useStore = create((set) => ({
    consent: '',
    isAlertVisible: true,

    update: () => set((state) => ({ consent: state.consent })),
    hideAlert: () => set({ isAlertVisible: false }),
}));

export default useStore;