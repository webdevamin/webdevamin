import { create } from 'zustand'

const useStore = create((set) => ({
    consent: '',

    update: () => set((state) => ({ consent: state.consent })),
}));

export default useStore;
