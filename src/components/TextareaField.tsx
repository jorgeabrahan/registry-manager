import { TypographyVariants } from '@/lib/enums'
import { Typography } from './Typography'
import { useState } from 'react'

export const TextareaField: React.FC<TextareaFieldProps> = ({
  children,
  slug = '',
  isRequired = true,
  isDisabled = false,
  value = '',
  handleChange = () => {},
  reference,
  handleFocus = () => {},
  handleBlur = () => {},
  formErrors = {},
  rows = 8
}) => {
  const [isFocused, setIsFocused] = useState(value.trim() !== '')
  const paddingOnFocus = isFocused ? 'pt-7 pb-3' : 'py-5'
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
      <textarea
        className={`bg-white/5 border border-solid border-tundora-800 focus:border-tundora-700 rounded-xl px-4 transition-[padding] duration-300 text-anti-flash-white w-full resize-none ${paddingOnFocus}`}
        rows={rows}
        onFocus={(e) => {
          setIsFocused(true)
          handleFocus(e)
        }}
        onBlur={(e) => {
          const hasNoValue = e.target.value?.trim()?.length === 0
          if (hasNoValue) setIsFocused(false)
          handleBlur(e)
        }}
        name={slug}
        id={slug}
        ref={reference}
        value={value}
        disabled={isDisabled}
        autoComplete='off'
        spellCheck={false}
        required={isRequired}
        onChange={handleChange}
      ></textarea>
      {formErrors[slug] != null && formErrors[slug] != '' && (
        <Typography className='text-wewak-500 mt-1' variant={TypographyVariants.small}>
          {formErrors[slug]}
        </Typography>
      )}
    </div>
  )
}

type TextareaFieldProps = {
  children: React.ReactNode
  slug?: string
  isRequired?: boolean
  isDisabled?: boolean
  value?: string
  handleChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  reference?: React.RefObject<HTMLTextAreaElement>
  autoFocus?: boolean
  handleFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  handleBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  formErrors?: {
    [key: string]: string
  }
  rows?: number
}
