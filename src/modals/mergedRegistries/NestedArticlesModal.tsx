import { ArticleType } from '@/lib/types/registries'
import { formatHNL } from '@/lib/utils'
import { groupArticles } from '@/lib/utils/registryUtils'
import React from 'react'
import { ModalLayout } from '../ModalLayout'

export const NestedArticlesModal: React.FC<NestedArticlesModalProps> = ({
  handleHideModal = () => {},
  articlesToDisplay = []
}) => {
  return (
    <ModalLayout className='h-[400px] overflow-y-auto' handleHideModal={handleHideModal} isNested>
      <section>
        {groupArticles(articlesToDisplay).map((group) => (
          <article className='py-1 flex items-baseline gap-3' key={group.id}>
            <p className='font-bold text-3xl font-mono'>{formatHNL(group.price)}</p>
            <p className='text-dove-gray-200 font-mono w-max'>x {group.amount}</p>
          </article>
        ))}
      </section>
    </ModalLayout>
  )
}

type NestedArticlesModalProps = {
  handleHideModal?: () => void
  articlesToDisplay: ArticleType[]
}
