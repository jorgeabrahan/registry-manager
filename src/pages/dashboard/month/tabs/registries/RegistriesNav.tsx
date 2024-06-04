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

export const RegistriesNav: React.FC<RegistriesNavProps> = ({
  isFetching = false,
  handleReload = () => {},
  handleCreate = () => {},
  handleRemoveSelected = () => {},
  handleCombineSelected = () => {}
}) => {
  const { selectedRegistries, clearSelectedRegistries } = selectedRegistryStore()
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
        isDisabled={selectedRegistries.length <= 1}
      >
        <TrashIcon size='15px' /> <span className='w-max'>Eliminar seleccionados</span>
      </MiniSecondaryClickable>
      <MiniSecondaryClickable
        isDisabled={selectedRegistries.length <= 1}
        handleClick={handleCombineSelected}
      >
        <CombineIcon size='15px' /> <span className='w-max'>Combinar seleccionados</span>
      </MiniSecondaryClickable>
      <MiniSecondaryClickable
        isDisabled={selectedRegistries.length <= 1}
        handleClick={clearSelectedRegistries}
      >
        <ListIcon size='15px' /> <span className='w-max'>Deseleccionar todo</span>
      </MiniSecondaryClickable>
    </nav>
  )
}

type RegistriesNavProps = {
  isFetching?: boolean,
  handleReload?: () => void,
  handleCreate?: () => void,
  handleRemoveSelected?: () => void,
  handleCombineSelected?: () => void
}
