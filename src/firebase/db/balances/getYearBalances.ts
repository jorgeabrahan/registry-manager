import { FIREBASE_DB } from '@/firebase/config'
import { DebugErrorType } from '@/lib/types'
import { MonthBalanceType } from '@/lib/types/balances'
import { doc, getDoc } from 'firebase/firestore'
import { BALANCE_ERRORS, BALANCE_SUCCESS } from './constants'

export const dbGetYearBalances: dbGetYearBalancesType = async (uid, year) => {
  try {
    const yearBalancesDocRef = doc(FIREBASE_DB, 'USERS', uid, 'BALANCES', year)
    const yearBalancesDoc = await getDoc(yearBalancesDocRef)
    const balances = yearBalancesDoc.data()?.balances ?? []
    return { balances, ok: true, success: BALANCE_SUCCESS.getYearBalances(year) }
  } catch (debugError) {
    return {
      balances: [],
      ok: false,
      error: BALANCE_ERRORS.getYearBalances(year),
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetYearBalancesType = (
  uid: string,
  year: string
) => Promise<{
  balances: MonthBalanceType[]
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
