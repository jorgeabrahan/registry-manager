import { ListSelectIcon } from '@/assets/icons'
import { MiniSecondaryClickable, SecondaryClickable } from '@/components'
import { TransactionPaymentType, TransactionType } from '@/lib/types/transactions'
import { formatDateFriendly, formatHNL } from '@/lib/utils'
import { selectedPaymentsStore } from './selectedPaymentsStore'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useConfirmModal } from '@/hooks'
import { dbUpdateTransaction } from '@/firebase/db/transactions'
import { transactionsStore } from '@/zustand/transactionsStore'

const ListPayment: React.FC<ListPaymentProps> = ({
  payment,
  isBusy,
  isSelected,
  removeSelectedPayment,
  addSelectedPayment
}) => {
  return (
    <li
      key={payment.id}
      className={`flex items-center justify-between border border-solid rounded-lg p-4 ${
        isSelected ? 'border-tundora-300' : 'border-tundora-800'
      }`}
    >
      <div>
        <p className='text-sm md:text-base text-dove-gray-200'>
          {formatDateFriendly(payment.date)}
        </p>
        <p className='font-mono md:text-xl'>{formatHNL(payment.amount)}</p>
      </div>
      <MiniSecondaryClickable
        handleClick={() => {
          if (isSelected) {
            removeSelectedPayment(payment.id)
            return
          }
          addSelectedPayment(payment.id)
        }}
        isDisabled={isBusy}
      >
        <ListSelectIcon size='15px' />
        {isSelected ? 'Quitar selección' : 'Seleccionar'}
      </MiniSecondaryClickable>
    </li>
  )
}

export const ListPaymentsTab: React.FC<ListPaymentsTabProps> = ({
  transaction,
  setLocalTransaction,
  uid,
  year,
  month,
  isBusy,
  setIsBusy
}) => {
  const { selectedPayments, addSelectedPayment, removeSelectedPayment, clearSelectedPayments } =
    selectedPaymentsStore()
  const { updateTransaction } = transactionsStore()
  const { showConfirmModal } = useConfirmModal()
  useEffect(() => {
    return () => {
      clearSelectedPayments()
    }
  }, [])
  const handleRemoveSelectedPayments = () => {
    showConfirmModal({
      message: `Seguro que desea eliminar ${selectedPayments.length} pago${
        selectedPayments.length === 1 ? '' : 's'
      }?`,
      onConfirm: () => {
        const newTransaction = {
          ...transaction,
          payments: transaction.payments?.filter((payment) => !selectedPayments.includes(payment.id))
        }
        const tIdUpdatingTransaction = toast.loading('Actualizando transacción')
        const updatingError = 'Error al actualizar la transacción'
        setIsBusy(true)
        dbUpdateTransaction(uid, year, month, newTransaction).then((res) => {
          if (!res.ok) {
            toast.dismiss(tIdUpdatingTransaction)
            toast.error(updatingError)
            return
          }
          toast.dismiss(tIdUpdatingTransaction)
          toast.success('Pagos eliminados correctamente')
          updateTransaction(year, month, newTransaction)
          setLocalTransaction(newTransaction)
          clearSelectedPayments()
        }).catch(() => {
          toast.dismiss(tIdUpdatingTransaction)
          toast.error(updatingError)
        }).finally(() => {
          setIsBusy(false)
        })
      }
    })
  }
  return (
    <section className='h-full flex flex-col'>
      {transaction.payments?.length === 0 && (
        <div className='h-full flex items-center justify-center'>
          <p className='text-dove-gray-300'>Aun no hay pagos registrados.</p>
        </div>
      )}
      <ul className='grid gap-3 overflow-y-auto h-[calc(100%-50px)]'>
        {transaction.payments?.map((payment) => (
          <ListPayment
            key={payment.id}
            payment={payment}
            isBusy={isBusy}
            addSelectedPayment={addSelectedPayment}
            removeSelectedPayment={removeSelectedPayment}
            isSelected={selectedPayments.includes(payment.id)}
          />
        ))}
      </ul>
      <footer className='mt-auto flex overflow-x-auto hide-scrollbar lg:justify-end gap-3'>
        <SecondaryClickable
          isDisabled={selectedPayments.length === 0}
          handleClick={clearSelectedPayments}
        >
          <span className='text-nowrap text-sm pointer-events-none'>Deseleccionar todo</span>
        </SecondaryClickable>
        <SecondaryClickable
          isDisabled={selectedPayments.length === 0}
          handleClick={handleRemoveSelectedPayments}
        >
          <span className='text-nowrap text-sm'>Eliminar seleccionados</span>
        </SecondaryClickable>
      </footer>
    </section>
  )
}

type ListPaymentProps = {
  payment: TransactionPaymentType
  isBusy: boolean
  isSelected: boolean
  removeSelectedPayment: (paymentId: string) => void
  addSelectedPayment: (paymentId: string) => void
}

type ListPaymentsTabProps = {
  transaction: TransactionType
  setLocalTransaction: (transaction: TransactionType) => void
  uid: string
  year: string
  month: string
  isBusy: boolean
  setIsBusy: (isBusy: boolean) => void
}
