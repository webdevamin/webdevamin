import { create } from 'zustand'

const useStore = create((set) => ({
    consent: '',
    // Lets the footer "Cookie settings" button reopen the banner.
    showConsent: false,

    update: (consent) => set({ consent }),
    setShowConsent: (showConsent) => set({ showConsent }),
}));

export default useStore;
