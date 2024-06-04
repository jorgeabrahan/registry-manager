import { Tabs } from '@/components'
import { MonthViewTabs } from '@/lib/enums'
import { CurrentRegistryType } from '@/lib/types/registries'
import React, { useState } from 'react'
import { RegistriesTab, StatsTab } from './tabs'
import { navStore } from '@/zustand'

export const MonthView: React.FC<MonthViewProps> = ({
  uid = '',
  year = '',
  month = '',
  handleNewRegistry = () => {},
  handleEditRegistry = () => {},
  handleDisableBreadcrumb = () => {}
}) => {
  const { isNavDisabled } = navStore()
  const [activeTab, setActiveTab] = useState(MonthViewTabs.registries)
  return (
    <>
      <Tabs<typeof MonthViewTabs>
        className='my-4 ml-auto'
        tabs={MonthViewTabs}
        activeTab={activeTab}
        handleClick={(key) => setActiveTab(MonthViewTabs[key])}
        isDisabled={isNavDisabled}
      />
      {activeTab === MonthViewTabs.registries && (
        <RegistriesTab
          uid={uid}
          year={year}
          month={month}
          handleNewRegistry={handleNewRegistry}
          handleEditRegistry={handleEditRegistry}
          handleDisableBreadcrumb={handleDisableBreadcrumb}
        />
      )}
      {activeTab === MonthViewTabs.stats && (
        <StatsTab
          uid={uid}
          year={year}
          month={month}
          handleDisableBreadcrumb={handleDisableBreadcrumb}
        />
      )}
    </>
  )
}

type MonthViewProps = {
  uid?: string
  year?: string
  month?: string
  handleNewRegistry?: (registryId: string) => void
  handleEditRegistry?: (registry: CurrentRegistryType) => void
  handleDisableBreadcrumb?: (isDisabled: boolean) => void
}
