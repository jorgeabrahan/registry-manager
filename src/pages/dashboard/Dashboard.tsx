import { Breadcrumb, LayoutWrapper, Navbar } from '@/components'
import { dbGetYearsWithRegistries } from '@/firebase/db/registries'
import { useBreadcrumb } from '@/hooks'
import { DashboardBreadcrumbItems } from '@/lib/enums'
import { CurrentRegistryType } from '@/lib/types/registries'
import { activeUserStore, registriesStore } from '@/zustand'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { YearSelectorView } from './YearSelectorView'
import { MONTHS } from './constants'
import { MonthView } from './month/MonthView'
import { RegistryView, currentRegistryStore } from './registry'
import { MonthSelectorView } from './MonthSelectorView'

const now = new Date()
export const Dashboard = () => {
  const [isYearsLoaded, setIsYearsLoaded] = useState(false)
  const { activeUser } = activeUserStore()
  const storeRegistries = registriesStore()
  const storeCurrentRegistry = currentRegistryStore()
  const { breadcrumb, setBreadcrumb, setItem, getItem, isCompleteTil, isPathComplete } =
    useBreadcrumb<DashboardBreadcrumbItems>([
      { id: DashboardBreadcrumbItems.displayName, value: activeUser?.displayName ?? '' },
      { id: DashboardBreadcrumbItems.year, value: `${now.getFullYear()}` },
      { id: DashboardBreadcrumbItems.month, value: MONTHS[now.getMonth()] },
      { id: DashboardBreadcrumbItems.registry, value: '' }
    ])
  const [isBreadcrumbDisabled, setIsBreadcrumbDisabled] = useState(false)
  useEffect(() => {
    if (isYearsLoaded) return
    dbGetYearsWithRegistries(activeUser?.uid ?? '').then((res): void => {
      if (!res.ok) {
        toast.error(res?.error ?? '')
        return
      }
      storeRegistries?.setYears(res.years)
      setIsYearsLoaded(true)
    })
  }, [activeUser?.uid, storeRegistries, isYearsLoaded])
  const handleNewRegistry = (registryId = '') => {
    const year = Number(getItem(DashboardBreadcrumbItems.year))
    const month = MONTHS.findIndex((month) => month === getItem(DashboardBreadcrumbItems.month))
    const now = new Date()
    const day = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : 1
    const registryInProgress = localStorage.getItem('registry-in-progress')
    const registry = {
      id: registryId,
      isEditing: false,
      date: new Date(year, month, day).toISOString(),
      clients: [],
      history: []
    }
    if (registryInProgress != null) {
      const parsedRegistryInProgress = JSON.parse(registryInProgress)
      registry.id = parsedRegistryInProgress.id
      registry.date = parsedRegistryInProgress.date
      registry.clients = parsedRegistryInProgress.clients
      registry.history = parsedRegistryInProgress.history
    }
    storeCurrentRegistry.setRegistry(registry)
    setItem(DashboardBreadcrumbItems.registry, registryId)
  }
  const handleEditRegistry = (registry: CurrentRegistryType) => {
    storeCurrentRegistry.setRegistry(registry)
    setItem(DashboardBreadcrumbItems.registry, registry.id)
  }
  const handleClearRegistry = () => {
    storeCurrentRegistry.setInitialRegistry()
    setItem(DashboardBreadcrumbItems.registry, '')
  }
  const handleDisableBreadcrumb = (isDisabled: boolean) => {
    setIsBreadcrumbDisabled(isDisabled)
  }
  return (
    <>
      <Navbar />
      <LayoutWrapper as='section'>
        <Breadcrumb<DashboardBreadcrumbItems>
          className='mb-3'
          items={breadcrumb}
          handleClick={(_, newItems) => {
            setBreadcrumb(newItems)
          }}
          isInteractionDisabled={isBreadcrumbDisabled}
        />
        {isCompleteTil(DashboardBreadcrumbItems.year) && (
          <YearSelectorView
            uid={activeUser?.uid}
            years={storeRegistries?.years}
            handleYearSelect={(year) => setItem(DashboardBreadcrumbItems.year, year)}
            handleDisableBreadcrumb={handleDisableBreadcrumb}
          />
        )}
        {isCompleteTil(DashboardBreadcrumbItems.month) && (
          <MonthSelectorView
            uid={activeUser?.uid}
            year={getItem(DashboardBreadcrumbItems.year)}
            months={MONTHS}
            handleMonthSelect={(month) => setItem(DashboardBreadcrumbItems.month, month)}
            handleDisableBreadcrumb={handleDisableBreadcrumb}
          />
        )}
        {isCompleteTil(DashboardBreadcrumbItems.registry) && (
          <MonthView
            uid={activeUser?.uid}
            month={getItem(DashboardBreadcrumbItems.month)}
            year={getItem(DashboardBreadcrumbItems.year)}
            handleNewRegistry={handleNewRegistry}
            handleEditRegistry={handleEditRegistry}
            handleDisableBreadcrumb={handleDisableBreadcrumb}
          />
        )}
        {isPathComplete() && (
          <RegistryView
            month={getItem(DashboardBreadcrumbItems.month)}
            year={getItem(DashboardBreadcrumbItems.year)}
            handleUpdateBreadcrumbDate={(year, month) => {
              const monthNumber = parseInt(month, 10)
              if (isNaN(monthNumber)) return
              if (year.toString() !== getItem(DashboardBreadcrumbItems.year))
                setItem(DashboardBreadcrumbItems.year, `${year}`)
              if (MONTHS[monthNumber] !== getItem(DashboardBreadcrumbItems.month))
                setItem(DashboardBreadcrumbItems.month, MONTHS[monthNumber])
            }}
            handleClearRegistry={handleClearRegistry}
            handleDisableBreadcrumb={handleDisableBreadcrumb}
          />
        )}
      </LayoutWrapper>
    </>
  )
}
