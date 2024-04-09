import PropTypes from 'prop-types'
import { useState } from 'react'
import { Input, Password } from './'

export const Field = ({
  children,
  type = 'text',
  slug = '',
  isRequired = true,
  isDisabled = false,
  value = '',
  handleChange = () => {}
}) => {
  const [isFocused, setIsFocused] = useState(value.trim() !== '')
  const isPassword = type === 'password'
  return (
    <div className={`relative w-full ${isDisabled && 'opacity-40'}`}>
      <label
        className={`absolute left-4 text-dove-gray-500 transition-[font-size,top] duration-300 ${
          isFocused ? 'top-3 text-xs' : 'top-5'
        }`}
        htmlFor={slug}
      >
        {children}
      </label>
      {isPassword && (
        <Password
          slug={slug}
          isRequired={isRequired}
          isDisabled={isDisabled}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          value={value}
          handleChange={handleChange}
        />
      )}
      {!isPassword && (
        <Input
          type={type}
          slug={slug}
          isRequired={isRequired}
          isDisabled={isDisabled}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          value={value}
          handleChange={handleChange}
        />
      )}
    </div>
  )
}

Field.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf([
    'text',
    'password',
    'email',
    'search',
    'date',
    'datetime-local',
    'url'
  ]),
  slug: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
  handleChange: PropTypes.func
}
