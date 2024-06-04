import { TransactionTypes } from "@/lib/enums"

export type TransactionPaymentType = {
  id: string,
  date: string,
  amount: number,
}

export type TransactionType = {
  id: string,
  dateDay: number,
  type: TransactionTypes,
  name: string,
  amount: number,
  description: string,
  payments: TransactionPaymentType[]
}
