import { FIREBASE_DB } from '@/firebase/config'
import { LicenseType } from '@/lib/types/licenses'
import { doc, updateDoc } from 'firebase/firestore'
import { LICENSES_ERRORS, LICENSES_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbUpdateLicense: dbUpdateLicenseType = async (licenseKey, updatedFields) => {
  try {
    const licenseRef = doc(FIREBASE_DB, 'LICENSES', licenseKey)
    await updateDoc(licenseRef, updatedFields)
    return {
      ok: true,
      success: LICENSES_SUCCESS.update
    }
  } catch (debugError) {
    return {
      ok: false,
      error: LICENSES_ERRORS.update,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbUpdateLicenseType = (
  licenseKey: string,
  updatedFields: Partial<LicenseType>
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
