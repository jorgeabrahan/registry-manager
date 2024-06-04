import { TypographyVariants } from '@/lib/enums'
import { AnchorRelType, AnchorTargetType } from '@/lib/types'
import { Typography } from './Typography'

export const SecondaryTextClickable: React.FC<SecondaryTextClickableProps> = ({
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
      className={`cursor-pointer block text-dove-gray-400 ${className}`}
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

type SecondaryTextClickableProps = {
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
