import { FIREBASE_DB } from '@/firebase/config'
import { DebugErrorType } from '@/lib/types'
import { YearBalanceType } from '@/lib/types/balances' // Asegúrate de definir este tipo
import { doc, getDoc } from 'firebase/firestore'
import { BALANCE_ERRORS, BALANCE_SUCCESS } from './constants' // Asegúrate de definir estas constantes

export const dbGetYearsBalances: dbGetYearsBalancesType = async (uid) => {
  try {
    const allYearBalancesDocRef = doc(FIREBASE_DB, 'USERS', uid, 'YEAR_BALANCES', 'ALL')
    const allYearBalancesDoc = await getDoc(allYearBalancesDocRef)
    const balances = allYearBalancesDoc.data()?.balances ?? []
    return { balances, ok: true, success: BALANCE_SUCCESS.getYearsBalances }
  } catch (debugError) {
    return {
      balances: [],
      ok: false,
      error: BALANCE_ERRORS.getYearsBalances,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetYearsBalancesType = (
  uid: string
) => Promise<{
  balances: YearBalanceType[]
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
