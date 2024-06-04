import { FIREBASE_DB } from '@/firebase/config'
import { DebugErrorType } from '@/lib/types'
import { deleteDoc, doc } from 'firebase/firestore'
import { TRANSACTION_ERRORS, TRANSACTION_SUCCESS } from './constants'

export const dbRemoveTransaction: dbRemoveTransactionType = async (
  uid,
  year,
  month,
  transactionId
) => {
  try {
    const transactionRef = doc(
      FIREBASE_DB,
      'USERS',
      uid,
      'TRANSACTIONS',
      year,
      month,
      transactionId
    )
    await deleteDoc(transactionRef)

    return {
      ok: true,
      success: TRANSACTION_SUCCESS.remove
    }
  } catch (debugError) {
    return {
      ok: false,
      error: TRANSACTION_ERRORS.remove,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbRemoveTransactionType = (
  uid: string,
  year: string,
  month: string,
  transactionId: string
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
