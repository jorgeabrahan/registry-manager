import { DebugErrorType, UserResponseType } from '@/lib/types'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { FIREBASE_AUTH } from '../config'
import { getUserFriendlyErrorMessage } from './utils'

export const createUser: createUserType = async (email = '', password = '', displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
    const user = userCredential.user
    await updateProfile(user, { displayName })
    return {
      isCreated: true,
      user: user as UserResponseType
    }
  } catch (debugError) {
    return {
      isCreated: false,
      error: getUserFriendlyErrorMessage(debugError as DebugErrorType),
      debugError: debugError as DebugErrorType
    }
  }
}

type createUserType = (
  email: string,
  password: string,
  displayName: string
) => Promise<{
  isCreated: boolean
  user?: UserResponseType
  error?: string
  debugError?: DebugErrorType
}>
