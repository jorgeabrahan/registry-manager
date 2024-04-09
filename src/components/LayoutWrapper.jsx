import PropTypes from 'prop-types'

export const LayoutWrapper = ({
  children,
  as: Tag = 'section',
  className = ''
}) => {
  return <Tag className={`max-w-[1200px] w-full mx-auto px-2 ${className}`}>{children}</Tag>
}

LayoutWrapper.propTypes = {
  children: PropTypes.node,
  as: PropTypes.string,
  className: PropTypes.string
}
