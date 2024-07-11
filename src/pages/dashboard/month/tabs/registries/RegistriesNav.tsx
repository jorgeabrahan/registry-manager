import {
  CombineIcon,
  ListIcon,
  PlusCircleIcon,
  RefreshIcon,
  TrashIcon
} from '../../../../../assets/icons'
import { selectedRegistryStore } from './selectedRegistriesStore'
import { MiniSecondaryClickable } from '../../../../../components'
import React from 'react'
import { registriesStore } from '@/zustand'
import { MONTHS } from '@/pages/dashboard/constants'

export const RegistriesNav: React.FC<RegistriesNavProps> = ({
  year = '',
  month = '',
  isFetching = false,
  handleReload = () => {},
  handleCreate = () => {},
  handleRemoveSelected = () => {},
  handleCombineSelected = () => {},
  handleCombineWeek = () => {}
}) => {
  const storeRegistries = registriesStore()
  const { selectedRegistries, clearSelectedRegistries } = selectedRegistryStore()
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  return (
    <nav className='flex items-center gap-2 overflow-x-scroll hide-scrollbar'>
      <MiniSecondaryClickable isDisabled={isFetching} handleClick={handleReload}>
        <RefreshIcon size='15px' /> Recargar
      </MiniSecondaryClickable>
      <MiniSecondaryClickable isDisabled={isFetching} handleClick={handleCreate}>
        <PlusCircleIcon size='15px' />{' '}
        <span className='w-max'>
          {localStorage.getItem('registry-in-progress') != null
            ? 'Continuar creando'
            : 'Crear registro'}
        </span>
      </MiniSecondaryClickable>
      <MiniSecondaryClickable
        handleClick={handleRemoveSelected}
        isDisabled={selectedRegistries.length <= 1 || isFetching}
      >
        <TrashIcon size='15px' /> <span className='w-max'>Eliminar seleccionados</span>
      </MiniSecondaryClickable>
      <MiniSecondaryClickable
        isDisabled={selectedRegistries.length <= 1 || isFetching}
        handleClick={handleCombineSelected}
      >
        <CombineIcon size='15px' /> <span className='w-max'>Combinar seleccionados</span>
      </MiniSecondaryClickable>
      {year === currentYear.toString() && month === MONTHS[currentMonth] && (
        <MiniSecondaryClickable
          isDisabled={isFetching || storeRegistries.months[`${year}-${month}`]?.length === 0}
          handleClick={handleCombineWeek}
        >
          <CombineIcon size='15px' /> <span className='w-max'>Combinar semana</span>
        </MiniSecondaryClickable>
      )}
      <MiniSecondaryClickable
        isDisabled={selectedRegistries.length <= 1 || isFetching}
        handleClick={clearSelectedRegistries}
      >
        <ListIcon size='15px' /> <span className='w-max'>Deseleccionar todo</span>
      </MiniSecondaryClickable>
    </nav>
  )
}

type RegistriesNavProps = {
  year?: string
  month?: string
  isFetching?: boolean
  handleReload?: () => void
  handleCreate?: () => void
  handleRemoveSelected?: () => void
  handleCombineSelected?: () => void
  handleCombineWeek?: () => void
}
