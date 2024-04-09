import PropTypes from 'prop-types'
import { Typography } from './Typography'
import { TYPOGRAPHY_VARIANTS, TYPOGRAPHY_WEIGHTS } from '../consts/typography'

export const PrimaryTextClickable = ({
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

PrimaryTextClickable.propTypes = {
  children: PropTypes.node,
  as: PropTypes.oneOf(['a', 'button']),
  handleClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  variant: PropTypes.oneOf([...Object.values(TYPOGRAPHY_VARIANTS)]),
  weight: PropTypes.oneOf(TYPOGRAPHY_WEIGHTS),
  className: PropTypes.string,
  textClassName: PropTypes.string
}
