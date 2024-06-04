import React from 'react'
import { NavArrowDownIcon } from '../assets/icons'
import { Typography } from './Typography'
import { TypographyVariants } from '@/lib/enums'

export const SelectField: React.FC<SelectFieldProps> = ({
  children,
  slug = '',
  customPadding = '',
  customIconSize = '24px',
  customIconPosition = 'right-4',
  isRequired = true,
  isDisabled = false,
  value = '',
  handleChange = () => {},
  options = [],
  formErrors = {},
  className = ''
}) => {
  const hasLabel = children != null
  const paddingTop = hasLabel ? 'pt-7' : 'pt-3'
  const padding =
    customPadding != null && customPadding != ''
      ? customPadding
      : `pb-3 px-4 ${paddingTop}`
  return (
    <div className={`relative w-full ${isDisabled && 'opacity-40'} ${className}`}>
      <label
        className={`${
          !hasLabel && 'sr-only'
        } absolute left-4 text-dove-gray-500 transition-[font-size,top] duration-300 top-3 text-xs`}
        htmlFor={slug}
      >
        {children}
      </label>
      <div className='relative'>
        <select
          className={`bg-white/5 border border-solid border-tundora-800 focus:border-tundora-700 rounded-xl transition-[padding] duration-300 text-anti-flash-white w-full ${padding}`}
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
        <div
          className={`absolute top-0 h-full flex items-center text-dove-gray-500 pointer-events-none ${customIconPosition}`}
        >
          <NavArrowDownIcon size={customIconSize} />
        </div>
      </div>
      {formErrors[slug] != null && (
        <Typography className='text-wewak-500 mt-1' variant={TypographyVariants.small}>
          {formErrors[slug]}
        </Typography>
      )}
    </div>
  )
}

type Option = {
  value: string
  label: string
}
type SelectFieldProps = {
  children?: React.ReactNode
  slug?: string
  isRequired?: boolean
  isDisabled?: boolean
  customPadding?: string
  customIconSize?: string
  customIconPosition?: string
  value?: string
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  formErrors?: {
    [key: string]: string
  }
  className?: string
}
