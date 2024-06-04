import { useMemo, useState } from 'react'
import { ModalLayout } from '../ModalLayout'
import { Tabs } from '@/components'
import { AddPaymentToTransactionModalTabs } from '@/lib/enums'
import { TransactionType } from '@/lib/types/transactions'
import { calcCreditTransactionPaymentsReceived } from '@/lib/utils'
import { AddPaymentTab, ListPaymentsTab } from './tabs'

export const AddPaymentToTransactionModal: React.FC<AddPaymentToTransactionModalProps> = ({
  handleHideModal = () => {},
  initialTab = AddPaymentToTransactionModalTabs.list,
  transaction,
  uid,
  year,
  month
}) => {
  const [activeTab, setActiveTab] = useState<AddPaymentToTransactionModalTabs>(initialTab)
  const [isBusy, setIsBusy] = useState(false)
  const [localTransaction, setLocalTransaction] = useState<TransactionType>({
    ...transaction,
    payments: transaction.payments ?? []
  })
  const showListPaymentsTab = () => {
    setActiveTab(AddPaymentToTransactionModalTabs.list)
  }
  const missingPayment = useMemo(() => {
    return transaction.amount - calcCreditTransactionPaymentsReceived(transaction)
  }, [transaction])
  return (
    <ModalLayout
      className='h-[400px] lg:max-h-full relative'
      handleHideModal={handleHideModal}
      shouldAllowClose={!isBusy}
    >
      <Tabs<typeof AddPaymentToTransactionModalTabs>
        className='absolute top-0 left-0 -translate-y-[calc(100%+1rem)]'
        tabs={AddPaymentToTransactionModalTabs}
        activeTab={activeTab}
        handleClick={(key) => setActiveTab(AddPaymentToTransactionModalTabs[key])}
        isDisabled={isBusy}
        disabledTabs={missingPayment > 0 ? [] : [AddPaymentToTransactionModalTabs.add]}
      />
      {AddPaymentToTransactionModalTabs.list === activeTab && (
        <ListPaymentsTab
          transaction={localTransaction}
          setLocalTransaction={setLocalTransaction}
          uid={uid}
          year={year}
          month={month}
          isBusy={isBusy}
          setIsBusy={setIsBusy}
        />
      )}
      {AddPaymentToTransactionModalTabs.add === activeTab && (
        <AddPaymentTab
          transaction={localTransaction}
          uid={uid}
          year={year}
          month={month}
          isBusy={isBusy}
          setIsBusy={setIsBusy}
          showListPaymentsTab={showListPaymentsTab}
          setLocalTransaction={setLocalTransaction}
        />
      )}
    </ModalLayout>
  )
}

type AddPaymentToTransactionModalProps = {
  handleHideModal?: () => void
  initialTab?: AddPaymentToTransactionModalTabs
  transaction: TransactionType
  uid: string
  year: string
  month: string
}
