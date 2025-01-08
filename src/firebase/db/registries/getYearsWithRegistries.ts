import { FIREBASE_DB } from '@/firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { REGISTRY_ERRORS, REGISTRY_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbGetYearsWithRegistries: dbGetYearsWithRegistriesType = async (
  uid
) => {
  try {
    const monthRegistriesCollection = collection(
      FIREBASE_DB,
      `USERS/${uid}/REGISTRIES`
    )
    const registriesSnapshot = await getDocs(monthRegistriesCollection)
    const years = registriesSnapshot.docs.map((doc) => doc.id)
    const now = new Date()
    const hasCurrentYear =
      years.find((year) => year === `${now.getFullYear()}`) !== undefined
    if (!hasCurrentYear) years.push(`${now.getFullYear()}`)
    return { years, ok: true, success: REGISTRY_SUCCESS.getYears }
  } catch (debugError) {
    return {
      years: [],
      ok: false,
      error: REGISTRY_ERRORS.getYears,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetYearsWithRegistriesType = (uid: string) => Promise<{
  years: string[]
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
