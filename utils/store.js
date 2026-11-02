import { create } from 'zustand'

const useStore = create((set) => ({
    consent: '',

    update: (consent) => set({ consent }),
}));

export default useStore;
