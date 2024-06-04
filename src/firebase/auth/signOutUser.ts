import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../config'

export const signOutUser: signOutUserType = async () => {
  try {
    await signOut(FIREBASE_AUTH)
    return { isSignedOut: true }
  } catch (_) {
    return { isSignedOut: false }
  }
}

type signOutUserType = () => Promise<{
  isSignedOut: boolean
}>
