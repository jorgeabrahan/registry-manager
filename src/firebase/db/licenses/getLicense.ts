import { FIREBASE_DB } from '@/firebase/config'
import { LicenseResponseType, LicenseType } from '@/lib/types/licenses'
import { doc, getDoc } from 'firebase/firestore'
import { LICENSES_ERRORS, LICENSES_STATUS, LICENSES_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbGetLicense: dbGetLicenseType = async (licenseKey = '') => {
  try {
    const licenseRef = doc(FIREBASE_DB, 'LICENSES', licenseKey)
    const licenseDoc = await getDoc(licenseRef)

    if (licenseDoc.exists()) {
      const licenseData = licenseDoc.data() as Omit<LicenseType, 'key'>
      return {
        ok: true,
        success: LICENSES_SUCCESS.getOne,
        licenseData: {
          ...licenseData,
          key: licenseDoc.id,
          isAlreadyInUse: licenseData?.uid?.length !== 0
        },
        messages: LICENSES_STATUS
      }
    }
    return {
      ok: false,
      licenseData: null,
      error: LICENSES_ERRORS.getOne
    }
  } catch (debugError) {
    return {
      ok: false,
      licenseData: null,
      error: LICENSES_ERRORS.getOne,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetLicenseType = (licenseKey: string) => Promise<{
  ok: boolean
  success?: string
  licenseData: LicenseResponseType | null
  messages?: typeof LICENSES_STATUS
  error?: string,
  debugError?: DebugErrorType
}>
