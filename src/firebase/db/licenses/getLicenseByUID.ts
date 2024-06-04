import { query, where, getDocs, collection } from 'firebase/firestore'
import { FIREBASE_DB } from '../../config'
import { LICENSES_ERRORS, LICENSES_STATUS, LICENSES_SUCCESS } from './constants'
import { LicenseResponseType, LicenseType } from '@/lib/types/licenses'
import { DebugErrorType } from '@/lib/types'

export const dbGetLicenseByUID: dbGetLicenseByUIDType = async (uid = '') => {
  try {
    const licenseRef = collection(FIREBASE_DB, 'LICENSES')
    const q = query(licenseRef, where('uid', '==', uid))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const licenseDoc = querySnapshot.docs[0]
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

type dbGetLicenseByUIDType = (uid: string) => Promise<{
  ok: boolean
  success?: string
  licenseData: LicenseResponseType | null
  messages?: typeof LICENSES_STATUS
  error?: string,
  debugError?: DebugErrorType
}>
