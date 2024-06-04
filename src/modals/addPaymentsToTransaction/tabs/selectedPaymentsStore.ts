import { create } from 'zustand'

const selectedPaymentsStore = create<SelectedPaymentsStore>((set) => ({
  selectedPayments: [],
  addSelectedPayment: (paymentId) =>
    set((state) => ({ ...state, selectedPayments: [...state.selectedPayments, paymentId] })),
  removeSelectedPayment: (paymentId) =>
    set((state) => ({
      ...state,
      selectedPayments: state.selectedPayments.filter((id) => id !== paymentId)
    })),
  clearSelectedPayments: () =>
    set((state) => ({
      ...state,
      selectedPayments: []
    }))
}))

type SelectedPaymentsStore = {
  selectedPayments: string[]
  addSelectedPayment: (payment: string) => void
  removeSelectedPayment: (payment: string) => void
  clearSelectedPayments: () => void
}

export { selectedPaymentsStore }
