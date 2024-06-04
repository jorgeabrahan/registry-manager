import React from 'react'
import { TypographyVariants, TypographyWeights } from '@/lib/enums'

const variantClasses = {
  supertitle: 'text-5xl xl:text-7xl',
  title: 'text-3xl xl:text-5xl',
  subtitle: 'text-xl xl:text-2xl',
  body: 'text-base',
  small: 'text-sm',
  supersmall: 'text-xs'
}
export const Typography: React.FC<TypographyProps> = ({
  children,
  as: Tag = 'p',
  variant = TypographyVariants.body,
  weight = TypographyWeights.normal,
  className = ''
}) => {
  return (
    <Tag
      className={`${variantClasses[variant]} ${className}`}
      style={{ fontWeight: weight }}
    >
      {children}
    </Tag>
  )
}

type TypographyProps = {
  children: React.ReactNode,
  as?: React.ElementType,
  variant?: TypographyVariants,
  weight?: TypographyWeights,
  className?: string
}
