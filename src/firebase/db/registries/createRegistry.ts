import { FIREBASE_DB } from '@/firebase/config'
import { RegistryType } from '@/lib/types/registries'
import { collection, doc, setDoc } from 'firebase/firestore'
import { REGISTRY_ERRORS, REGISTRY_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbCreateRegistry: dbCreateRegistryType = async (uid, year, month, registry) => {
  try {
    const registriesCollection = collection(FIREBASE_DB, 'USERS', uid, 'REGISTRIES', year, month)
    const registryRef = doc(registriesCollection, registry.id)
    await setDoc(registryRef, registry)
    return {
      ok: true,
      success: REGISTRY_SUCCESS.create
    }
  } catch (debugError) {
    return {
      ok: false,
      error: REGISTRY_ERRORS.create,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbCreateRegistryType = (
  uid: string,
  year: string,
  month: string,
  registry: RegistryType
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
