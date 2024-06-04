import { FIREBASE_DB } from '@/firebase/config'
import { ClientType } from '@/lib/types/registries'
import { collection, getDocs } from 'firebase/firestore'
import { CLIENTS_ERRORS, CLIENTS_SUCCESS } from './constants'
import { DebugErrorType } from '@/lib/types'

export const dbGetClients: dbGetClientsType = async (uid) => {
  try {
    const clientsCollection = collection(FIREBASE_DB, 'USERS', uid, 'CLIENTS')
    const clientSnapshot = await getDocs(clientsCollection)
    const clients = clientSnapshot.docs.map((doc) => doc.data() as ClientType)
    return {
      ok: true,
      success: CLIENTS_SUCCESS.getMany,
      clients
    }
  } catch (debugError) {
    return {
      ok: false,
      clients: [],
      error: CLIENTS_ERRORS.getMany,
      debugError: debugError as DebugErrorType
    }
  }
}

type dbGetClientsType = (uid: string) => Promise<{
  ok: boolean
  clients: ClientType[]
  success?: string
  error?: string
  debugError?: DebugErrorType
}>
