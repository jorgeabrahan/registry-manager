import PropTypes from 'prop-types'

export const SelectField = ({
  children,
  slug = '',
  isRequired = true,
  isDisabled = false,
  value = '',
  handleChange = () => {},
  options = []
}) => {
  return (
    <div className={`relative w-full ${isDisabled && 'opacity-40'}`}>
      <label
        className="absolute left-4 text-dove-gray-500 transition-[font-size,top] duration-300 top-3 text-xs"
        htmlFor={slug}
      >
        {children}
      </label>
      <select
        className="bg-white/5 border border-solid border-tundora-800 focus:border-tundora-700 rounded-xl px-4 transition-[padding] duration-300 text-anti-flash-white w-full pt-7 pb-3"
        name={slug}
        id={slug}
        required={isRequired}
        disabled={isDisabled}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option value={option?.value} key={option?.value}>
            {option?.label}
          </option>
        ))}
      </select>
    </div>
  )
}

SelectField.propTypes = {
  children: PropTypes.node,
  slug: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  )
}
