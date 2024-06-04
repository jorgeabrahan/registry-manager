export const BoxedStat: React.FC<BoxedStatProps> = ({ title = '', stat = '' }) => {
  return (
    <article className='border border-solid border-dove-gray-900 px-5 py-2 rounded-lg'>
      <h4 className='text-xs text-dove-gray-300 w-max'>{title}</h4>
      <p className='text-xl font-mono'>{stat}</p>
    </article>
  )
}

type BoxedStatProps = {
  title: string
  stat: string
}
