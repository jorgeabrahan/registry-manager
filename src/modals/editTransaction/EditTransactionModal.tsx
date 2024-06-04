import { Field, PrimaryClickable, SelectField, TextareaField } from '@/components'
import { useForm } from '@/hooks'
import { TRANSACTION_TYPES_OPTIONS } from '@/lib/consts'
import { TransactionType } from '@/lib/types/transactions'
import { useState } from 'react'
import { ModalLayout } from '../ModalLayout'
import { calcCreditTransactionPaymentsReceived, checkEmpty, checkInexactPrice, checkNumExact, checkNumMin, getDayOptions } from '@/lib/utils'
import toast from 'react-hot-toast'
import { dbUpdateTransaction } from '@/firebase/db/transactions'
import { transactionsStore } from '@/zustand/transactionsStore'
import { TransactionTypes } from '@/lib/enums'

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  handleHideModal = () => {},
  transaction,
  uid,
  year,
  month
}) => {
  const [isBusy, setIsBusy] = useState(false)
  const { updateTransaction } = transactionsStore()
  const {
    dateDay,
    type,
    name,
    amount,
    description,
    formErrors,
    onInputChange,
    onInputError,
    onResetForm
  } = useForm({
    dateDay: transaction.dateDay.toString(),
    type: transaction.type,
    name: transaction.name,
    amount: transaction.amount.toString(),
    description: transaction.description
  })
  const performSubmitAction = () => {
    setIsBusy(true)
    const tIdUpdateTransaction = toast.loading('Actualizando transacción')
    const updatedTransaction = {
      id: transaction.id,
      dateDay: parseInt(dateDay, 10),
      type,
      name,
      amount: parseFloat(amount),
      description,
      payments: transaction.payments
    }
    dbUpdateTransaction(uid, year, month, updatedTransaction)
      .then((res) => {
        if (!res.ok) return
        toast.dismiss(tIdUpdateTransaction)
        toast.success('Transacción actualizada con éxito.')
        updateTransaction(year, month, updatedTransaction)
        onResetForm()
        handleHideModal()
      })
      .catch(() => {
        toast.dismiss(tIdUpdateTransaction)
        toast.error('Error al actualizar la transacción.')
      })
      .finally(() => setIsBusy(false))
  }
  const isActuallyUpdated = () => {
    return (
      transaction.dateDay !== parseInt(dateDay, 10) ||
      transaction.type !== type ||
      transaction.name !== name ||
      transaction.amount !== parseFloat(amount) ||
      transaction.description !== description
    )
  }
  const validateForm = () => {
    let errors = []
    errors.push(onInputError('dateDay', checkNumExact(dateDay)))
    errors.push(onInputError('name', checkEmpty(name)))
    errors.push(onInputError('amount', checkInexactPrice(amount)))
    const paymentsReceived = calcCreditTransactionPaymentsReceived(transaction)
    errors.push(onInputError('amount', checkNumMin(amount, paymentsReceived)))
    if (errors.includes(true)) return
    if (!isActuallyUpdated()) {
      toast.error('Ningún campo ha sido cambiado!')
      return
    }
    performSubmitAction()
  }
  const handleUpdateTransactionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isBusy) return
    validateForm()
  }
  return (
    <ModalLayout
      className='max-h-[400px] lg:max-h-full overflow-y-auto'
      handleHideModal={handleHideModal}
      shouldAllowClose={!isBusy}
    >
      <form className='grid gap-4' onSubmit={handleUpdateTransactionSubmit}>
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
          isDisabled={transaction.type === TransactionTypes.credit}
        >
          Tipo de transacción
        </SelectField>
        <Field value={name} handleChange={onInputChange} slug='name' formErrors={formErrors}>
          Transacción
        </Field>

        <Field value={amount} handleChange={onInputChange} slug='amount' formErrors={formErrors}>
          Monto de transacción
        </Field>
        <TextareaField
          value={description}
          handleChange={onInputChange}
          slug='description'
          formErrors={formErrors}
          isRequired={false}
        >
          Descripción de transacción
        </TextareaField>
        <PrimaryClickable
          className={`w-max ml-auto ${isBusy && 'opacity-50 pointer-events-none'}`}
          isDisabled={isBusy}
          type='submit'
        >
          Actualizar transacción
        </PrimaryClickable>
      </form>
    </ModalLayout>
  )
}

type EditTransactionModalProps = {
  handleHideModal?: () => void
  transaction: TransactionType
  uid: string
  year: string
  month: string
}
