import { FIREBASE_DB } from '@/firebase/config'
import { DebugErrorType } from '@/lib/types'
import { TransactionType } from '@/lib/types/transactions/transaction.type'
import { collection, doc, setDoc } from 'firebase/firestore'
import { TRANSACTION_ERRORS, TRANSACTION_SUCCESS } from './constants'

export const dbUpdateTransaction: dbUpdateTransactionType = async (
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
    await setDoc(transactionRef, transaction, { merge: true })
    return {
      ok: true,
      success: TRANSACTION_SUCCESS.update
    }
  } catch (debugError) {
    return {
      ok: false,
      error: TRANSACTION_ERRORS.update,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbUpdateTransactionType = (
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
