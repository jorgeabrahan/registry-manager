import { DateField, Field, PrimaryClickable } from '@/components'
import { dbUpdateTransaction } from '@/firebase/db/transactions'
import { useForm } from '@/hooks'
import { TransactionType } from '@/lib/types/transactions'
import {
  calcCreditTransactionPaymentsReceived,
  checkDate,
  checkInexactPrice,
  checkNumMax,
  formatInputDate
} from '@/lib/utils'
import { transactionsStore } from '@/zustand/transactionsStore'
import { toast } from 'sonner'

const INITIAL_FORM = {
  amount: '',
  date: formatInputDate(new Date().toISOString())
}
export const AddPaymentTab: React.FC<AddPaymentTabProps> = ({
  transaction,
  uid,
  year,
  month,
  isBusy,
  setIsBusy = () => {},
  showListPaymentsTab = () => {},
  setLocalTransaction = () => {}
}) => {
  const { amount, date, formErrors, onInputChange, onInputError, onResetForm } =
    useForm(INITIAL_FORM)
  const { updateTransaction } = transactionsStore()
  const addPayment = () => {
    setIsBusy(true)
    const previousPayments = transaction.payments ?? []
    const newPayment = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      date: new Date(date + 'T00:00:00Z').toISOString()
    }
    const newTransaction = {
      ...transaction,
      payments: [...previousPayments, newPayment]
    }
    const tIdUpdatingTransaction = toast.loading('Actualizando transacción')
    const updatingError = 'Error al actualizar la transacción'
    dbUpdateTransaction(uid, year, month, newTransaction)
      .then((res) => {
        if (!res.ok) {
          toast.dismiss(tIdUpdatingTransaction)
          toast.error(updatingError)
          return
        }
        toast.dismiss(tIdUpdatingTransaction)
        toast.success('Transacción actualizada correctamente')
        updateTransaction(year, month, newTransaction)
        onResetForm()
        setLocalTransaction(newTransaction)
        showListPaymentsTab()
      })
      .catch(() => {
        toast.dismiss(tIdUpdatingTransaction)
        toast.error(updatingError)
      })
      .finally(() => {
        setIsBusy(false)
      })
  }
  const validateForm = () => {
    const errors = []
    const paymentsReceived = calcCreditTransactionPaymentsReceived(transaction)
    errors.push(onInputError('amount', checkInexactPrice(amount)))
    errors.push(
      onInputError(
        'amount',
        checkNumMax(amount, transaction.amount - paymentsReceived)
      )
    )
    errors.push(onInputError('date', checkDate(date)))
    if (errors.includes(true)) return
    addPayment()
  }
  const handleAddPaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateForm()
  }
  return (
    <section className='h-full'>
      <form
        className='flex flex-col gap-4 h-full'
        onSubmit={handleAddPaymentSubmit}
      >
        <DateField
          value={date}
          handleChange={onInputChange}
          slug='date'
          formErrors={formErrors}
        >
          Fecha de pago
        </DateField>
        <Field
          value={amount}
          handleChange={onInputChange}
          slug='amount'
          formErrors={formErrors}
        >
          Monto de pago
        </Field>
        <PrimaryClickable className='mt-auto' type='submit' isDisabled={isBusy}>
          Agregar pago
        </PrimaryClickable>
      </form>
    </section>
  )
}

type AddPaymentTabProps = {
  transaction: TransactionType
  uid: string
  year: string
  month: string
  isBusy: boolean
  setIsBusy: (isBusy: boolean) => void
  showListPaymentsTab: () => void
  setLocalTransaction: (transaction: TransactionType) => void
}
