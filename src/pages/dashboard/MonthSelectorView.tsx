import { RefreshIcon } from '@/assets/icons'
import { DeficitTag, MiniSecondaryClickable, SurplusTag } from '@/components'
import { dbGetYearBalances } from '@/firebase/db/balances'
import { MonthBalanceType } from '@/lib/types/balances'
import { formatHNL } from '@/lib/utils'
import { navStore } from '@/zustand'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const MonthSelector: React.FC<MonthSelectorProps> = ({
  month,
  handleMonthSelect,
  isBusy,
  balances
}) => {
  const monthRegistriesTotal = balances?.[month]?.registriesTotal ?? 0
  const monthTransactionTotal = balances?.[month]?.transactionsTotal ?? 0
  const monthBalance =
    (balances?.[month]?.registriesTotal ?? 0) + (balances?.[month]?.transactionsTotal ?? 0)
  const getBalanceTag = () => {
    if (monthBalance === 0) return null
    return monthBalance > 0 ? <SurplusTag /> : <DeficitTag />
  }
  return (
    <button
      className='bg-white/5 border border-solid border-tundora-800 rounded-lg p-3'
      onClick={() => handleMonthSelect(month)}
      disabled={isBusy}
    >
      <p className='font-sans text-left pointer-events-none flex items-center justify-between gap-2 mb-2'>
        <span className='text-xl font-semibold'>{month}</span>
        {getBalanceTag()}
      </p>
      <p className='text-left pointer-events-none text-dove-gray-200 flex gap-2 justify-between'>
        <span className='text-sm font-sans'>Total registros:</span>{' '}
        <span className='font-mono'>{formatHNL(monthRegistriesTotal)}</span>
      </p>
      <p className='text-left pointer-events-none text-dove-gray-200 flex gap-2 justify-between'>
        <span className='text-sm font-sans'>Total transacciones:</span>{' '}
        <span className='font-mono'>{formatHNL(monthTransactionTotal)}</span>
      </p>
      <p className='text-left pointer-events-none text-dove-gray-200 flex gap-2 justify-between'>
        <span className='text-sm font-sans'>Balance del mes:</span>{' '}
        <span className='font-mono'>{formatHNL(monthBalance)}</span>
      </p>
    </button>
  )
}

export const MonthSelectorView: React.FC<MonthSelectorViewProps> = ({
  months = [],
  handleMonthSelect = () => {},
  uid = '',
  year = '',
  handleDisableBreadcrumb = () => {}
}) => {
  const [monthsBalances, setMonthsBalances] = useState<{ [key: string]: MonthBalanceType } | null>(null)
  const [yearBalance, setYearBalance] = useState(0)
  const [isBusy, setIsBusy] = useState(false)
  const { setIsNavDisabled } = navStore()
  const fetchYearBalances = () => {
    setIsBusy(true)
    setIsNavDisabled(true)
    handleDisableBreadcrumb(true)
    dbGetYearBalances(uid, year)
      .then((res): void => {
        if (!res.ok) {
          setMonthsBalances({})
          toast.error(res?.error ?? '')
          return
        }
        const formattedBalances: { [key: string]: MonthBalanceType } = {}
        let balancesTotal = 0
        res.balances.forEach((balance) => {
          formattedBalances[balance.month] = balance
          balancesTotal += balance.registriesTotal + balance.transactionsTotal
        })
        setMonthsBalances(formattedBalances)
        setYearBalance(balancesTotal)
      })
      .finally(() => {
        setIsBusy(false)
        setIsNavDisabled(false)
        handleDisableBreadcrumb(false)
      })
  }
  useEffect(() => {
    if (monthsBalances != null) return
    fetchYearBalances()
  }, [uid, year])
  const handleReload = () => {
    fetchYearBalances()
  }
  return (
    <>
      <MiniSecondaryClickable isDisabled={isBusy} handleClick={handleReload}>
        <RefreshIcon size='15px' /> Recargar
      </MiniSecondaryClickable>
      <section className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 sm:gap-4 my-5'>
        {months.map((month) => (
          <MonthSelector
            key={month}
            month={month}
            handleMonthSelect={handleMonthSelect}
            isBusy={isBusy}
            balances={monthsBalances}
          />
        ))}
      </section>
      <p className='text-right flex flex-col mb-10'>
        <span className='text-sm text-dove-gray-300'>Balance del año:</span>{' '}
        <span className='text-2xl font-mono'>{formatHNL(yearBalance)}</span>
      </p>
    </>
  )
}

type MonthSelectorProps = {
  month: string
  handleMonthSelect: (month: string) => void
  isBusy: boolean
  balances: { [key: string]: MonthBalanceType } | null
}

type MonthSelectorViewProps = {
  months: string[]
  handleMonthSelect: (month: string) => void
  uid?: string
  year?: string
  handleDisableBreadcrumb?: (isDisabled: boolean) => void
}
