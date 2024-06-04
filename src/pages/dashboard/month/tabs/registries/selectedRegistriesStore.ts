import { create } from 'zustand'

const selectedRegistryStore = create<SelectedRegistryStore>((set) => ({
  selectedRegistries: [],
  selectRegistry: (registryId = '') =>
    set((state) => ({ ...state, selectedRegistries: [...state.selectedRegistries, registryId] })),
  deselectRegistry: (registryId = '') =>
    set((state) => ({
      ...state,
      selectedRegistries: state.selectedRegistries.filter((sr) => sr !== registryId)
    })),
  clearSelectedRegistries: () => set(state => ({
    ...state,
    selectedRegistries: []
  }))
}))

type SelectedRegistryStore = {
  selectedRegistries: string[],
  selectRegistry: (registryId: string) => void,
  deselectRegistry: (registryId: string) => void,
  clearSelectedRegistries: () => void
}

export { selectedRegistryStore }
