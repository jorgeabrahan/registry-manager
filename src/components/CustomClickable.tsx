import { AnchorRelType, AnchorTargetType, ButtonActionType } from '@/lib/types'
import React from 'react'

/* no background, no border color, no hover, no active, no text color, fully customizable */
export const CustomClickable: React.FC<CustomClickableProps> = ({
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
    <Tag
      className={`border border-solid rounded-lg transition-[background,color] duration-300 font-medium cursor-pointer text-center ${
        isDisabled && 'opacity-50 pointer-events-none'
      } ${!removePadding && 'py-2 px-5'} ${className}`}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      href={href}
      target={target}
      rel={rel}
      title={title}
    >
      {children}
    </Tag>
  )
}

type CustomClickableProps = {
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
