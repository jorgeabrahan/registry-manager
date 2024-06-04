import { AnchorRelType, AnchorTargetType, ButtonActionType } from '@/lib/types'
import React from 'react'
import { CustomClickable } from './CustomClickable'

export const SecondaryClickable: React.FC<SecondaryClickableProps> = ({
  children,
  as: Tag = 'button',
  handleClick = () => {},
  href = '',
  target = '_blank',
  rel = 'noreferrer',
  type = 'button',
  isDisabled = false,
  className = '',
  removePadding = false,
  title = ''
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
      className={`bg-tundora-950 border-tundora-800 hover:bg-tundora-900 active:bg-dove-gray-700 text-white ${className}`}
      removePadding={removePadding}
      title={title}
    >
      {children}
    </CustomClickable>
  )
}

type SecondaryClickableProps = {
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
  title?: string
}
