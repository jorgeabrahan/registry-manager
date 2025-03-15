import { TrashIcon } from '@/assets/icons'
import { CustomClickable, SelectField } from '@/components'
import { useConfirmModal, useForm } from '@/hooks'
import { ArticleType, GroupedArticleType } from '@/lib/types/registries'
import { formatHNL } from '@/lib/utils'
import {
  getAmountArticlesToRemoveOptions,
  removeArticles
} from '@/lib/utils/registryUtils'
import React from 'react'

export const ArticlesGroup: React.FC<ArticlesGroupProps> = ({
  articlesGroup,
  articles = [],
  handleRemoveArticles = () => {}
}) => {
  const { showConfirmModal } = useConfirmModal()
  const { formState, onInputChange } = useForm({
    [articlesGroup.price]: '1'
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const amountToRemove = Number(formState[`${articlesGroup.price}`])
    showConfirmModal({
      message: `Eliminar ${amountToRemove} articulos de ${articlesGroup.price}`,
      onConfirm: () => {
        const purgedArticles = removeArticles(
          articles,
          amountToRemove,
          articlesGroup.price
        )
        handleRemoveArticles(purgedArticles, articlesGroup.price)
      }
    })
  }
  return (
    <article
      className='py-1 flex items-center gap-4 justify-between'
      key={articlesGroup.id}
    >
      <div>
        <span className='font-bold text-3xl font-mono'>
          {formatHNL(articlesGroup.price)}
        </span>{' '}
        <span className='text-dove-gray-200 font-mono w-max'>
          x {articlesGroup.amount}
        </span>
      </div>
      <form onSubmit={handleSubmit} className='flex items-center gap-2'>
        <SelectField
          customPadding='px-3 py-1'
          customIconPosition='right-3'
          customIconSize='18px'
          className='min-w-[70px]'
          slug={`${articlesGroup.price}`}
          options={getAmountArticlesToRemoveOptions(articlesGroup.amount)}
          isDisabled={articlesGroup.amount === 1}
          value={formState[`${articlesGroup.price}`]}
          handleChange={onInputChange}
        />
        <CustomClickable
          className='bg-wewak-600/80 px-4 py-2 border-white/50'
          type='submit'
          removePadding
        >
          <TrashIcon size='15px' />
        </CustomClickable>
      </form>
    </article>
  )
}

type ArticlesGroupProps = {
  articlesGroup: GroupedArticleType
  articles: ArticleType[]
  handleRemoveArticles: (
    purgedArticles: ArticleType[],
    priceOfArticlesToRemove: number
  ) => void
}
