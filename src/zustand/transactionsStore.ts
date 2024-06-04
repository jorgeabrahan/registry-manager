import { TransactionType } from '@/lib/types/transactions/transaction.type'
import { create } from 'zustand'

const transactionsStore = create<TransactionsStore>((set) => ({
  transactionsByMonth: {},
  transactionNameRecommendations: [],
  transactionNameRecommendationsFetched: false,
  toggleTransactionNameRecommendationsFetched: () =>
    set((state) => ({
      ...state,
      transactionNameRecommendationsFetched: !state.transactionNameRecommendationsFetched
    })),
  setTransactionNameRecommendations: (transactionNameRecommendations) =>
    set((state) => ({
      ...state,
      transactionNameRecommendations
    })),
  addTransactionNameRecommendation: (transactionNameRecommendation) =>
    set((state) => ({
      ...state,
      transactionNameRecommendations: [
        ...state.transactionNameRecommendations,
        transactionNameRecommendation
      ]
    })),
  addTransactionsMonth: (year, month, transactions) =>
    set((state) => ({
      ...state,
      transactionsByMonth: { ...state.transactionsByMonth, [`${year}-${month}`]: transactions }
    })),
  addTransaction: (year, month, transaction) =>
    set((state) => {
      const currentMonthTransactions = state.transactionsByMonth[`${year}-${month}`] ?? []
      return {
        ...state,
        transactionsByMonth: {
          ...state.transactionsByMonth,
          [`${year}-${month}`]: [transaction, ...currentMonthTransactions]
        }
      }
    }),
  updateTransaction: (year, month, updatedTransaction) =>
    set((state) => ({
      ...state,
      transactionsByMonth: {
        ...state.transactionsByMonth,
        [`${year}-${month}`]: state.transactionsByMonth[`${year}-${month}`]?.map((trans) => {
          if (trans.id === updatedTransaction.id) {
            return updatedTransaction
          }
          return trans
        })
      }
    })),
  removeTransaction: (year, month, transactionId) =>
    set((state) => ({
      ...state,
      transactionsByMonth: {
        ...state.transactionsByMonth,
        [`${year}-${month}`]: state.transactionsByMonth[`${year}-${month}`]?.filter(
          (trans) => trans.id !== transactionId
        )
      }
    })),
  removeTransactionsMonth: (year, month) =>
    set((state) => {
      const stateTransactionsByMonth = { ...state.transactionsByMonth }
      delete stateTransactionsByMonth[`${year}-${month}`]
      return { ...state, transactionsByMonth: stateTransactionsByMonth }
    })
}))

type TransactionsByMonth = {
  [key: string]: TransactionType[]
}
type TransactionsStore = {
  transactionsByMonth: TransactionsByMonth
  transactionNameRecommendations: string[]
  transactionNameRecommendationsFetched: boolean
  toggleTransactionNameRecommendationsFetched: () => void
  setTransactionNameRecommendations: (transactionNameRecommendations: string[]) => void
  addTransactionNameRecommendation: (transactionNameRecommendation: string) => void
  addTransactionsMonth: (year: string, month: string, transactions: TransactionType[]) => void
  addTransaction: (year: string, month: string, transaction: TransactionType) => void
  updateTransaction: (year: string, month: string, updatedTransaction: TransactionType) => void
  removeTransaction: (year: string, month: string, transactionId: string) => void
  removeTransactionsMonth: (year: string, month: string) => void
}

export { transactionsStore }
