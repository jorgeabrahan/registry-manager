import { LicenseType } from '@/lib/types/licenses'
import { create } from 'zustand'

const licenseStore = create<LicenseStore>((set) => ({
  loggedUserLicense: null,
  setLicense: (loggedUserLicense) => set((state) => ({ ...state, loggedUserLicense })),
  setUpdatedLicense: (updatedFields) =>
    set((state) => ({
      ...state,
      loggedUserLicense: { ...state.loggedUserLicense, ...updatedFields } as LicenseType
    }))
}))

type LicenseStore = {
  loggedUserLicense: LicenseType | null
  setLicense: (loggedUserLicense: LicenseType | null) => void
  setUpdatedLicense: (updatedFields: Partial<LicenseType>) => void
}

export { licenseStore }
