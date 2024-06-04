import { TypographyVariants } from '@/lib/enums'
import { InputType } from '@/lib/types'
import React, { useState } from 'react'
import { Typography } from '../Typography'
import { Password } from './Password'
import { Input } from './Input'

export const Field: React.FC<FieldProps> = ({
  children,
  type = 'text',
  slug = '',
  isRequired = true,
  isDisabled = false,
  value = '',
  handleChange = () => {},
  reference,
  autoFocus = false,
  handleFocus = () => {},
  handleBlur = () => {},
  formErrors = {}
}) => {
  const [isFocused, setIsFocused] = useState(value.trim() !== '')
  const isPassword = type === 'password'
  return (
    <div className={`relative w-full ${isDisabled && 'opacity-40'}`}>
      <label
        className={`absolute left-4 text-dove-gray-500 transition-[font-size,top] duration-300 pointer-events-none ${
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
          reference={reference}
          autoFocus={autoFocus}
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
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          reference={reference}
          autoFocus={autoFocus}
        />
      )}
      {formErrors[slug] != null && formErrors[slug] != '' && (
        <Typography className='text-wewak-500 mt-1' variant={TypographyVariants.small}>
          {formErrors[slug]}
        </Typography>
      )}
    </div>
  )
}

type FieldProps = {
  children: React.ReactNode
  type?: InputType
  slug?: string
  isRequired?: boolean
  isDisabled?: boolean
  value?: string
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  reference?: React.RefObject<HTMLInputElement>
  autoFocus?: boolean
  handleFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  formErrors?: {
    [key: string]: string
  }
}
