import { FIREBASE_DB } from '@/firebase/config'
import { DebugErrorType } from '@/lib/types'
import { doc, getDoc } from 'firebase/firestore'
import { TRANSACTION_NAME_RECOMMENDATIONS_SUCCESS } from './constants'

export const dbGetTransactionNameRecommendations: dbGetTransactionNameRecommendationsType = async (
  uid
) => {
  try {
    const userRef = doc(FIREBASE_DB, 'USERS', uid)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      return {
        ok: true,
        recommendations: userDoc.data().transactionNameRecommendations ?? [],
        success: TRANSACTION_NAME_RECOMMENDATIONS_SUCCESS.getTransactionNameRecommendations
      }
    } else {
      return {
        ok: false,
        recommendations: [],
        error: TRANSACTION_NAME_RECOMMENDATIONS_SUCCESS.getTransactionNameRecommendations
      }
    }
  } catch (debugError) {
    return {
      ok: false,
      recommendations: [],
      error: TRANSACTION_NAME_RECOMMENDATIONS_SUCCESS.getTransactionNameRecommendations,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetTransactionNameRecommendationsType = (uid: string) => Promise<{
  ok: boolean
  recommendations: string[]
  error?: string
  success?: string
  debugError?: DebugErrorType
}>
