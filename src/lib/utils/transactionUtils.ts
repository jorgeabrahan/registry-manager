import { MONTHS } from "@/pages/dashboard/constants";
import { TransactionType } from "../types/transactions";
import { TransactionTypes } from "../enums";

export const calcDaysInMonth = (month: string, year: string) => {
  const monthIndex = MONTHS.findIndex((m) => m === month)
  return new Date(Number(year), monthIndex + 1, 0).getDate();
}
export const getDayOptions = (month: string, year: string) => {
  return Array.from({ length: calcDaysInMonth(month, year) }, (_, i) => {
    const day = (i + 1).toString();
    return { value: day, label: day };
  })
}
export const calcCreditTransactionPaymentsReceived = (transaction: TransactionType) => {
  return transaction?.payments?.reduce((acc, payment) => {
    return acc + payment.amount
  }, 0) ?? 0
}
export const calcTransactionsTotal = (transactions: TransactionType[]) => {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === TransactionTypes.income) return acc + transaction.amount
    if (transaction.type === TransactionTypes.credit) {
      return acc + calcCreditTransactionPaymentsReceived(transaction) 
    }
    return acc - transaction.amount
  }, 0)
}
