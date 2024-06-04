import { create } from 'zustand'

const navDropdownsStore = create<NavDropdownsStore>((set) => ({
  activeDropdown: '',
  setActiveDropdown: (activeDropdown) =>
    set((state) => ({ ...state, activeDropdown: activeDropdown }))
}))

type NavDropdownsStore = {
  activeDropdown: string;
  setActiveDropdown: (activeDropdown: string) => void;
}

export { navDropdownsStore }
