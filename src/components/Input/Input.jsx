import PropTypes from 'prop-types'

export const Input = ({
  type = 'text',
  slug = '',
  isRequired = true,
  isDisabled = false,
  isFocused = false,
  setIsFocused = () => {},
  value = '',
  handleChange = () => {}
}) => {
  const paddingOnFocus = isFocused ? 'pt-7 pb-3' : 'py-5'
  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e) => {
    const hasNoValue = e.target.value?.trim()?.length === 0
    if (hasNoValue) setIsFocused(false)
  }
  return (
    <input
      className={`bg-white/5 border border-solid border-tundora-800 focus:border-tundora-700 rounded-xl px-4 transition-[padding] duration-300 text-anti-flash-white w-full ${paddingOnFocus}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      type={type}
      id={slug}
      name={slug}
      required={isRequired}
      spellCheck='off'
      autoComplete='off'
      disabled={isDisabled}
      value={value}
      onChange={handleChange}
    />
  )
}

Input.propTypes = {
  type: PropTypes.string,
  slug: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  setIsFocused: PropTypes.func,
  value: PropTypes.string,
  handleChange: PropTypes.func
}
