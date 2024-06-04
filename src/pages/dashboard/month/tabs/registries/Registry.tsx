import { EditPencilIcon, ListSelectIcon, SortDownIcon, TrashIcon } from '@/assets/icons'
import { MiniSecondaryClickable } from '@/components'
import { ClientType, RegistryType } from '@/lib/types/registries'
import { formatDateFriendly, formatHNL } from '@/lib/utils'
import {
  calcClientTotal,
  calcClientsTotal,
  countArticlesTotal,
  getBestBuyers,
  groupArticles,
  sortClientsByName,
  sortClientsByTotal
} from '@/lib/utils/registryUtils'
import React, { useState } from 'react'
import { selectedRegistryStore } from './selectedRegistriesStore'

const RegistryClient: React.FC<RegistryClientProps> = ({ client, showArticles = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  if (!showArticles)
    return (
      <p className='flex items-center justify-between gap-2 text-lg font-[500]'>
        <span>{client.name}</span>
        <span>{formatHNL(calcClientTotal(client.articles))}</span>
      </p>
    )
  return (
    <details
      className='text-lg font-mono transition-[padding,background] duration-300 ease-in-out'
      open={isOpen}
      onToggle={(event: React.SyntheticEvent<HTMLDetailsElement, Event>) =>
        setIsOpen(event.currentTarget.open)
      }
    >
      <summary className='flex items-center justify-between gap-2 cursor-pointer text-lg font-[500]'>
        <span>{client.name}</span>
        <span>{formatHNL(calcClientTotal(client.articles))}</span>
      </summary>
      <div>
        {groupArticles(client.articles).map((articlesGroup) => (
          <p className='flex items-baseline justify-end gap-2 text-white/70' key={articlesGroup.id}>
            <span className='text-base leading-3'>{formatHNL(articlesGroup.price)}</span>{' '}
            <span className='text-sm'>x {articlesGroup.amount}</span>
          </p>
        ))}
      </div>
    </details>
  )
}

enum SORT_BY {
  name = 'name',
  total = 'total'
}

export const Registry: React.FC<RegistryProps> = ({
  registry,
  handleRegistryRemove = () => {},
  handleRegistryEdit = () => {},
  isBusy = false
}) => {
  const { selectedRegistries, selectRegistry, deselectRegistry } = selectedRegistryStore()
  const isSelected = selectedRegistries.find((sr) => sr === registry.id) != null
  const [sortedBy, setSortedBy] = useState(SORT_BY.total)
  const handleRegistryToggleSelect = () => {
    if (isSelected) {
      deselectRegistry(registry.id)
      return
    }
    selectRegistry(registry.id)
  }
  const getSortedClients = () => {
    if (sortedBy === SORT_BY.name) {
      return sortClientsByName(registry?.clients)
    }
    return sortClientsByTotal(registry?.clients)
  }
  return (
    <article
      className={`bg-tundora-950 p-3 rounded-xl border border-solid ${
        isSelected ? 'border-white/55' : 'border-white/5'
      }`}
      key={registry?.id}
    >
      <section className='grid lg:grid-cols-2 gap-4 lg:gap-6 mb-4'>
        <div className='grid gap-4'>
          <section className='text-white/70'>
            <h2 className='text-xl font-semibold mb-1'>{formatDateFriendly(registry?.date)}</h2>
            <p className='flex items-center justify-between gap-2 text-lg font-mono'>
              <span>Clientes:</span> <span>{registry?.clients?.length}</span>
            </p>
            <p className='flex items-center justify-between gap-2 text-lg font-mono'>
              <span>Articulos:</span>
              <span>{countArticlesTotal(registry?.clients ?? [])}</span>
            </p>
            <p className='flex items-center justify-between gap-2 text-lg font-mono'>
              <span>Total:</span>
              <span>{formatHNL(calcClientsTotal(registry?.clients ?? []))}</span>
            </p>
          </section>
          <section className='text-white/70 font-mono'>
            <h2 className='text-xl font-semibold mb-1'>Compradores estrella</h2>
            {getBestBuyers(registry?.clients ?? []).map((client) => (
              <RegistryClient key={client.id} client={client} />
            ))}
          </section>
        </div>
        <div>
          <header className='flex items-center justify-between gap-2 mb-2'>
            <h2 className='text-xl font-semibold'>Clientes</h2>
            <div className='flex items-center gap-2'>
              <MiniSecondaryClickable
                className={sortedBy === SORT_BY.name ? 'border-white/55' : ''}
                title='Ordenar por nombre'
                isDisabled={isBusy || sortedBy === SORT_BY.name}
                handleClick={() => setSortedBy(SORT_BY.name)}
              >
                <SortDownIcon size='18' />
                <span className='text-xs'>ABC</span>
              </MiniSecondaryClickable>
              <MiniSecondaryClickable
                className={sortedBy === SORT_BY.total ? 'border-white/55' : ''}
                title='Ordenar por total'
                isDisabled={isBusy || sortedBy === SORT_BY.total}
                handleClick={() => setSortedBy(SORT_BY.total)}
              >
                <SortDownIcon size='18' />
                <span className='text-xs'>123</span>
              </MiniSecondaryClickable>
            </div>
          </header>
          <div className='h-full max-h-[220px] overflow-y-auto mini-scrollbar flex flex-col gap-2'>
            {getSortedClients()?.map((client) => (
              <RegistryClient key={client.id} client={client} showArticles />
            ))}
          </div>
        </div>
      </section>
      <section className='flex flex-wrap items-center lg:justify-end gap-2 overflow-x-scroll hide-scrollbar'>
        <MiniSecondaryClickable handleClick={handleRegistryToggleSelect} isDisabled={isBusy}>
          <ListSelectIcon size='15px' />
          {isSelected ? 'Quitar selección' : 'Seleccionar'}
        </MiniSecondaryClickable>
        <MiniSecondaryClickable handleClick={handleRegistryRemove} isDisabled={isBusy}>
          <TrashIcon size='15px' />
          Eliminar
        </MiniSecondaryClickable>
        <MiniSecondaryClickable handleClick={handleRegistryEdit} isDisabled={isBusy}>
          <EditPencilIcon size='15px' />
          Editar
        </MiniSecondaryClickable>
      </section>
    </article>
  )
}

type RegistryClientProps = {
  client: ClientType
  showArticles?: boolean
}

type RegistryProps = {
  registry: RegistryType
  handleRegistryRemove: () => void
  handleRegistryEdit: () => void
  isBusy: boolean
}
