import { ArticleType } from "./article.type"

export type ClientType = {
  id: string,
  name: string,
  articles: ArticleType[]
}

export type PureClientType = Omit<ClientType, 'articles'>
