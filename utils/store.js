import { create } from 'zustand'

const useConsentStore = create((set) => ({
    consent: '',
    update: () => set((state) => ({ consent: state.consent }))
}));

export default useConsentStore;