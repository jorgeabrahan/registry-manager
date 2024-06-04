import { FIREBASE_DB } from '@/firebase/config'
import { deleteDoc, doc } from 'firebase/firestore'
import { REGISTRY_ERRORS, REGISTRY_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbRemoveRegistry: dbRemoveRegistryType = async (uid, year, month, registryId) => {
  try {
    const registryRef = doc(FIREBASE_DB, 'USERS', uid, 'REGISTRIES', year, month, registryId)
    await deleteDoc(registryRef)

    return {
      ok: true,
      success: REGISTRY_SUCCESS.remove
    }
  } catch (debugError) {
    return {
      ok: false,
      error: REGISTRY_ERRORS.remove,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbRemoveRegistryType = (
  uid: string,
  year: string,
  month: string,
  registryId: string
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
