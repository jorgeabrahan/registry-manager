import { TypographyVariants, TypographyWeights } from '@/lib/enums'
import { AnchorRelType, AnchorTargetType } from '@/lib/types'
import React from 'react'
import { Typography } from './Typography'

export const PrimaryTextClickable: React.FC<PrimaryTextClickableProps> = ({
  children,
  as: Tag = 'button',
  handleClick = () => {},
  href = '',
  target = '_blank',
  rel = 'noreferrer',
  variant,
  weight,
  className = '',
  textClassName = ''
}) => {
  return (
    <Tag
      className={`cursor-pointer block text-blue-chill-400 ${className}`}
      onClick={handleClick}
      href={href}
      target={target}
      rel={rel}
    >
      <Typography as='span' variant={variant} weight={weight} className={textClassName}>
        {children}
      </Typography>
    </Tag>
  )
}

type PrimaryTextClickableProps = {
  children: React.ReactNode
  as?: React.ElementType
  handleClick?: () => void
  href?: string
  target?: AnchorTargetType
  rel?: AnchorRelType
  variant?: TypographyVariants
  weight?: TypographyWeights
  className?: string
  textClassName?: string
}
