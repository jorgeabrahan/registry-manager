import { RefreshIcon } from '@/assets/icons'
import { DeficitTag, MiniSecondaryClickable, SurplusTag } from '@/components'
import { dbGetYearsBalances } from '@/firebase/db/balances'
import { YearBalanceType } from '@/lib/types/balances'
import { formatHNL } from '@/lib/utils'
import { navStore } from '@/zustand'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const YearSelector: React.FC<YearSelectorProps> = ({
  year = '',
  handleYearSelect = () => {},
  isBusy = false,
  balances
}) => {
  const yearTotalBalance = balances?.[year]?.totalBalance ?? 0
  const getBalanceTag = () => {
    if (yearTotalBalance === 0) return null
    return yearTotalBalance > 0 ? <SurplusTag /> : <DeficitTag />
  }
  return (
    <button
      className='bg-white/5 border border-solid border-tundora-800 rounded-lg p-3'
      onClick={() => handleYearSelect(year)}
      disabled={isBusy}
    >
      <p className='font-sans text-left pointer-events-none flex items-center justify-between gap-2 mb-2'>
        <span className='text-xl font-semibold'>{year}</span>
        {getBalanceTag()}
      </p>
      <p className='text-left pointer-events-none text-dove-gray-200 flex gap-2 justify-between'>
        <span className='text-sm font-sans'>Balance del año:</span>{' '}
        <span className='font-mono'>{formatHNL(yearTotalBalance)}</span>
      </p>
    </button>
  )
}

export const YearSelectorView: React.FC<YearSelectorViewProps> = ({
  uid = '',
  years = [],
  handleYearSelect = () => {},
  handleDisableBreadcrumb = () => {}
}) => {
  const [yearsBalances, setYearsBalances] = useState<{ [key: string]: YearBalanceType } | null>(
    null
  )
  const [yearsBalancesTotal, setYearsBalancesTotal] = useState(0)
  const [isBusy, setIsBusy] = useState(false)
  const { setIsNavDisabled } = navStore()
  const fetchYearsBalances = () => {
    setIsBusy(true)
    setIsNavDisabled(true)
    handleDisableBreadcrumb(true)
    dbGetYearsBalances(uid)
      .then((res) => {
        if (!res.ok) {
          setYearsBalances({})
          toast.error(res?.error ?? '')
          return
        }
        const formattedBalances: { [key: string]: YearBalanceType } = {}
        let yearsBalancesTotal = 0
        res.balances.forEach((balance) => {
          formattedBalances[balance.year] = balance
          yearsBalancesTotal += balance.totalBalance
        })
        setYearsBalances(formattedBalances)
        setYearsBalancesTotal(yearsBalancesTotal)
      })
      .finally(() => {
        setIsBusy(false)
        setIsNavDisabled(false)
        handleDisableBreadcrumb(false)
      })
  }
  useEffect(() => {
    if (yearsBalances != null) return
    fetchYearsBalances()
  }, [uid])
  const handleReload = () => {
    fetchYearsBalances()
  }
  return (
    <>
      <MiniSecondaryClickable isDisabled={isBusy} handleClick={handleReload}>
        <RefreshIcon size='15px' /> Recargar
      </MiniSecondaryClickable>
      <section className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2 sm:gap-4 my-5'>
        {years.map((year) => (
          <YearSelector
            key={year}
            year={year}
            handleYearSelect={handleYearSelect}
            isBusy={isBusy}
            balances={yearsBalances}
          />
        ))}
      </section>
      <p className='text-right flex flex-col mb-10'>
        <span className='text-sm text-dove-gray-300'>Balance total:</span>{' '}
        <span className='text-2xl font-mono'>{formatHNL(yearsBalancesTotal)}</span>
      </p>
    </>
  )
}

type YearSelectorProps = {
  year: string
  handleYearSelect: (year: string) => void
  isBusy: boolean
  balances: { [key: string]: YearBalanceType } | null
}

type YearSelectorViewProps = {
  uid?: string
  years: string[]
  handleYearSelect: (year: string) => void
  handleDisableBreadcrumb?: (isDisabled: boolean) => void
}
