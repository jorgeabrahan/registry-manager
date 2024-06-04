import { DebugErrorType } from '@/lib/types'
import { TransactionType } from '@/lib/types/transactions/transaction.type'
import { TRANSACTION_ERRORS, TRANSACTION_SUCCESS } from './constants'
import { collection, doc, setDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '@/firebase/config'

export const dbCreateTransaction: dbCreateTransactionType = async (
  uid,
  year,
  month,
  transaction
) => {
  try {
    const transactionsCollection = collection(
      FIREBASE_DB,
      'USERS',
      uid,
      'TRANSACTIONS',
      year,
      month
    )
    const transactionRef = doc(transactionsCollection, transaction.id)
    await setDoc(transactionRef, transaction)
    return {
      ok: true,
      success: TRANSACTION_SUCCESS.create
    }
  } catch (debugError) {
    return {
      ok: false,
      error: TRANSACTION_ERRORS.create,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbCreateTransactionType = (
  uid: string,
  year: string,
  month: string,
  transaction: TransactionType
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
