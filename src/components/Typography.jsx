import PropTypes from 'prop-types'
import {
  TYPOGRAPHY_VARIANTS,
  TYPOGRAPHY_VARIANT_CLASSES,
  TYPOGRAPHY_WEIGHTS
} from '@/consts/typography'

export const Typography = ({
  children,
  as: Tag = 'p',
  variant = 'body',
  weight = 400,
  className = ''
}) => {
  return (
    <Tag
      className={`${TYPOGRAPHY_VARIANT_CLASSES[variant]} ${className}`}
      style={{ fontWeight: weight }}
    >
      {children}
    </Tag>
  )
}

Typography.propTypes = {
  children: PropTypes.node,
  as: PropTypes.string,
  variant: PropTypes.oneOf([...Object.values(TYPOGRAPHY_VARIANTS)]),
  weight: PropTypes.oneOf(TYPOGRAPHY_WEIGHTS),
  className: PropTypes.string
}
