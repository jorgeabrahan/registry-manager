import { ClientType } from '@/lib/types/registries'
import { create } from 'zustand'

const clientsStore = create<ClientsStore>((set) => ({
  dbInitialClients: [],
  setDbInitialClients: (initialClients) =>
    set((state) => ({ ...state, dbInitialClients: initialClients }))
}))

type ClientsStore = {
  dbInitialClients: ClientType[]
  setDbInitialClients: (initialClients: ClientType[]) => void
}

export { clientsStore }
