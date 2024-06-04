import { Tabs } from '@/components'
import { LicensesModalTabs } from '@/lib/enums'
import { useState } from 'react'
import { ModalLayout } from '../ModalLayout'
import { CreateTab, ListTab, RemoveTab, RenewTab } from './tabs'

export const LicensesModal = ({ handleHideModal = () => {} }) => {
  const [activeTab, setActiveTab] = useState(LicensesModalTabs.create)
  return (
    <ModalLayout className='relative h-[400px]' handleHideModal={handleHideModal}>
      <Tabs
        className='absolute top-0 left-0 -translate-y-[calc(100%+1rem)]'
        tabs={LicensesModalTabs}
        activeTab={activeTab}
        handleClick={(key) => setActiveTab(LicensesModalTabs[key])}
      />
      {LicensesModalTabs.create === activeTab && <CreateTab />}
      {LicensesModalTabs.remove === activeTab && <RemoveTab />}
      {LicensesModalTabs.renew === activeTab && <RenewTab />}
      {LicensesModalTabs.list === activeTab && <ListTab />}
    </ModalLayout>
  )
}

