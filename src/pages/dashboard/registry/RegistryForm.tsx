import { FloppyDiskIcon, PlusCircleIcon, TrashIcon } from '@/assets/icons'
import {
  AutoComplete,
  AutoCompleteOption,
  Field,
  PrimaryClickable,
  SelectField
} from '@/components'
import {
  dbCreateClients,
  dbCreateRegistry,
  dbGetClients,
  dbUpdateRegistry
} from '@/firebase/db/registries'
import { useConfirmModal, useForm } from '@/hooks'
import { ButtonActionType } from '@/lib/types'
import { checkAmount, checkPrice, formatHNL, formatName } from '@/lib/utils'
import {
  craftClientArticles,
  getAmountOptions,
  getClientIdFromName,
  getNewClients,
  joinClients,
  sortClientsByName
} from '@/lib/utils/registryUtils'
import { activeUserStore, navStore, registriesStore } from '@/zustand'
import { clientsStore } from '@/zustand/clientsStore'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { MONTHS } from '../constants'
import { currentRegistryStore } from './currentRegistryStore'
import { toast } from 'sonner'

const RegistryHeaderButton: React.FC<RegistryHeaderButtonProps> = ({
  children,
  text = '',
  handleClick = () => {},
  type = 'button',
  isDisabled = false
}) => {
  return (
    <PrimaryClickable
      className='flex w-full xs:w-max text-sm md:text-base justify-center items-center gap-2'
      handleClick={handleClick}
      type={type}
      isDisabled={isDisabled}
    >
      <span className='hidden sm:block'>{children}</span> {text}
    </PrimaryClickable>
  )
}
enum AddClientFields {
  client = 'client',
  price = 'price',
  amount = 'amount'
}
const INITIAL_FORM = {
  client: '',
  price: '',
  amount: '1'
}
export const RegistryForm: React.FC<RegistryFormProps> = ({
  handleClearRegistry = () => {},
  handleDisableBreadcrumb = () => {}
}) => {
  const clientInputRef = useRef<HTMLInputElement>(null)
  const [isBusy, setIsBusy] = useState(false)
  const { showConfirmModal } = useConfirmModal()
  const storeCurrentRegistry = currentRegistryStore()
  const storeRegistries = registriesStore()
  const { activeUser } = activeUserStore()
  const { dbInitialClients, setDbInitialClients } = clientsStore()
  const { setIsNavDisabled } = navStore()
  const {
    client,
    price,
    amount,
    onInputChange,
    setInputValue,
    onInputError,
    onResetForm,
    formErrors
  } = useForm(INITIAL_FORM)
  /* effect to enable and disable breadcrumb, and navbar whenever the isBusy state changes */
  useEffect(() => {
    handleDisableBreadcrumb(isBusy)
    setIsNavDisabled(isBusy)
  }, [isBusy, handleDisableBreadcrumb, setIsNavDisabled])
  /* effect to enable the breadcrumb, and navbar before unmounting this component */
  useEffect(() => {
    return () => {
      handleDisableBreadcrumb(false)
      setIsNavDisabled(false)
    }
  }, [handleDisableBreadcrumb, setIsNavDisabled])
  /* load initial clients from db (for autocomplete) */
  useEffect(() => {
    const fetchDbInitialClients = async () => {
      try {
        const res = await dbGetClients(activeUser?.uid ?? '')
        if (res.ok) setDbInitialClients(res.clients)
      } catch (_) {
        return
      }
    }
    fetchDbInitialClients()
  }, [activeUser?.uid, setDbInitialClients])
  /* effect to store the registry in progress in the local storage whenever it changes */
  useEffect(() => {
    // when the registry is being edited
    // changes are not saved in the local storage nor in the database
    // at least not until changes are saved
    if (storeCurrentRegistry.currentRegistry.isEditing) return
    // when there are no clients to save
    if (storeCurrentRegistry.currentRegistry.clients.length === 0) {
      localStorage.removeItem('registry-in-progress')
      return
    }
    localStorage.setItem(
      'registry-in-progress',
      JSON.stringify(storeCurrentRegistry.currentRegistry)
    )
  }, [storeCurrentRegistry.currentRegistry])

  const focusClientInput = () => {
    if (clientInputRef.current != null) clientInputRef.current?.focus()
  }
  const addClient = () => {
    const formattedClientName = formatName(client)
    const clientArticles = craftClientArticles(price, amount)
    const clientId = getClientIdFromName(
      storeCurrentRegistry.currentRegistry.clients,
      formattedClientName
    )
    const createNewClient = () => {
      const uniqueId =
        getClientIdFromName(dbInitialClients, formattedClientName) ?? uuid()
      storeCurrentRegistry.addClient({
        id: uniqueId,
        name: formattedClientName,
        articles: clientArticles
      })
      storeCurrentRegistry.addHistoryAction(
        `Crear cliente ${formattedClientName} con ${amount} artículos de ${formatHNL(
          Number(price)
        )}`
      )
      toast.success(`${formattedClientName} agregado`)
    }
    if (clientId == null) {
      /* in case it is a new client in the current registry */
      if (formattedClientName.split(' ').length === 1) {
        showConfirmModal({
          message:
            'No es recomendable agregar clientes con solo un nombre ¿Desea agregarlo igual?',
          onConfirm: () => {
            createNewClient()
            onResetForm()
            focusClientInput()
          }
        })
        return
      }
      createNewClient()
    } else {
      storeCurrentRegistry.addArticles(clientId, clientArticles)
      storeCurrentRegistry.addHistoryAction(
        `Agregar ${amount} artículos de ${formatHNL(
          Number(price)
        )} a ${formattedClientName}`
      )
      toast.success(`${formattedClientName} actualizado`)
    }
    onResetForm()
    focusClientInput()
  }
  const validateForm = () => {
    let errors = []
    errors.push(onInputError(AddClientFields.price, checkPrice(price)))
    errors.push(
      onInputError(AddClientFields.amount, checkAmount(amount, [1, 10]))
    )
    if (errors.includes(true)) return
    addClient()
  }
  const handleAddClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateForm()
  }
  const editRegistry = async (
    registryYear: string,
    registryMonth: string,
    tIdLoadingRegistry: string | number
  ) => {
    try {
      const { isEditing, ...updatedRegistry } =
        storeCurrentRegistry.currentRegistry
      const res = await dbUpdateRegistry(
        activeUser?.uid ?? '',
        registryYear,
        registryMonth,
        updatedRegistry
      )
      if (!res.ok) {
        toast.dismiss(tIdLoadingRegistry)
        toast.error(res?.error ?? '')
        return
      }
      toast.dismiss(tIdLoadingRegistry)
      toast.success(res?.success ?? '')
      storeRegistries.updateRegistry(
        registryYear,
        registryMonth,
        updatedRegistry
      )
      handleClearRegistry()
    } catch (_) {
      toast.dismiss(tIdLoadingRegistry)
      toast.error('Error al actualizar el registro.')
    } finally {
      setIsBusy(false)
    }
  }
  const createRegistry = async (
    registryYear: string,
    registryMonth: string,
    tIdLoadingRegistry: string | number
  ) => {
    try {
      const { isEditing, ...createdRegistry } =
        storeCurrentRegistry.currentRegistry
      const res = await dbCreateRegistry(
        activeUser?.uid ?? '',
        registryYear,
        registryMonth,
        createdRegistry
      )
      if (!res.ok) {
        toast.dismiss(tIdLoadingRegistry)
        toast.error(res?.error ?? '')
        return
      }
      toast.dismiss(tIdLoadingRegistry)
      toast.success(res?.success ?? '')
      // only if registry was created successfully
      // the local copy is removed from the storage
      localStorage.removeItem('registry-in-progress')
      storeRegistries.addRegistry(registryYear, registryMonth, createdRegistry)
      handleClearRegistry()
    } catch (_) {
      toast.dismiss(tIdLoadingRegistry)
      toast.error('Error al crear el registro.')
    } finally {
      setIsBusy(false)
    }
  }
  const handleSaveRegistry = async () => {
    if (storeCurrentRegistry.currentRegistry.clients.length === 0) {
      toast.error('El registro está vacío')
      return
    }
    setIsBusy(true)
    const newClients = getNewClients(
      dbInitialClients,
      storeCurrentRegistry.currentRegistry.clients
    )
    const registryDate = new Date(storeCurrentRegistry.currentRegistry.date)
    const registryYear = `${registryDate.getFullYear()}`
    const registryMonth = MONTHS[registryDate.getMonth()]
    let tIdLoadingClients = null
    if (newClients.length !== 0)
      tIdLoadingClients = toast.loading('Guardando clientes')
    let tIdSaveRes = null
    try {
      if (newClients.length !== 0) {
        await dbCreateClients(activeUser?.uid ?? '', newClients)
        toast.dismiss(tIdLoadingClients ?? '')
        tIdSaveRes = toast.success('Clientes guardados!')
      }
    } catch (_) {
      tIdSaveRes = toast.error('Error al guardar los clientes.')
    }
    const isEditing = storeCurrentRegistry.currentRegistry?.isEditing
    toast.dismiss(tIdSaveRes ?? '')
    const tIdLoadingRegistry = toast.loading(
      `${isEditing ? 'Actualizando' : 'Creando'} registro`
    )
    if (!isEditing) {
      createRegistry(registryYear, registryMonth, tIdLoadingRegistry)
      return
    }
    editRegistry(registryYear, registryMonth, tIdLoadingRegistry)
  }
  const handleClearClients = () => {
    showConfirmModal({
      message: 'Eliminar todos los clientes',
      onConfirm: () => {
        storeCurrentRegistry.clearClients() // clear store clients
        storeCurrentRegistry.addHistoryAction('Eliminar todos los clientes')
        focusClientInput()
      }
    })
  }
  const handleClientSelect = (client: AutoCompleteOption) => {
    setInputValue('client', client?.value ?? '')
  }
  return (
    <form onSubmit={handleAddClientSubmit}>
      <section className='flex flex-col md:flex-row items-start gap-3 mb-3'>
        <AutoComplete
          slug='client'
          value={client}
          handleChange={onInputChange}
          reference={clientInputRef}
          formErrors={formErrors}
          autoFocus
          isRequired
          autoCompleteValues={sortClientsByName(
            joinClients(
              dbInitialClients,
              storeCurrentRegistry.currentRegistry.clients
            )
          )}
          handleAutoCompleteValueSelected={handleClientSelect}
        >
          Nombre cliente
        </AutoComplete>
        <Field
          slug='price'
          value={price}
          type='number'
          handleChange={onInputChange}
          formErrors={formErrors}
          isRequired
        >
          Costo unitario
        </Field>
        <SelectField
          slug='amount'
          value={amount}
          options={getAmountOptions()}
          handleChange={onInputChange}
          formErrors={formErrors}
          isRequired
        >
          Cantidad
        </SelectField>
      </section>
      <nav className='flex flex-col-reverse xs:flex-row items-center justify-end gap-2'>
        <RegistryHeaderButton
          text={`${
            storeCurrentRegistry.currentRegistry?.isEditing
              ? 'Actualizar'
              : 'Guardar'
          } registro`}
          handleClick={handleSaveRegistry}
          isDisabled={isBusy}
        >
          <FloppyDiskIcon size='20px' />
        </RegistryHeaderButton>
        <RegistryHeaderButton
          text='Eliminar clientes'
          handleClick={handleClearClients}
          isDisabled={isBusy}
        >
          <TrashIcon size='20px' />
        </RegistryHeaderButton>
        <RegistryHeaderButton
          text='Agregar cliente'
          type='submit'
          isDisabled={isBusy}
        >
          <PlusCircleIcon size='20px' />
        </RegistryHeaderButton>
      </nav>
    </form>
  )
}

type RegistryHeaderButtonProps = {
  children: React.ReactNode
  text?: string
  handleClick?: () => void
  type?: ButtonActionType
  isDisabled?: boolean
}

type RegistryFormProps = {
  handleClearRegistry: () => void
  handleDisableBreadcrumb: (isDisabled: boolean) => void
}
