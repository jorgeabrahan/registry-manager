import { LicenseTypes } from "@/lib/enums"

export type LicenseType = {
  key: string,
  date: {
    start: string,
    end: string
  },
  uid: string,
  daysDuration: number,
  isUnlimited: boolean,
  isActivated?: boolean
}

export type LicenseResponseType = LicenseType & {
  isAlreadyInUse: boolean
}

export type LicenseTypesKeysType = keyof typeof LicenseTypes;
