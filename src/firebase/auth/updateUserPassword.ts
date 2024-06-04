import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { FIREBASE_AUTH } from '../config'
import { CHANGE_PASS_ERRORS } from './utils/errors'
import { DebugErrorType } from '@/lib/types'

export const updateUserPassword: updateUserPasswordType = async (current = '', updated = '') => {
  try {
    const user = FIREBASE_AUTH.currentUser
    if (!user) {
      return {
        ok: false,
        error: CHANGE_PASS_ERRORS.noUser
      }
    }

    const credential = EmailAuthProvider.credential(user?.email ?? '', current)
    await reauthenticateWithCredential(user, credential)

    try {
      await updatePassword(user, updated)
      return { ok: true, success: CHANGE_PASS_ERRORS.success }
    } catch (debugError) {
      return {
        ok: false,
        error: CHANGE_PASS_ERRORS.updateError,
        debugError: debugError as DebugErrorType
      }
    }
  } catch (debugError) {
    return {
      ok: false,
      error: CHANGE_PASS_ERRORS.reauthenticateError,
      debugError: debugError as DebugErrorType
    }
  }
}

type updateUserPasswordType = (
  current: string,
  updated: string
) => Promise<{
  ok: boolean
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
