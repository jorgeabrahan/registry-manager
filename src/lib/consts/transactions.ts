import { TransactionTypes } from "../enums";

export const TRANSACTION_TYPES_OPTIONS = [
  {
    value: TransactionTypes.income,
    label: 'Ingreso'
  },
  {
    value: TransactionTypes.expense,
    label: 'Egreso'
  },
  {
    value: TransactionTypes.investment,
    label: 'Inversión'
  },
  {
    value: TransactionTypes.credit,
    label: 'Crédito'
  }
]
