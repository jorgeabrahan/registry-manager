import { DebugErrorType, UserResponseType } from '@/lib/types'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../config'
import { getUserFriendlyErrorMessage } from './utils'

export const signInUser: signInUserType = async (email = '', password = '') => {
  try {
    const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
    const user = userCredential.user as UserResponseType
    return {
      isSignedIn: true,
      user
    }
  } catch (debugError) {
    return {
      isSignedIn: false,
      error: getUserFriendlyErrorMessage(debugError as DebugErrorType),
      debugError: debugError as DebugErrorType
    }
  }
}

type signInUserType = (
  email: string,
  password: string
) => Promise<{
  isSignedIn: boolean
  error?: string
  user?: UserResponseType
  debugError?: DebugErrorType
}>
