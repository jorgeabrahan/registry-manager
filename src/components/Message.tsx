import { MessageTypes, TypographyVariants } from '@/lib/enums'
import React from 'react'
import { Typography } from './Typography'

export const Message: React.FC<MessageProps> = ({
  children,
  className = '',
  type = MessageTypes.info
}) => {
  const messageLength = children?.toString()?.trim()?.length ?? 0
  if (messageLength === 0) return <></>
  // default type color is for info messages
  let typeColor = 'border-blue-chill-600 bg-blue-chill-800/50'
  if (type === MessageTypes.error) typeColor = 'border-wewak-600 bg-wewak-800/50'
  if (type === MessageTypes.success) typeColor = 'border-mantis-600 bg-mantis-800/50'
  return (
    <div
      className={`border-l-[6px] py-4 px-4 border-solid rounded-r-lg h-max ${className} ${typeColor}`}
    >
      <Typography
        as='p'
        variant={TypographyVariants.body}
        className='text-dove-gray-200'
        weight={600}
      >
        {children}
      </Typography>
    </div>
  )
}

type MessageProps = {
  children: React.ReactNode
  className?: string
  type?: MessageTypes
}
