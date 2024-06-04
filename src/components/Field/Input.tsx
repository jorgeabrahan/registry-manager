import { InputType } from '@/lib/types'

export const Input: React.FC<InputProps> = ({
  type = 'text',
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
  autoFocus = false,
}) => {
  const paddingOnFocus = isFocused ? 'pt-7 pb-3' : 'py-5'
  return (
    <input
      className={`bg-white/5 border border-solid border-tundora-800 focus:border-tundora-700 rounded-xl px-4 transition-[padding] duration-300 text-anti-flash-white w-full ${paddingOnFocus}`}
      onFocus={(e) => {
        setIsFocused(true)
        handleFocus(e)
      }}
      onBlur={(e) => {
        const hasNoValue = e.target.value?.trim()?.length === 0
        if (hasNoValue) setIsFocused(false)
        handleBlur(e)
      }}
      type={type}
      id={slug}
      name={slug}
      required={isRequired}
      spellCheck={false}
      autoComplete='off'
      disabled={isDisabled}
      value={value}
      onChange={handleChange}
      ref={reference}
      autoFocus={autoFocus}
    />
  )
}

type InputProps = {
  type?: InputType,
  slug?: string,
  isRequired?: boolean,
  isDisabled?: boolean,
  isFocused?: boolean,
  setIsFocused?: (isFocused: boolean) => void,
  value?: string,
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleFocus?: (e: React.FocusEvent<HTMLInputElement>) => void,
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void,
  reference: React.RefObject<HTMLInputElement> | undefined,
  autoFocus: boolean
}
