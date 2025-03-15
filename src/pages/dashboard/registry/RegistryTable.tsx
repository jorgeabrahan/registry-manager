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
import { calcDaysInMonth, formatHNL, formatInputDate } from '@/lib/utils'
import {
  calcClientTotal,
  calcClientsTotal,
  getClientIdFromName,
  sortClientsByName
} from '@/lib/utils/registryUtils'
import { useEffect, useState } from 'react'
import { currentRegistryStore } from './currentRegistryStore'
import { ClientModalTabs } from '@/lib/enums'
import { MONTHS } from '../constants'
import { toast } from 'sonner'

const INITIAL_CLIENT_MODAL = {
  client: null,
  activeTab: ClientModalTabs.articles
}

export const RegistryTable: React.FC<RegistryTableProps> = ({
  year,
  month,
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
  const { date, onInputChange, setInputValue } = useForm({
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

  const updateBreadcrumbOnDateChange = (selectedDate: Date) => {
    const previousDate = new Date(currentRegistry.date)
    const yearAndMonthHasntChanged =
      previousDate.getFullYear() === selectedDate.getFullYear() &&
      previousDate.getMonth() === selectedDate.getMonth()
    if (yearAndMonthHasntChanged) return
    handleUpdateBreadcrumbDate(
      selectedDate.getFullYear().toString(),
      selectedDate.getMonth().toString()
    )
  }
  const handleRemoveArticles = (
    purgedArticles: ArticleType[],
    priceOfArticlesToRemove: number
  ) => {
    if (clientModal?.client?.id == null) return
    if (purgedArticles.length === 0) {
      removeClient(clientModal.client.id)
      addHistoryAction(`Eliminar cliente ${clientModal.client.name}`)
    } else {
      updateArticles(clientModal.client.id, purgedArticles)
      const removedArticlesAmount =
        clientModal.client.articles.length - purgedArticles.length
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
      addHistoryAction(
        `Cambiar nombre de ${clientModal.client.name} a ${newName}`
      )
      setClientModal(INITIAL_CLIENT_MODAL)
      return
    }
    showConfirmModal({
      message: `Ya existe un cliente llamado ${newName}. ¿Desea unificarlos?`,
      onConfirm: () => {
        if (clientModal?.client?.id == null) return
        mergeClients(clientModal?.client?.id, clientId)
        addHistoryAction(
          `Unificar cliente ${clientModal.client.name} con ${newName}`
        )
        setClientModal(INITIAL_CLIENT_MODAL)
      }
    })
  }
  const maxDaysInCurrentMonth = calcDaysInMonth(month, year)
  const handleDateUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [selectedYear, selectedMonth, selectedDay] = e.target.value
      .split('-')
      .map(Number)
    const selectedMonthIndex = selectedMonth - 1
    const selectedDate = new Date(selectedYear, selectedMonthIndex, selectedDay)
    const isInvalidDate =
      isNaN(selectedYear) ||
      isNaN(selectedMonth) ||
      isNaN(selectedDay) ||
      isNaN(selectedDate.getTime())
    if (isInvalidDate) {
      setInputValue('date', formatInputDate(currentRegistry.date))
      return
    }
    if (selectedDay > maxDaysInCurrentMonth) {
      setInputValue('date', formatInputDate(currentRegistry.date))
      toast.error(
        'El día seleccionado es mayor que el máximo de días del mes seleccionado.'
      )
      return
    }
    const yearOrMonthChanged =
      selectedYear !== parseInt(year, 10) ||
      selectedMonthIndex !== MONTHS.findIndex((m) => m === month)
    if (currentRegistry?.isEditing && yearOrMonthChanged) {
      setInputValue('date', formatInputDate(currentRegistry.date))
      toast.error(
        'No se puede cambiar el año o mes cuando se está editando el registro.'
      )
      return
    }
    if (!currentRegistry?.isEditing) updateBreadcrumbOnDateChange(selectedDate)

    updateDate(selectedDate.toISOString())
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
          min={
            currentRegistry?.isEditing
              ? formatInputDate(
                  new Date(
                    parseInt(year, 10),
                    MONTHS.findIndex((m) => m === month),
                    1
                  ).toISOString()
                )
              : ''
          }
          max={
            currentRegistry?.isEditing
              ? formatInputDate(
                  new Date(
                    parseInt(year, 10),
                    MONTHS.findIndex((m) => m === month),
                    maxDaysInCurrentMonth
                  ).toISOString()
                )
              : ''
          }
          handleChange={(e) => {
            onInputChange(e)
            handleDateUpdate(e)
          }}
        />
      </section>
      <section className='bg-tundora-950 rounded-lg mb-24'>
        <TableHeader
          items={REGISTRY_TABLE_COLUMNS(currentRegistry.clients?.length)}
        />
        {sortClientsByName(currentRegistry.clients)?.map((client) => {
          const { id, name, articles } = client
          return (
            <TableRow
              key={id}
              items={REGISTRY_TABLE_ROWS(
                name,
                articles.length,
                calcClientTotal(articles)
              )}
              buttons={REGISTRY_TABLE_ROW_BUTTONS({
                removeIcon: <TrashIcon size='15px' />,
                articlesIcon: <ArchiveIcon size='15px' />,
                editIcon: <EditPencilIcon size='15px' />,
                onRemove: () => {
                  showConfirmModal({
                    message: `Eliminar el cliente ${name}`,
                    onConfirm: () => {
                      removeClient(id)
                      addHistoryAction(`Eliminar cliente ${name}`)
                    }
                  })
                },
                onArticles: () =>
                  setClientModal({
                    client,
                    activeTab: ClientModalTabs.articles
                  }),
                onEdit: () =>
                  setClientModal({ client, activeTab: ClientModalTabs.edit })
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
  year: string
  month: string
  handleUpdateBreadcrumbDate: (year: string, month: string) => void
}
