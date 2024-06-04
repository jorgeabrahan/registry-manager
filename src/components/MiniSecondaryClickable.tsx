import React from 'react'
import { SecondaryClickable } from './SecondaryClickable'

export const MiniSecondaryClickable: React.FC<MiniSecondaryClickableProps> = ({
  children,
  handleClick = () => {},
  isDisabled = false,
  className = '',
  title = ''
}) => {
  return (
    <SecondaryClickable
      removePadding
      className={`w-max px-3 py-1 text-sm text-white/70 flex items-center gap-2 ${className}`}
      handleClick={handleClick}
      isDisabled={isDisabled}
      title={title}
    >
      {children}
    </SecondaryClickable>
  )
}

type MiniSecondaryClickableProps = {
  children: React.ReactNode
  handleClick?: () => void
  isDisabled?: boolean
  className?: string
  title?: string
}
