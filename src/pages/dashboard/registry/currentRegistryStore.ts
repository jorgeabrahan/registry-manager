import { ArticleType, ClientType, CurrentRegistryType } from '@/lib/types/registries'
import { create } from 'zustand'

const INITIAL_REGISTRY: CurrentRegistryType = {
  id: '',
  date: '',
  clients: [],
  history: [],
  isEditing: false
}

const currentRegistryStore = create<CurrentRegistryStore>((set) => ({
  currentRegistry: INITIAL_REGISTRY,
  updateDate: (newDate = '') =>
    set((state) => ({ ...state, currentRegistry: { ...state.currentRegistry, date: newDate } })),
  setRegistry: (registry) =>
    set((state) => ({ ...state, currentRegistry: { ...state.currentRegistry, ...registry } })),
  setInitialRegistry: () => set((state) => ({ ...state, currentRegistry: INITIAL_REGISTRY })),
  addClient: (client) =>
    set((state) => ({
      ...state,
      currentRegistry: {
        ...state.currentRegistry,
        clients: [...state.currentRegistry.clients, client]
      }
    })),
  updateClientName: (clientId = '', newClientName = '') =>
    set((state) => ({
      ...state,
      currentRegistry: {
        ...state.currentRegistry,
        clients: state.currentRegistry.clients.map((client) => {
          if (client.id === clientId) {
            return {
              ...client,
              id: crypto.randomUUID(),
              name: newClientName
            }
          }
          return client
        })
      }
    })),
  mergeClients: (clientIdToRemove = '', clientIdToLeave = '') =>
    set((state) => {
      // get client to remove
      const client = state.currentRegistry.clients.find((c) => c.id === clientIdToRemove)
      // if the client doesn't exist then leave the state as it is
      if (client == null) return state
      // remove the clientToRemove from the array of clients
      const finalClients = state.currentRegistry.clients.filter((c) => c.id !== clientIdToRemove)
      return {
        ...state,
        currentRegistry: {
          ...state.currentRegistry,
          clients: finalClients.map((fc) => {
            // find the client to leave
            if (fc.id === clientIdToLeave) {
              // merge articles from client to remove and client to leave
              return {
                ...fc,
                articles: [...fc.articles, ...client.articles]
              }
            }
            // leave all other clients as they are
            return fc
          })
        }
      }
    }),
  addArticles: (clientId = '', articles = []) =>
    set((state) => ({
      ...state,
      currentRegistry: {
        ...state.currentRegistry,
        clients: state.currentRegistry.clients.map((client) => {
          if (client.id === clientId) {
            return {
              ...client,
              articles: [...client.articles, ...articles]
            }
          }
          return client
        })
      }
    })),
  updateArticles: (clientId = '', articles = []) =>
    set((state) => ({
      ...state,
      currentRegistry: {
        ...state.currentRegistry,
        clients: state.currentRegistry.clients.map((client) => {
          if (client.id === clientId) {
            return {
              ...client,
              articles
            }
          }
          return client
        })
      }
    })),
  clearClients: () =>
    set((state) => ({ ...state, currentRegistry: { ...state.currentRegistry, clients: [] } })),
  removeClient: (clientId = '') =>
    set((state) => ({
      ...state,
      currentRegistry: {
        ...state.currentRegistry,
        clients: state.currentRegistry.clients.filter((client) => client.id !== clientId)
      }
    })),
  addHistoryAction: (action: string) =>
    set((state) => ({
      ...state,
      currentRegistry: {
        ...state.currentRegistry,
        history: [
          {
            id: crypto.randomUUID(),
            action
          },
          ...state.currentRegistry.history
        ]
      }
    }))
}))

type CurrentRegistryStore = {
  currentRegistry: CurrentRegistryType
  updateDate: (newDate: string) => void
  setRegistry: (registry: CurrentRegistryType) => void
  setInitialRegistry: () => void
  addClient: (client: ClientType) => void
  updateClientName: (clientId: string, newClientName: string) => void
  mergeClients: (clientIdToRemove: string, clientIdToLeave: string) => void
  addArticles: (clientId: string, articles: ArticleType[]) => void
  updateArticles: (clientId: string, articles: ArticleType[]) => void
  clearClients: () => void
  removeClient: (clientId: string) => void
  addHistoryAction: (action: string) => void
}

export { currentRegistryStore }
