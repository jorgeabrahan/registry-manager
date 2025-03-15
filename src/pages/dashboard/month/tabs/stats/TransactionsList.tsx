import { TransactionType } from '@/lib/types/transactions'
import { Transaction } from './Transaction'
import { Tabs } from '@/components'
import { TransactionTabs, TransactionTypes } from '@/lib/enums'
import { useEffect, useMemo, useState } from 'react'
import { calcTransactionsTotal, formatHNL } from '@/lib/utils'
import { dbRemoveTransaction } from '@/firebase/db/transactions'
import { transactionsStore } from '@/zustand/transactionsStore'
import { EditTransactionModal } from '@/modals/editTransaction'
import { MonthBalance } from './MonthBalance'
import { AddPaymentToTransactionModal } from '@/modals/addPaymentsToTransaction/AddPaymentToTransactionModal'
import { toast } from 'sonner'

const transactionTypeBasedOnTab = {
  [TransactionTabs.income]: TransactionTypes.income,
  [TransactionTabs.expense]: TransactionTypes.expense,
  [TransactionTabs.investment]: TransactionTypes.investment,
  [TransactionTabs.credit]: TransactionTypes.credit
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  uid,
  year,
  month,
  transactions = [],
  setIsBusy,
  registriesTotal = 0
}) => {
  const [activeTab, setActiveTab] = useState<TransactionTabs>(
    TransactionTabs.all
  )
  const [tabTransactions, setTabTransactions] =
    useState<TransactionType[]>(transactions)
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionType | null>(null)
  const [transactionToAddPayments, setTransactionToAddPayments] =
    useState<TransactionType | null>(null)
  const { removeTransaction } = transactionsStore()
  useEffect(() => {
    if (activeTab === TransactionTabs.all) {
      setTabTransactions(transactions)
      return
    }
    setTabTransactions(
      transactions.filter(
        (transaction) =>
          transaction.type === transactionTypeBasedOnTab[activeTab]
      )
    )
  }, [transactions, activeTab])
  const onRemoveTransaction = (transaction: TransactionType) => {
    setIsBusy(true)
    const tIdRemoveTransaction = toast.loading('Eliminando transacción')
    dbRemoveTransaction(uid, year, month, transaction.id)
      .then((res) => {
        if (!res.ok) return
        toast.dismiss(tIdRemoveTransaction)
        toast.success('Transacción eliminada con éxito.')
        /* remove transaction from store */
        removeTransaction(year, month, transaction.id)
      })
      .catch(() => {
        toast.dismiss(tIdRemoveTransaction)
        toast.error('Error al eliminar la transacción.')
      })
      .finally(() => {
        setIsBusy(false)
      })
  }
  const onEditTransaction = (transaction: TransactionType) => {
    setTransactionToEdit(transaction)
  }
  const onAddPaymentTransaction = (transaction: TransactionType) => {
    setTransactionToAddPayments(transaction)
  }
  const transactionsTotal = useMemo(() => {
    return calcTransactionsTotal(transactions)
  }, [transactions, TransactionTypes.income])
  return (
    <div className='my-4'>
      <Tabs<typeof TransactionTabs>
        tabs={TransactionTabs}
        activeTab={activeTab}
        handleClick={(key) => {
          setActiveTab(TransactionTabs[key])
        }}
      />
      {tabTransactions.length === 0 && (
        <p className='text-center text-sm text-white/70 py-20'>
          No hay {activeTab.toLowerCase()}.
        </p>
      )}
      {tabTransactions.length !== 0 && (
        <section className='mb-4'>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] my-4 gap-4'>
            {tabTransactions.map((transaction) => (
              <Transaction
                key={transaction.id}
                transaction={transaction}
                year={year}
                month={month}
                onRemoveTransaction={() => onRemoveTransaction(transaction)}
                onEditTransaction={() => onEditTransaction(transaction)}
                onAddPaymentTransaction={() =>
                  onAddPaymentTransaction(transaction)
                }
              />
            ))}
          </div>
          <div>
            <p className='text-dove-gray-300 leading-3 text-right font-light text-sm'>
              Total{' '}
              {activeTab != TransactionTabs.all
                ? activeTab.toLowerCase()
                : 'transacciones'}
            </p>{' '}
            <p className='text-2xl font-mono text-right font-semibold'>
              {formatHNL(calcTransactionsTotal(tabTransactions))}
            </p>
          </div>
        </section>
      )}
      <MonthBalance
        registriesTotal={registriesTotal}
        transactionsTotal={transactionsTotal}
        monthBalance={registriesTotal + transactionsTotal}
        month={month}
        year={year}
      />
      {transactionToEdit != null && (
        <EditTransactionModal
          handleHideModal={() => {
            setTransactionToEdit(null)
            setActiveTab(TransactionTabs.all)
          }}
          transaction={transactionToEdit}
          uid={uid}
          year={year}
          month={month}
        />
      )}
      {transactionToAddPayments != null && (
        <AddPaymentToTransactionModal
          handleHideModal={() => {
            setTransactionToAddPayments(null)
          }}
          transaction={transactionToAddPayments}
          uid={uid}
          year={year}
          month={month}
        />
      )}
    </div>
  )
}

type TransactionsListProps = {
  uid: string
  year: string
  month: string
  transactions: TransactionType[]
  setIsBusy: (isBusy: boolean) => void
  registriesTotal?: number
}
