import { BoxedStat } from '@/components'
import { formatHNL } from '@/lib/utils'
import {
  calcClientsTotal,
  countArticlesTotal,
  mergeRegistriesClients
} from '@/lib/utils/registryUtils'
import { registriesStore } from '@/zustand'
import { useMemo } from 'react'
import { AddTransactionForm } from './AddTransactionForm'

export const StatsTab: React.FC<StatsTabProps> = ({
  uid = '',
  year = '',
  month = '',
  handleDisableBreadcrumb = () => {}
}) => {
  const storeRegistries = registriesStore()
  const mergedClients = useMemo(() => {
    return mergeRegistriesClients(storeRegistries.months[`${year}-${month}`])
  }, [storeRegistries, year, month])
  const registriesTotal = useMemo(() => {
    return calcClientsTotal(mergedClients)
  }, [mergedClients])
  return (
    <>
      <section className='flex sm:flex-row-reverse items-center gap-4 overflow-x-auto mb-6'>
        <BoxedStat title='Total vendido:' stat={formatHNL(registriesTotal)} />
        <BoxedStat title='Total articulos:' stat={`${countArticlesTotal(mergedClients)}`} />
        <BoxedStat title='Total clientes:' stat={`${mergedClients.length}`} />
      </section>
      <AddTransactionForm
        uid={uid}
        year={year}
        month={month}
        handleDisableBreadcrumb={handleDisableBreadcrumb}
        registriesTotal={registriesTotal}
      />
    </>
  )
}

type StatsTabProps = {
  uid?: string
  year?: string
  month?: string
  handleDisableBreadcrumb?: (isDisabled: boolean) => void
}
