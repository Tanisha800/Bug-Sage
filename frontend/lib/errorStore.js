// store/errorStore.js
import create from "zustand"

export const useErrorStore = create((set) => ({
    unauthorizedOpen: false,
    openUnauthorized: () => set({ unauthorizedOpen: true }),
    closeUnauthorized: () => set({ unauthorizedOpen: false }),
}))
