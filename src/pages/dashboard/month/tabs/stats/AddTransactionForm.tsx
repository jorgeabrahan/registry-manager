import {
  AutoComplete,
  Field,
  PrimaryClickable,
  SelectField,
  TextareaField
} from '@/components'
import {
  dbAddTransactionNameRecommendations,
  dbGetTransactionNameRecommendations
} from '@/firebase/db/transactionNameRecommendations'
import {
  dbCreateTransaction,
  dbGetMonthTransactions
} from '@/firebase/db/transactions'
import { useCurrentDate, useForm } from '@/hooks'
import { TransactionTypes } from '@/lib/enums'
import {
  checkEmpty,
  checkInexactPrice,
  checkNumExact,
  checkNumInRange,
  getDayOptions
} from '@/lib/utils'
import { navStore } from '@/zustand'
import { transactionsStore } from '@/zustand/transactionsStore'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { TransactionsList } from './TransactionsList'
import { TRANSACTION_TYPES_OPTIONS } from '@/lib/consts'
import { MONTHS } from '@/pages/dashboard/constants'
import { toast } from 'sonner'

enum AddTransactionFields {
  dateDay = 'dateDay',
  type = 'type',
  name = 'name',
  amount = 'amount',
  description = 'description'
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  uid = '',
  year = '',
  month = '',
  handleDisableBreadcrumb = () => {},
  registriesTotal = 0
}) => {
  const transactionInputRef = useRef<HTMLInputElement>(null)
  const { currentDay, currentMonth, currentYear } = useCurrentDate()
  const isCurrentMonth = MONTHS.findIndex((m) => m === month) === currentMonth
  const isCurrentYear = parseInt(year, 10) === currentYear
  const INITIAL_FORM = {
    dateDay: isCurrentMonth && isCurrentYear ? currentDay.toString() : '1',
    type: TransactionTypes.expense,
    name: '',
    amount: '',
    description: ''
  }
  const {
    dateDay,
    type,
    name,
    amount,
    description,
    formErrors,
    onInputChange,
    onInputError,
    onResetForm,
    setInputValue
  } = useForm(INITIAL_FORM)
  const [isBusy, setIsBusy] = useState(false)
  const {
    transactionsByMonth,
    transactionNameRecommendations,
    transactionNameRecommendationsFetched,
    addTransactionsMonth,
    addTransaction,
    toggleTransactionNameRecommendationsFetched,
    setTransactionNameRecommendations
  } = transactionsStore()
  const { setIsNavDisabled } = navStore()
  const [message, setMessage] = useState('')
  const [transactionsFetched, setTransactionsFetched] = useState(false)
  /* effect to enable and disable breadcrumb, and navbar whenever the isBusy state changes */
  useEffect(() => {
    handleDisableBreadcrumb(isBusy || !transactionsFetched)
    setIsNavDisabled(isBusy || !transactionsFetched)
  }, [isBusy, transactionsFetched, handleDisableBreadcrumb, setIsNavDisabled])
  /* effect to enable the breadcrumb, and navbar before unmounting this component */
  useEffect(() => {
    return () => {
      handleDisableBreadcrumb(false)
      setIsNavDisabled(false)
    }
  }, [handleDisableBreadcrumb, setIsNavDisabled])
  /* fetch transaction name recommendations from database */
  useEffect(() => {
    if (transactionNameRecommendationsFetched) return
    dbGetTransactionNameRecommendations(uid)
      .then((res) => {
        if (!res.ok || res.recommendations.length === 0) return
        setTransactionNameRecommendations(res.recommendations)
      })
      .finally(() => toggleTransactionNameRecommendationsFetched())
  }, [])
  /* fetch transactions from database */
  useEffect(() => {
    const emptyMessage = `No hay transacciones en ${month.toLowerCase()} del ${year}.`
    const key = `${year}-${month}`
    // if month is in store
    if (transactionsByMonth[key]) {
      if (transactionsByMonth[key].length === 0) setMessage(emptyMessage)
      else setMessage('')
      setTransactionsFetched(true)
      return
    }
    if (transactionsFetched) return
    setMessage('Cargando...')
    dbGetMonthTransactions(uid, year, month)
      .then((res) => {
        if (!res.ok) {
          setMessage(res?.error ?? '')
          return
        }
        if (res.transactions.length === 0) setMessage(emptyMessage)
        else setMessage('')
        addTransactionsMonth(year, month, res?.transactions)
      })
      .catch(() => {
        setMessage('Error al obtener las transacciones del mes.')
      })
      .finally(() => setTransactionsFetched(true))
  }, [
    uid,
    year,
    month,
    transactionsByMonth,
    addTransactionsMonth,
    transactionsFetched
  ])

  const createTransaction = async () => {
    setIsBusy(true)
    const newTransaction = {
      id: uuid(),
      dateDay: parseInt(dateDay, 10),
      type,
      name,
      amount: parseFloat(amount),
      description,
      payments: []
    }
    const tIdCreateTransaction = toast.loading('Creando transacción')
    try {
      const res = await dbCreateTransaction(uid, year, month, newTransaction)
      if (!res.ok) return
      toast.dismiss(tIdCreateTransaction)
      toast.success('Transacción creada con éxito')
      addTransaction(year, month, newTransaction)
      /* in case this is the first transaction of the month */
      if (message.length !== 0) setMessage('')
    } catch {
      toast.dismiss(tIdCreateTransaction)
      toast.error('Error al crear la transacción')
    }
    const nameFound = transactionNameRecommendations.find((rn) => rn === name)
    if (nameFound != null) {
      setIsBusy(false)
      onResetForm()
      return
    }
    const tIdAddTransactionNameRecommendation = toast.loading(
      'Añadiendo recomendación'
    )
    try {
      const newRecommendations = [...transactionNameRecommendations, name]
      const res = await dbAddTransactionNameRecommendations(
        uid,
        newRecommendations
      )
      if (!res.ok) return
      toast.dismiss(tIdAddTransactionNameRecommendation)
      toast.success('Recomendación añadida con éxito')
      setTransactionNameRecommendations(newRecommendations)
    } catch {
      toast.dismiss(tIdAddTransactionNameRecommendation)
      toast.error('Error al añadir la recomendación')
    } finally {
      setIsBusy(false)
      onResetForm()
    }
  }
  const validateForm = () => {
    let errors = []
    errors.push(
      onInputError(AddTransactionFields.dateDay, checkNumExact(dateDay))
    )
    errors.push(onInputError(AddTransactionFields.name, checkEmpty(name)))
    errors.push(
      onInputError(AddTransactionFields.amount, checkInexactPrice(amount))
    )
    errors.push(
      onInputError(
        AddTransactionFields.description,
        checkNumInRange(description.length, [0, 1000], true)
      )
    )
    if (errors.includes(true)) return
    createTransaction()
  }
  const handleAddTransactionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isBusy) return
    validateForm()
  }
  return (
    <section>
      <form className='grid gap-4' onSubmit={handleAddTransactionSubmit}>
        <section className='flex flex-col md:flex-row items-start gap-4'>
          <SelectField
            value={dateDay}
            handleChange={onInputChange}
            slug='dateDay'
            options={getDayOptions(month, year)}
            formErrors={formErrors}
          >
            Día de la transacción
          </SelectField>
          <SelectField
            value={type}
            handleChange={onInputChange}
            slug='type'
            options={TRANSACTION_TYPES_OPTIONS}
            formErrors={formErrors}
          >
            Tipo de transacción
          </SelectField>
          <AutoComplete
            value={name}
            handleChange={onInputChange}
            slug='name'
            formErrors={formErrors}
            autoCompleteValues={transactionNameRecommendations.map((name) => ({
              id: name,
              value: name
            }))}
            reference={transactionInputRef}
            handleAutoCompleteValueSelected={(option) => {
              setInputValue('name', option.value)
            }}
          >
            Transacción
          </AutoComplete>
          <Field
            value={amount}
            handleChange={onInputChange}
            slug='amount'
            formErrors={formErrors}
          >
            Monto de transacción
          </Field>
        </section>
        <TextareaField
          value={description}
          handleChange={onInputChange}
          slug='description'
          formErrors={formErrors}
          isRequired={false}
          rows={5}
        >
          Descripción de transacción
        </TextareaField>

        <PrimaryClickable
          className={`w-max ml-auto ${
            isBusy && 'opacity-50 pointer-events-none'
          }`}
          isDisabled={isBusy}
          type='submit'
        >
          Agregar transacción
        </PrimaryClickable>
      </form>
      {message?.length !== 0 && (
        <p className='text-center text-sm text-white/70 py-20'>{message}</p>
      )}
      {transactionsByMonth[`${year}-${month}`] != null &&
        transactionsByMonth[`${year}-${month}`]?.length !== 0 && (
          <TransactionsList
            transactions={transactionsByMonth[`${year}-${month}`]}
            uid={uid}
            year={year}
            month={month}
            setIsBusy={setIsBusy}
            registriesTotal={registriesTotal}
          />
        )}
    </section>
  )
}

type AddTransactionFormProps = {
  uid: string
  year: string
  month: string
  handleDisableBreadcrumb?: (isDisabled: boolean) => void
  registriesTotal?: number
}
