import { MESSAGE_TYPES } from '../consts'
import { TYPOGRAPHY_VARIANTS } from '../consts/typography'
import { Typography } from './Typography'
import PropTypes from 'prop-types'

export const Message = ({ children, className = '', type = 'info' }) => {
  const messageLength = children?.toString()?.trim()?.length ?? 0
  if (messageLength === 0) return <></>
  let typeColor = 'border-blue-chill-600 bg-blue-chill-800/50'
  if (type === MESSAGE_TYPES.error) typeColor = 'border-wewak-600 bg-wewak-800/50'
  if (type === MESSAGE_TYPES.success) typeColor = 'border-mantis-600 bg-mantis-800/50'
  return (
    <div
      className={`border-l-[6px] py-4 px-4 border-solid rounded-r-lg h-max ${className} ${typeColor}`}
    >
      <Typography
        as='p'
        variant={TYPOGRAPHY_VARIANTS.body}
        className='text-dove-gray-200'
        weight={600}
      >
        {children}
      </Typography>
    </div>
  )
}

Message.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  type: PropTypes.oneOf([...Object.values(MESSAGE_TYPES)])
}
