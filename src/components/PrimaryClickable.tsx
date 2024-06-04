import { AnchorRelType, AnchorTargetType, ButtonActionType } from '@/lib/types'
import React from 'react'
import { CustomClickable } from './CustomClickable'

export const PrimaryClickable: React.FC<PrimaryClickableProps> = ({
  children,
  as: Tag = 'button',
  handleClick = () => {},
  href = '',
  target = '_blank',
  rel = 'noreferrer',
  type = 'button',
  isDisabled = false,
  className = '',
  removePadding = false
}) => {
  return (
    <CustomClickable
      as={Tag}
      handleClick={handleClick}
      href={href}
      target={target}
      rel={rel}
      type={type}
      isDisabled={isDisabled}
      className={`bg-blue-chill-500 border-white/40 hover:bg-blue-chill-600 active:bg-blue-chill-700 text-white ${className}`}
      removePadding={removePadding}
    >
      {children}
    </CustomClickable>
  )
}

type PrimaryClickableProps = {
  children: React.ReactNode
  as?: React.ElementType
  handleClick?: () => void
  href?: string
  target?: AnchorTargetType
  rel?: AnchorRelType
  type?: ButtonActionType
  isDisabled?: boolean
  className?: string
  removePadding?: boolean
}
