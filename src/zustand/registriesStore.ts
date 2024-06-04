import { RegistryType } from '@/lib/types/registries'
import { create } from 'zustand'

const filterRegistries = (registries: string[], reg: RegistryType) => {
  const idFound = registries.find((id) => id === reg.id)
  return idFound == null
}

const registriesStore = create<RegistriesStore>((set) => ({
  years: [],
  months: {},
  setYears: (years = []) => set((state) => ({ ...state, years })),
  addMonth: (year = '', month = '', registries = []) =>
    set((state) => ({ ...state, months: { ...state.months, [`${year}-${month}`]: registries } })),
  addRegistry: (year, month, registry) =>
    set((state) => ({
      ...state,
      months: {
        ...state.months,
        [`${year}-${month}`]: [...state.months[`${year}-${month}`], registry]
      }
    })),
  updateRegistry: (year, month, updatedRegistry) =>
    set((state) => ({
      ...state,
      months: {
        ...state.months,
        [`${year}-${month}`]: state.months[`${year}-${month}`]?.map((reg) => {
          if (reg.id === updatedRegistry.id) return updatedRegistry
          return reg
        })
      }
    })),
  removeRegistry: (year = '', month = '', registryId = '') =>
    set((state) => ({
      ...state,
      months: {
        ...state.months,
        [`${year}-${month}`]: state.months[`${year}-${month}`]?.filter(
          (reg) => reg.id !== registryId
        )
      }
    })),
  removeRegistries: (year = '', month = '', registries = []) =>
    set((state) => ({
      ...state,
      months: {
        ...state.months,
        [`${year}-${month}`]: state.months[`${year}-${month}`]?.filter((reg) =>
          filterRegistries(registries, reg)
        )
      }
    })),
  removeMonth: (year, month) =>
    set((state) => {
      const stateMonths = { ...state.months }
      delete stateMonths[`${year}-${month}`]
      return { ...state, months: stateMonths }
    })
}))

type Months = {
  [key: string]: RegistryType[]
}
type RegistriesStore = {
  years: string[]
  months: Months
  setYears: (years: string[]) => void
  addMonth: (year: string, month: string, registries: RegistryType[]) => void
  addRegistry: (year: string, month: string, registry: RegistryType) => void
  updateRegistry: (year: string, month: string, updatedRegistry: RegistryType) => void
  removeRegistry: (year: string, month: string, registryId: string) => void
  removeRegistries: (year: string, month: string, registries: string[]) => void
  removeMonth: (year: string, month: string) => void
}

export { registriesStore }
