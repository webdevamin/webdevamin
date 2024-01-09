import { create } from 'zustand'

const useConsentStore = create((set) => ({
    consent: false,
    enable: () => set(() => ({ consent: true }))
}));

export default useConsentStore;