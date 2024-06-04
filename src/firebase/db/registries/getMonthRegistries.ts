import { FIREBASE_DB } from '@/firebase/config'
import { RegistryResponseType, RegistryType } from '@/lib/types/registries'
import { collection, getDocs } from 'firebase/firestore'
import { REGISTRY_ERRORS, REGISTRY_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbGetMonthRegistries: dbGetMonthRegistriesType = async (uid, year, month) => {
  try {
    const monthRegistriesCollection = collection(
      FIREBASE_DB,
      'USERS',
      uid,
      'REGISTRIES',
      year,
      month
    )
    const registriesSnapshot = await getDocs(monthRegistriesCollection)
    const registries = registriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as RegistryResponseType),
    }))
    return { registries, ok: true, success: REGISTRY_SUCCESS.getManyByMonth(year, month) }
  } catch (debugError) {
    return {
      registries: [],
      ok: false,
      error: REGISTRY_ERRORS.getManyByMonth(year, month),
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetMonthRegistriesType = (
  uid: string,
  year: string,
  month: string
) => Promise<{
  registries: RegistryType[],
  ok: boolean,
  success?: string,
  error?: string,
  debugError?: DebugErrorType
}>
