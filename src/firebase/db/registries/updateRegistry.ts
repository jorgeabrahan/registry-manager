import { FIREBASE_DB } from '@/firebase/config'
import { RegistryType } from '@/lib/types/registries'
import { collection, doc, setDoc } from 'firebase/firestore'
import { REGISTRY_ERRORS, REGISTRY_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbUpdateRegistry: dbUpdateRegistryType = async (uid, year, month, registry) => {
  try {
    const registriesCollection = collection(FIREBASE_DB, 'USERS', uid, 'REGISTRIES', year, month)
    const registryRef = doc(registriesCollection, registry.id)
    await setDoc(registryRef, registry, { merge: true })
    return {
      ok: true,
      success: REGISTRY_SUCCESS.update
    }
  } catch (debugError) {
    return {
      ok: false,
      error: REGISTRY_ERRORS.update,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbUpdateRegistryType = (
  uid: string,
  year: string,
  month: string,
  registry: Partial<RegistryType>
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
