import { EditPencilIcon, PlusCircleIcon, TrashIcon } from '@/assets/icons'
import { SecondaryClickable } from '@/components'
import { useConfirmModal } from '@/hooks'
import { TRANSACTION_TYPES_OPTIONS } from '@/lib/consts'
import { TransactionTypes } from '@/lib/enums'
import { TransactionType } from '@/lib/types/transactions'
import { calcCreditTransactionPaymentsReceived, formatDate, formatHNL } from '@/lib/utils'
import { MONTHS } from '@/pages/dashboard/constants'
import { useMemo } from 'react'

export const Transaction: React.FC<TransactionProps> = ({
  transaction,
  year,
  month,
  onRemoveTransaction,
  onEditTransaction,
  onAddPaymentTransaction
}) => {
  const formattedDate = useMemo(() => {
    const monthIndex = MONTHS.findIndex((m) => m === month)
    const transactionDate = new Date(parseInt(year, 10), monthIndex, transaction.dateDay)
    return formatDate(transactionDate.toISOString())
  }, [month, year, transaction.dateDay])
  const { showConfirmModal } = useConfirmModal()
  const handleRemoveTransaction = () => {
    showConfirmModal({
      message: `Eliminar ${TRANSACTION_TYPES_OPTIONS.find(
        (option) => option.value === transaction.type
      )?.label?.toLowerCase()} <strong>${transaction.name}</strong> con un monto de ${formatHNL(
        transaction.amount
      )}`,
      onConfirm: () => {
        onRemoveTransaction()
      }
    })
  }
  const paymentsReceived = useMemo(() => {
    if (transaction.type !== TransactionTypes.credit) return 0
    return calcCreditTransactionPaymentsReceived(transaction)
  }, [transaction.type, transaction.payments])
  // credit is also considered as income since it is a type of income
  // the only difference is that it will be received in installments
  const isIncome =
    transaction.type === TransactionTypes.income || transaction.type === TransactionTypes.credit
  // default type color is for expense transactions
  let typeColor = 'border-wewak-600 bg-wewak-800/50'
  if (isIncome) {
    typeColor = 'border-mantis-600 bg-mantis-800/50'
  }
  if (transaction.type === TransactionTypes.investment) {
    typeColor = 'border-orange-600 bg-orange-800/50'
  }
  return (
    <article className='flex flex-col border border-solid border-tundora-800 rounded-xl p-3 bg-tundora-950 min-h-[180px]'>
      <header className='flex items-center justify-between gap-2 mb-2'>
        <div className='flex items-center gap-2'>
          <SecondaryClickable
            handleClick={onEditTransaction}
            className='text-sm px-3 py-2'
            removePadding
          >
            <EditPencilIcon size='15px' />
          </SecondaryClickable>
          <SecondaryClickable
            handleClick={handleRemoveTransaction}
            className='text-sm px-3 py-2'
            removePadding
          >
            <TrashIcon size='15px' />
          </SecondaryClickable>
          {transaction.type === TransactionTypes.credit && (
            <SecondaryClickable
              handleClick={onAddPaymentTransaction}
              className='text-sm px-3 py-2'
              removePadding
            >
              <PlusCircleIcon size='15px' />
            </SecondaryClickable>
          )}
        </div>
        <span
          className={`block w-[90px] text-center px-3 py-[2px] text-sm border border-solid rounded-xl font-bold ${typeColor}`}
        >
          {TRANSACTION_TYPES_OPTIONS.find((option) => option.value === transaction.type)?.label}
        </span>
      </header>
      <h3 className='text-lg font-semibold'>{transaction.name}</h3>
      {transaction.description?.length !== 0 && (
        <p className='text-dove-gray-300 text-sm mb-2 truncate-2'>{transaction.description}</p>
      )}
      <footer className='mt-auto font-mono'>
        {transaction.type === TransactionTypes.credit && (
          <>
            <p className='text-sm'>
              <span className='text-dove-gray-200 text-xs font-semibold'>Recibido:</span>{' '}
              <span>{formatHNL(paymentsReceived)}</span>
            </p>
            <p className='text-sm'>
              <span className='text-dove-gray-200 text-xs font-semibold'>Faltante:</span>{' '}
              <span>{formatHNL(transaction.amount - paymentsReceived)}</span>
            </p>
          </>
        )}
        <section className='flex items-baseline justify-between gap-2'>
          <p className='text-lg text-dove-gray-100'>{formattedDate}</p>
          <p className='text-2xl'>
            {formatHNL(isIncome ? transaction.amount : -transaction.amount)}
          </p>
        </section>
      </footer>
    </article>
  )
}

type TransactionProps = {
  transaction: TransactionType
  year: string
  month: string
  onRemoveTransaction: () => void
  onEditTransaction: () => void
  onAddPaymentTransaction: () => void
}
