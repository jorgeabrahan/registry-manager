import PropTypes from 'prop-types'
import { useState } from 'react'
import { Input } from './Input'
import { EyeClosedIcon, EyeIcon } from '../../assets/icons'

export const Password = ({
  slug = '',
  isRequired = true,
  isDisabled = false,
  isFocused = false,
  setIsFocused = () => {},
  value = '',
  handleChange = () => {}
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  return (
    <>
      <Input
        type={isPasswordVisible ? 'text' : 'password'}
        slug={slug}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        value={value}
        handleChange={handleChange}
      />
      <button
        onClick={() => setIsPasswordVisible((prev) => !prev)}
        className='absolute right-4 top-[50%] -translate-y-[50%] text-dove-gray-500'
        type='button'
        tabIndex="-1"
      >
        {isPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
      </button>
    </>
  )
}

Password.propTypes = {
  slug: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  setIsFocused: PropTypes.func,
  value: PropTypes.string,
  handleChange: PropTypes.func
}
