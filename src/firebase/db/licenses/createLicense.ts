import { FIREBASE_DB } from '@/firebase/config'
import { LicenseType } from '@/lib/types/licenses'
import { addDoc, collection } from 'firebase/firestore'
import { LICENSES_ERRORS, LICENSES_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbCreateLicense: dbCreateLicenseType = async (license) => {
  try {
    const licensesCollection = collection(FIREBASE_DB, 'LICENSES')
    const licenseRef = await addDoc(licensesCollection, license)
    return {
      ok: true,
      id: licenseRef.id,
      success: LICENSES_SUCCESS.create(licenseRef.id)
    }
  } catch (debugError) {
    return {
      ok: false,
      id: null,
      error: LICENSES_ERRORS.create,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbCreateLicenseType = (license: Omit<LicenseType, 'key'>) => Promise<{
  ok: boolean
  id: string | null
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
