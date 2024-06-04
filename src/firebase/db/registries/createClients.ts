import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { CLIENTS_ERRORS, CLIENTS_SUCCESS } from './constants'
import { FIREBASE_DB } from '@/firebase/config'
import { ClientType } from '@/lib/types/registries'
import { DebugErrorType } from '@/lib/types'

export const dbCreateClients: dbCreateClientsType = async (uid, clients) => {
  const clientsCollection = collection(FIREBASE_DB, 'USERS', uid, 'CLIENTS')
  let results = []
  for (let client of clients) {
    try {
      const clientRef = doc(clientsCollection, client.name)
      const docSnapshot = await getDoc(clientRef)
      if (!docSnapshot.exists()) {
        await setDoc(clientRef, client)
        results.push({
          ok: true,
          success: CLIENTS_SUCCESS.create
        })
      } else {
        results.push({
          ok: false,
          error: CLIENTS_ERRORS.duplicate(clientRef.id),
          clientName: client.name
        })
      }
    } catch (debugError) {
      results.push({
        ok: false,
        error: CLIENTS_ERRORS.create,
        debugError: debugError as DebugErrorType
      })
    }
  }

  return results
}

type dbCreateClientsType = (
  uid: string,
  clients: Omit<ClientType, 'articles'>[]
) => Promise<
  {
    ok: boolean
    success?: string
    error?: string
    clientName?: string
    debugError?: DebugErrorType
  }[]
>
