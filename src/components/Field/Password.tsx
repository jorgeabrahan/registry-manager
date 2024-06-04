import { EyeClosedIcon, EyeIcon } from '@/assets/icons'
import React, { useState } from 'react'
import { Input } from './Input'

export const Password: React.FC<PasswordProps> = ({
  slug = '',
  isRequired = true,
  isDisabled = false,
  isFocused = false,
  setIsFocused = () => {},
  value = '',
  handleChange = () => {},
  handleFocus = () => {},
  handleBlur = () => {},
  reference,
  autoFocus = false
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  return (
    <div className='relative'>
      <Input
        type={isPasswordVisible ? 'text' : 'password'}
        slug={slug}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        value={value}
        handleChange={handleChange}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        reference={reference}
        autoFocus={autoFocus}
      />
      <button
        onClick={() => setIsPasswordVisible((prev) => !prev)}
        className='absolute right-4 top-[50%] -translate-y-[50%] text-dove-gray-500'
        type='button'
        tabIndex={-1}
      >
        {isPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

type PasswordProps = {
  slug?: string
  isRequired?: boolean
  isDisabled?: boolean
  isFocused?: boolean
  setIsFocused?: (isFocused: boolean) => void
  value?: string
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  reference: React.RefObject<HTMLInputElement> | undefined
  autoFocus: boolean
}
