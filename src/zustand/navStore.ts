import { create } from 'zustand'

const navStore = create<NavStore>((set) => ({
  isNavDisabled: false,
  setIsNavDisabled: (isNavDisabled) => set((state) => ({ ...state, isNavDisabled }))
}))

type NavStore = {
  isNavDisabled: boolean,
  setIsNavDisabled: (isNavDisabled: boolean) => void
}

export { navStore }
