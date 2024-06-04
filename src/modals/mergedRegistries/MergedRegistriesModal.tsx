import { ArchiveIcon, SortDownIcon } from '@/assets/icons'
import { BoxedStat, MiniSecondaryClickable, TableHeader, TableRow } from '@/components'
import {
  REGISTRIES_TABLE_COLUMNS,
  REGISTRIES_TABLE_ROW_BUTTONS,
  REGISTRY_TABLE_ROWS
} from '@/lib/consts'
import { ArticleType, MergedRegistriesType } from '@/lib/types/registries'
import { formatDateFriendly, formatHNL } from '@/lib/utils'
import {
  calcClientTotal,
  calcClientsTotal,
  countArticlesTotal,
  sortClientsByName,
  sortClientsByTotal
} from '@/lib/utils/registryUtils'
import React, { useState } from 'react'
import { ModalLayout } from '../ModalLayout'
import { NestedArticlesModal } from './NestedArticlesModal'

enum SortBy {
  name = 'name',
  total = 'total'
}
export const MergedRegistriesModal: React.FC<MergedRegistriesModalProps> = ({
  handleHideModal = () => {},
  mergedRegistries
}) => {
  const [sortedBy, setSortedBy] = useState(SortBy.total)
  const [articlesToDisplay, setArticlesToDisplay] = useState<ArticleType[]>([])
  const getSortedClients = () => {
    if (sortedBy === SortBy.name) {
      return sortClientsByName(mergedRegistries?.combinedClients ?? [])
    }
    return sortClientsByTotal(mergedRegistries?.combinedClients ?? [])
  }
  return (
    <ModalLayout
      className='h-[400px] md:h-full md:min-h-[500px] md:max-h-[600px] max-w-[1000px] overflow-y-scroll hide-scrollbar'
      handleHideModal={handleHideModal}
      hasCustomWidth
    >
      <section className='h-full'>
        <header className='mb-6 grid gap-4'>
          <section className='flex items-center justify-between gap-2'>
            <div>
              <h3 className='text-xs text-dove-gray-300'>Registros unificados</h3>
              {mergedRegistries?.dates?.map((date, index) => (
                <p key={`${date}-${index}`} className='text-sm text-dove-gray-100'>
                  {formatDateFriendly(date)}
                </p>
              ))}
            </div>
            <div className='flex flex-col items-end sm:flex-row sm:items-center gap-2'>
              <MiniSecondaryClickable
                className={sortedBy === SortBy.name ? 'border-white/55' : ''}
                title='Ordenar por nombre'
                isDisabled={sortedBy === SortBy.name}
                handleClick={() => setSortedBy(SortBy.name)}
              >
                <SortDownIcon size='18' />
                <p className='text-xs'>
                  <span className='sm:hidden'>ABC</span>
                  <span className='hidden sm:inline-block'>Ordenar por nombre</span>
                </p>
              </MiniSecondaryClickable>
              <MiniSecondaryClickable
                className={sortedBy === SortBy.total ? 'border-white/55' : ''}
                title='Ordenar por total'
                isDisabled={sortedBy === SortBy.total}
                handleClick={() => setSortedBy(SortBy.total)}
              >
                <SortDownIcon size='18' />
                <p className='text-xs'>
                  <span className='sm:hidden'>123</span>
                  <span className='hidden sm:inline-block'>Ordenar por total</span>
                </p>
              </MiniSecondaryClickable>
            </div>
          </section>
          <section className='flex sm:flex-row-reverse items-center gap-4 overflow-x-auto'>
            <BoxedStat
              title='Total vendido:'
              stat={formatHNL(calcClientsTotal(mergedRegistries?.combinedClients ?? []))}
            />
            <BoxedStat
              title='Total articulos:'
              stat={`${countArticlesTotal(mergedRegistries?.combinedClients ?? [])}`}
            />
            <BoxedStat
              title='Total clientes:'
              stat={`${mergedRegistries.combinedClients?.length}`}
            />
          </section>
        </header>

        <section className='bg-tundora-950 rounded-lg mb-20'>
          <TableHeader items={REGISTRIES_TABLE_COLUMNS()} />
          {getSortedClients()?.map((client) => {
            const { id, name, articles } = client
            return (
              <TableRow
                key={id}
                items={REGISTRY_TABLE_ROWS(name, articles.length, calcClientTotal(articles))}
                buttons={REGISTRIES_TABLE_ROW_BUTTONS({
                  articlesIcon: <ArchiveIcon size='15px' />,
                  onArticles: () => {
                    setArticlesToDisplay(articles)
                  }
                })}
              />
            )
          })}
        </section>
      </section>
      {articlesToDisplay != null && articlesToDisplay?.length > 0 && (
        <NestedArticlesModal
          articlesToDisplay={articlesToDisplay}
          handleHideModal={() => setArticlesToDisplay([])}
        />
      )}
    </ModalLayout>
  )
}

type MergedRegistriesModalProps = {
  handleHideModal?: () => void
  mergedRegistries: MergedRegistriesType
}
