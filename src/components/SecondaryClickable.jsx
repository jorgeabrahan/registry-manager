import PropTypes from 'prop-types'

export const SecondaryClickable = ({
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
    <Tag
      className={`bg-white/5 border border-solid border-tundora-800 hover:bg-tundora-950 active:bg-dove-gray-700 rounded-lg text-white transition-[background,color] duration-300 font-medium cursor-pointer text-center ${
        isDisabled && 'opacity-50 pointer-events-none'
      } ${!removePadding && 'py-2 px-5'} ${className}`}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      href={href}
      target={target}
      rel={rel}
    >
      {children}
    </Tag>
  )
}

SecondaryClickable.propTypes = {
  children: PropTypes.node,
  as: PropTypes.oneOf(['a', 'button']),
  handleClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  type: PropTypes.oneOf(['submit', 'button']),
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  removePadding: PropTypes.bool
}
