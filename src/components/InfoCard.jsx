import PropTypes from 'prop-types'

export const InfoCard = ({ children, title = '' }) => {
  return (
    <div>
      <h2 className='text-xs text-dove-gray-500'>{title}</h2>
      <p className='text-sm font-semibold'>{children}</p>
    </div>
  );
}

InfoCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
}
