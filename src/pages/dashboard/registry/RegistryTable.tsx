import { ArchiveIcon, EditPencilIcon, TrashIcon } from '@/assets/icons'
import { DateField, TableHeader, TableRow } from '@/components'
import {
  REGISTRY_TABLE_COLUMNS,
  REGISTRY_TABLE_ROWS,
  REGISTRY_TABLE_ROW_BUTTONS
} from '@/lib/consts'
import { useConfirmModal, useForm } from '@/hooks'
import { ClientModal } from '@/modals/client'
import { ArticleType, ClientType } from '@/lib/types/registries'
import { formatHNL, formatInputDate } from '@/lib/utils'
import {
  calcClientTotal,
  calcClientsTotal,
  getClientIdFromName,
  sortClientsByName
} from '@/lib/utils/registryUtils'
import { useEffect, useState } from 'react'
import { currentRegistryStore } from './currentRegistryStore'
import { ClientModalTabs } from '@/lib/enums'

const INITIAL_CLIENT_MODAL = { client: null, activeTab: ClientModalTabs.articles }

export const RegistryTable: React.FC<RegistryTableProps> = ({
  handleUpdateBreadcrumbDate = () => {}
}) => {
  const { showConfirmModal } = useConfirmModal()
  const {
    currentRegistry,
    removeClient,
    updateArticles,
    updateClientName,
    mergeClients,
    updateDate,
    addHistoryAction
  } = currentRegistryStore()
  const [clientModal, setClientModal] = useState<{
    client: ClientType | null
    activeTab: ClientModalTabs
  }>(INITIAL_CLIENT_MODAL)
  const { date, onInputChange } = useForm({
    date: formatInputDate(currentRegistry.date)
  })
  useEffect(() => {
    const initialDate = new Date(currentRegistry.date)
    if (!isNaN(initialDate.getTime())) {
      handleUpdateBreadcrumbDate(
        initialDate.getFullYear().toString(),
        initialDate.getMonth().toString()
      )
    }
  }, [])

  const onDateInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const tempDate = new Date(target?.value)
    const previousDate = new Date(currentRegistry.date)
    if (
      previousDate.getFullYear() === tempDate.getFullYear() &&
      previousDate.getMonth() === tempDate.getMonth()
    )
      return
    if (!isNaN(tempDate.getTime())) {
      handleUpdateBreadcrumbDate(tempDate.getFullYear().toString(), tempDate.getMonth().toString())
      updateDate(tempDate.toISOString())
    }
  }
  const handleRemoveArticles = (purgedArticles: ArticleType[], priceOfArticlesToRemove: number) => {
    if (clientModal?.client?.id == null) return
    if (purgedArticles.length === 0) {
      removeClient(clientModal.client.id)
      addHistoryAction(`Eliminar cliente ${clientModal.client.name}`)
    } else {
      updateArticles(clientModal.client.id, purgedArticles)
      const removedArticlesAmount = clientModal.client.articles.length - purgedArticles.length
      addHistoryAction(
        `Eliminar ${removedArticlesAmount} artículo${
          removedArticlesAmount === 1 ? '' : 's'
        } de ${formatHNL(priceOfArticlesToRemove)} ${clientModal.client.name}`
      )
    }
    setClientModal(INITIAL_CLIENT_MODAL)
  }
  const handleUpdateClientName = (newName: string) => {
    if (clientModal?.client?.id == null) return
    const clientId = getClientIdFromName(currentRegistry.clients, newName)
    if (clientId == null) {
      updateClientName(clientModal.client.id, newName)
      addHistoryAction(`Cambiar nombre de ${clientModal.client.name} a ${newName}`)
      setClientModal(INITIAL_CLIENT_MODAL)
      return
    }
    showConfirmModal({
      message: `Ya existe un cliente llamado <strong>${newName}</strong>. ¿Desea unificarlos?`,
      onConfirm: () => {
        if (clientModal?.client?.id == null) return
        mergeClients(clientModal?.client?.id, clientId)
        addHistoryAction(`Unificar cliente ${clientModal.client.name} con ${newName}`)
        setClientModal(INITIAL_CLIENT_MODAL)
      }
    })
  }
  return (
    <>
      <section className='my-4 flex justify-between items-center'>
        <div className='font-semibold'>
          <p className='text-dove-gray-300 leading-3'>Total</p>{' '}
          <p className='text-2xl font-mono'>
            {formatHNL(calcClientsTotal(currentRegistry.clients))}
          </p>
        </div>
        <DateField
          isFullWidth={false}
          slug='date'
          value={date}
          isDisabled={currentRegistry?.isEditing}
          handleChange={(e) => {
            onInputChange(e)
            onDateInputChange(e)
          }}
        />
      </section>
      <section className='bg-tundora-950 rounded-lg mb-24'>
        <TableHeader items={REGISTRY_TABLE_COLUMNS(currentRegistry.clients?.length)} />
        {sortClientsByName(currentRegistry.clients)?.map((client) => {
          const { id, name, articles } = client
          return (
            <TableRow
              key={id}
              items={REGISTRY_TABLE_ROWS(name, articles.length, calcClientTotal(articles))}
              buttons={REGISTRY_TABLE_ROW_BUTTONS({
                removeIcon: <TrashIcon size='15px' />,
                articlesIcon: <ArchiveIcon size='15px' />,
                editIcon: <EditPencilIcon size='15px' />,
                onRemove: () => {
                  showConfirmModal({
                    message: `Eliminar el cliente <strong>${name}</strong>`,
                    onConfirm: () => {
                      removeClient(id)
                      addHistoryAction(`Eliminar cliente ${name}`)
                    }
                  })
                },
                onArticles: () => setClientModal({ client, activeTab: ClientModalTabs.articles }),
                onEdit: () => setClientModal({ client, activeTab: ClientModalTabs.edit })
              })}
            />
          )
        })}
      </section>
      {clientModal?.client != null && (
        <ClientModal
          handleHideModal={() => setClientModal(INITIAL_CLIENT_MODAL)}
          initialTab={clientModal?.activeTab}
          client={clientModal?.client}
          handleRemoveArticles={handleRemoveArticles}
          handleUpdateClientName={handleUpdateClientName}
        />
      )}
    </>
  )
}

type RegistryTableProps = {
  handleUpdateBreadcrumbDate: (year: string, month: string) => void
}
