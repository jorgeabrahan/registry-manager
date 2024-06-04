import { v4 as uuid } from 'uuid'
import { ArticleType, ClientType, GroupedArticleType, PureClientType, RegistryType } from '../types/registries'

export const getAmountOptions = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`
  }))
}

export const toNum = (string = '', fallback = 0) => {
  const asNum = Number(string ?? 0)
  return isNaN(asNum) ? fallback : asNum
}

export const craftClientArticles = (price = '', amount = '') => {
  const nPrice = toNum(price)
  const nAmount = toNum(amount)
  const articles = []
  for (let i = 1; i <= nAmount; i++) {
    articles.push({
      id: uuid(),
      price: nPrice
    })
  }
  return articles
}

export const sortClientsByName = (clients: ClientType[] = []) => {
  return clients.sort((a, b) => a.name.localeCompare(b.name))
}

export const sortClientsByTotal = (clients: ClientType[] = []) => {
  return clients.sort((a, b) => calcClientTotal(b?.articles) - calcClientTotal(a?.articles))
}

export const calcClientTotal = (articles: ArticleType[] = []) => {
  return articles.reduce((acc, current) => acc + current.price, 0)
}

export const getClientIdFromName = (clients: ClientType[] = [], name = '') => {
  const client = clients.find((c) => c.name === name)
  if (client != null) return client.id
  return null
}

export const calcClientsTotal = (clients: ClientType[] = []) => {
  return clients.reduce((acc, current) => acc + calcClientTotal(current?.articles), 0)
}

export const countArticlesTotal = (clients: ClientType[] = []) => {
  return clients.reduce((acc, client) => acc + client.articles.length, 0)
}

export const getBestBuyers = (clients: ClientType[] = [], amount = 3) => {
  const sortedClients = sortClientsByTotal(clients)
  return sortedClients.slice(0, amount)
}

export const groupArticles = (articles: ArticleType[] = []): GroupedArticleType[] => {
  const articlesMap = new Map()
  for (const article of articles) {
    let articlesAmount = articlesMap.get(article?.price)
    if (articlesAmount == null) articlesAmount = 0
    articlesMap.set(article?.price, articlesAmount + 1)
  }
  const articlesGrouped = Array.from(articlesMap, ([price, amount]) => ({
    id: `group-${price}`,
    price,
    amount
  }))
  return articlesGrouped.sort((a, b) => a.price - b.price)
}

export const removeArticles = (articles: ArticleType[] = [], amount = 0, price = 0) => {
  const purgedArticles = []
  let articlesRemoved = 0
  for (const article of articles) {
    if (article?.price === price && articlesRemoved < amount) {
      articlesRemoved += 1
      continue
    }
    purgedArticles.push(article)
  }
  return purgedArticles
}

export const getAmountArticlesToRemoveOptions = (amount = 1) => {
  return Array.from({ length: amount }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`
  }))
}

type OptionClientType = ClientType & {
  value: string
}

export const joinClients = (dbInitial: PureClientType[] = [], currentClients: ClientType[] = []) => {
  const uniqueClients: { [key: string]: PureClientType } = {}
  dbInitial.forEach((client) => {
    uniqueClients[client?.name] = client
  })
  currentClients.forEach((client) => {
    if (!Object.hasOwn(uniqueClients, client?.name)) {
      const {articles, ...restClient} = client
      uniqueClients[client?.name] = restClient
    }
  })
  // add value property for the autocomplete field
  return Object.values(uniqueClients).map(client => ({ ...client, value: client?.name } as OptionClientType))
}

export const getNewClients = (dbInitial: PureClientType[] = [], currentClients: ClientType[] = []) => {
  const dbClients: { [key: string]: PureClientType | ClientType } = {}
  dbInitial.forEach((client) => {
    dbClients[client?.name] = client
  })
  const newClients = currentClients.filter((client) => !Object.hasOwn(dbClients, client?.name))
  return newClients.map(client => {
    const { articles, ...dbShapedClient } = client
    return dbShapedClient
  })
}

export const mergeRegistriesClients = (registries: RegistryType[] = []) => {
  const mergedClients: ClientType[] = []
  registries.forEach(reg => {
    reg?.clients?.forEach((client) => {
      const foundIndex = mergedClients.findIndex(mc => mc?.id === client?.id || mc?.name === client?.name)
      // in case client hasn't been added to the list of merged clients
      if (foundIndex === -1) {
        mergedClients.push(client)
        return
      }
      // in case client has already been added to the list of merged clients
      const foundClientArticles = mergedClients[foundIndex]?.articles || []
      mergedClients[foundIndex] = {
        ...mergedClients[foundIndex],
        articles: [...foundClientArticles, ...client.articles]
      }
    })
  })
  return mergedClients
}

export const mergeRegistries = (registries: RegistryType[] = []) => {
  return {
    ids: registries.map(reg => reg?.id ?? '')?.join(''),
    dates: registries.map(reg => reg?.date ?? ''),
    combinedClients: mergeRegistriesClients(registries)
  }
}

export const sortRegistriesByDate = (registries: RegistryType[] = []) => {
  return registries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export const calcMonthTotal = (registries: RegistryType[] = []) => {
  return registries.reduce((acc, current) => acc + calcClientsTotal(current.clients), 0)
}

export const countClientsTotal = (registries: RegistryType[] = []) => {
  return mergeRegistriesClients(registries).length
}
