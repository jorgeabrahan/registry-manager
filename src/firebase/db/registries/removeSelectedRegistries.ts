import { FIREBASE_DB } from '@/firebase/config'
import { doc, writeBatch } from 'firebase/firestore'
import { REGISTRY_ERRORS, REGISTRY_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbRemoveSelectedRegistries: dbRemoveSelectedRegistriesType = async (
  uid,
  year,
  month,
  registriesIds = []
) => {
  try {
    const batch = writeBatch(FIREBASE_DB)
    registriesIds.forEach((id) => {
      const registryRef = doc(FIREBASE_DB, 'USERS', uid, 'REGISTRIES', year, month, id)
      batch.delete(registryRef)
    })

    await batch.commit()

    return {
      ok: true,
      success: REGISTRY_SUCCESS.removeMany
    }
  } catch (debugError) {
    return {
      ok: false,
      error: REGISTRY_ERRORS.removeMany,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbRemoveSelectedRegistriesType = (
  uid: string,
  year: string,
  month: string,
  registriesIds: string[]
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
