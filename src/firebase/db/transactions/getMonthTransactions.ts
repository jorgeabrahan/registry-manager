import { FIREBASE_DB } from '@/firebase/config'
import { DebugErrorType } from '@/lib/types'
import { TransactionType } from '@/lib/types/transactions/transaction.type'
import { collection, getDocs } from 'firebase/firestore'
import { TRANSACTION_ERRORS, TRANSACTION_SUCCESS } from './constants'

export const dbGetMonthTransactions: dbGetMonthTransactionsType = async (uid, year, month) => {
  try {
    const monthTransactionsCollection = collection(
      FIREBASE_DB,
      'USERS',
      uid,
      'TRANSACTIONS',
      year,
      month
    )
    const transactionsSnapshot = await getDocs(monthTransactionsCollection)
    const transactions = transactionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<TransactionType, 'id'>)
    }))
    return { transactions, ok: true, success: TRANSACTION_SUCCESS.getManyByMonth(year, month) }
  } catch (debugError) {
    return {
      transactions: [],
      ok: false,
      error: TRANSACTION_ERRORS.getManyByMonth(year, month),
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetMonthTransactionsType = (
  uid: string,
  year: string,
  month: string
) => Promise<{
  transactions: TransactionType[]
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
