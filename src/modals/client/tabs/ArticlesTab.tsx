import { ArticlesGroup } from './articles/ArticlesGroup'
import { ArticleType, ClientType } from '@/lib/types/registries'
import { groupArticles } from '@/lib/utils/registryUtils'
import React from 'react'

export const ArticlesTab: React.FC<ArticlesTabProps> = ({ client, handleRemoveArticles = () => {} }) => {
  return (
    <section className='overflow-y-scroll h-full hide-scrollbar'>
      <h2 className='text-2xl font-semibold text-dove-gray-200 mb-4'>
        Articulos de {client?.name}
      </h2>
      <section>
        {groupArticles(client?.articles)?.map((articlesGroup) => (
          <ArticlesGroup
            key={articlesGroup.id}
            articlesGroup={articlesGroup}
            articles={client?.articles}
            handleRemoveArticles={handleRemoveArticles}
          />
        ))}
      </section>
    </section>
  )
}

type ArticlesTabProps = {
  client: ClientType,
  handleRemoveArticles: (purgedArticles: ArticleType[], priceOfArticlesToRemove: number) => void
}
