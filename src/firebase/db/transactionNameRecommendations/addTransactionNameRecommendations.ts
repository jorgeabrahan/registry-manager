import { FIREBASE_DB } from '@/firebase/config'
import { DebugErrorType } from '@/lib/types'
import { doc, setDoc } from 'firebase/firestore'
import { TRANSACTION_NAME_RECOMMENDATIONS_SUCCESS } from './constants'

export const dbAddTransactionNameRecommendations: dbAddTransactionNameRecommendationsType = async (
  uid,
  recomendationsToAdd
) => {
  try {
    const userRef = doc(FIREBASE_DB, 'USERS', uid)
    await setDoc(
      userRef,
      {
        transactionNameRecommendations: recomendationsToAdd
      },
      { merge: true }
    )
    return {
      ok: true,
      success: TRANSACTION_NAME_RECOMMENDATIONS_SUCCESS.addTransactionNameRecommendations
    }
  } catch (debugError) {
    return {
      ok: false,
      error: TRANSACTION_NAME_RECOMMENDATIONS_SUCCESS.addTransactionNameRecommendations,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbAddTransactionNameRecommendationsType = (
  uid: string,
  recomendationsToAdd: string[]
) => Promise<{
  ok: boolean
  error?: string
  success?: string
  debugError?: DebugErrorType
}>
