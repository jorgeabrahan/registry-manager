import { FIREBASE_DB } from '@/firebase/config'
import { LicenseType } from '@/lib/types/licenses'
import { collection, getDocs } from 'firebase/firestore'
import { LICENSES_ERRORS, LICENSES_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbGetLicenses: dbGetLicensesType = async () => {
  try {
    const licensesCollection = collection(FIREBASE_DB, 'LICENSES')
    const licensesSnapshot = await getDocs(licensesCollection)
    const licenses = licensesSnapshot.docs.map((doc) => ({
      key: doc.id,
      ...(doc.data() as Omit<LicenseType, 'key'>)
    }))
    return {
      licenses,
      ok: true,
      success: LICENSES_SUCCESS.getMany
    }
  } catch (debugError) {
    return {
      licenses: [],
      ok: false,
      error: LICENSES_ERRORS.getMany,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetLicensesType = () => Promise<{
  licenses: LicenseType[]
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
