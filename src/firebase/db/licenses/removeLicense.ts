import { FIREBASE_DB } from '@/firebase/config'
import { deleteDoc, doc } from 'firebase/firestore'
import { LICENSES_ERRORS, LICENSES_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbRemoveLicense: dbRemoveLicenseType = async (licenseId) => {
  try {
    const licenseRef = doc(FIREBASE_DB, 'LICENSES', licenseId)
    await deleteDoc(licenseRef)
    return {
      ok: true,
      success: LICENSES_SUCCESS.remove
    }
  } catch (debugError) {
    return {
      ok: false,
      error: LICENSES_ERRORS.remove,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbRemoveLicenseType = (licenseId: string) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
