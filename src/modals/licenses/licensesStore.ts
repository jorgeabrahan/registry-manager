import { LicenseType } from '@/lib/types/licenses'
import { create } from 'zustand'

const licensesStore = create<LicensesStore>((set) => ({
  licenses: [],
  setLicenses: (licenses) => set((state) => ({ ...state, licenses })),
  addLicense: (license) => set((state) => ({ ...state, licenses: [...state.licenses, license] })),
  removeLicense: (key) =>
    set((state) => ({
      ...state,
      licenses: state.licenses.filter((license) => license.key !== key)
    })),
  updateLicense: (key, updatedFields) =>
    set((state) => ({
      ...state,
      licenses: state.licenses.map((license) =>
        license.key === key ? { ...license, ...updatedFields } : license
      )
    }))
}))

type LicensesStore = {
  licenses: LicenseType[]
  setLicenses: (licenses: LicenseType[]) => void
  addLicense: (license: LicenseType) => void
  removeLicense: (key: string) => void
  updateLicense: (key: string, updatedFields: Partial<LicenseType>) => void
}

export { licensesStore }
