import { formatHNL } from '@/lib/utils'

const BalanceCard: React.FC<BalanceCardProps> = ({ children, amount = 0 }) => {
  return (
    <article className='bg-shark-900 border border-solid border-white/5 p-6 rounded-2xl'>
      <p className='text-dove-gray-300 leading-3 font-light text-sm'>{children}:</p>
      <p className='font-mono text-2xl font-semibold'>{formatHNL(amount)}</p>
    </article>
  )
}

export const MonthBalance: React.FC<MonthBalanceProps> = ({
  registriesTotal = 0,
  transactionsTotal = 0,
  monthBalance = 0,
  month = '',
  year = ''
}) => {
  return (
    <section className='mb-10'>
      <div className='text-left'>
        <p className='text-sm font-light text-dove-gray-200 leading-3'>Mi balance de</p>
        <h3 className='text-2xl font-semibold font-sans'>{month} del {year}</h3>
      </div>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] my-4 gap-4'>
        <BalanceCard amount={registriesTotal}>
          Total vendido
        </BalanceCard>
        <BalanceCard amount={transactionsTotal}>
          Total transacciones <strong>({transactionsTotal > 0 ? 'Superávit' : 'Déficit'})</strong>
        </BalanceCard>
        <BalanceCard amount={monthBalance}>
          Balance mensual <strong>({monthBalance > 0 ? 'Superávit' : 'Déficit'})</strong>
        </BalanceCard>
      </div>
    </section>
  )
}

type BalanceCardProps = {
  children: React.ReactNode
  amount: number
}

type MonthBalanceProps = {
  registriesTotal: number
  transactionsTotal: number
  monthBalance: number
  month: string
  year: string
}
