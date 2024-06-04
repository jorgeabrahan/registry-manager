import { ClientType } from "./client.type"

export type RegistryHistoryActionType = {
  id: string,
  action: string
}

export type RegistryType = {
  id: string,
  date: string,
  clients: ClientType[],
  history: RegistryHistoryActionType[]
}

export type RegistryResponseType = Omit<RegistryType, 'id'>;

export type CurrentRegistryType = RegistryType & {
  isEditing: boolean
  clients: ClientType[]
}

export type MergedRegistriesType = {
  ids: string,
  dates: string[],
  combinedClients: ClientType[]
}
