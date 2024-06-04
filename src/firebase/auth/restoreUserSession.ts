import { onAuthStateChanged } from 'firebase/auth'
import { FIREBASE_AUTH } from '../config'
import { UserType } from '@/lib/types'

export const restoreUserSession: restoreUserSessionType = (callback) => {
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    // si la sesion del usuario sigue activa
    if (user)
      callback({
        uid: user.uid,
        displayName: user?.displayName ?? '',
        email: user?.email ?? '',
        isLoggedIn: true
      })
    else
      callback({
        uid: '',
        displayName: '',
        email: '',
        isLoggedIn: false
      })
  })
}

type restoreUserSessionType = (callback: (user: UserType) => void) => void
