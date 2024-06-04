import React, { useCallback, useEffect, useState } from 'react'
import { Field } from './Field/Field'

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  children,
  slug = '',
  isRequired = true,
  isDisabled = false,
  value = '',
  handleChange = () => {},
  autoFocus = false,
  reference,
  formErrors = {},
  autoCompleteValues = [],
  handleAutoCompleteValueSelected = () => {}
}) => {
  const [showAutoComplete, setShowAutoComplete] = useState(false)
  const [focusedOptionId, setFocusedOptionId] = useState<string | null>(null)
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<AutoCompleteOption[]>([])
  /* effect that sets the autocomplete options based on autoCompleteValues changes */
  useEffect(() => {
    setAutoCompleteOptions(autoCompleteValues)
  }, [autoCompleteValues])
  const handleSubmitOption = useCallback(() => {
    if (focusedOptionId == null) return
    const selectedOption = autoCompleteOptions.find((opt) => opt.id === focusedOptionId)
    if (selectedOption == null) return
    handleAutoCompleteValueSelected(selectedOption)
    setFocusedOptionId(null)
  }, [focusedOptionId, handleAutoCompleteValueSelected, autoCompleteOptions])
  /* effect that sets the auto complete options based on query (input value) */
  useEffect(() => {
    if (value.trim().length === 0) {
      setAutoCompleteOptions(autoCompleteValues)
      return
    }
    setAutoCompleteOptions(
      autoCompleteValues.filter((item) =>
        item?.value?.trim().toLowerCase().includes(value.toLowerCase().trim())
      )
    )
  }, [value, setAutoCompleteOptions, autoCompleteValues])
  /* effect that updates the focused option id based on the autocomplete options and the input value changes */
  useEffect(() => {
    if (focusedOptionId != null && autoCompleteOptions.length !== 1) {
      setFocusedOptionId(null)
      return
    }
    if (focusedOptionId !== autoCompleteOptions[0]?.id && autoCompleteOptions.length === 1) {
      setFocusedOptionId(autoCompleteOptions[0]?.id ?? null)
    }
  }, [value, autoCompleteOptions])
  useEffect(() => {
    const getCurrentSelected: () => [AutoCompleteOption | undefined, number] = () => {
      const currentSelectedIndex = autoCompleteOptions.findIndex(
        (opt) => opt.id === focusedOptionId
      )
      const currentSelected = autoCompleteOptions.find((opt) => opt.id === focusedOptionId)
      return [currentSelected, currentSelectedIndex]
    }
    const handleNavigateOptionsDown = () => {
      const [currentSelected, currentSelectedIndex] = getCurrentSelected()
      // if there's NO selected option or if the last option is focused
      if (
        focusedOptionId == null ||
        currentSelected == null ||
        currentSelectedIndex === autoCompleteOptions.length - 1
      ) {
        setFocusedOptionId(autoCompleteOptions[0]?.id ?? null) // focus first option
        return
      }
      if (currentSelectedIndex == null) {
        setFocusedOptionId(null)
        return
      }
      setFocusedOptionId(autoCompleteOptions[currentSelectedIndex + 1]?.id ?? null)
    }
    const handleNavigateOptionsUp = () => {
      const [currentSelected, currentSelectedIndex] = getCurrentSelected()
      // if there's NO selected option or if the first option is focused
      if (focusedOptionId === null || currentSelected == null || currentSelectedIndex === 0) {
        setFocusedOptionId(autoCompleteOptions[autoCompleteOptions.length - 1]?.id ?? null) // focus last option
        return
      }
      setFocusedOptionId(autoCompleteOptions[currentSelectedIndex - 1]?.id ?? null)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      // if there are no autocomplete options
      if (autoCompleteOptions.length === 0) return
      if (e.key === 'ArrowDown') {
        handleNavigateOptionsDown()
        return
      }
      if (e.key === 'ArrowUp') {
        handleNavigateOptionsUp()
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') handleSubmitOption()
    }
    const inputRef = reference?.current
    if (inputRef) inputRef.addEventListener('keydown', handleKeyDown)
    return () => {
      if (inputRef) inputRef.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    reference,
    autoCompleteOptions,
    focusedOptionId,
    handleAutoCompleteValueSelected,
    handleSubmitOption
  ])
  return (
    <div className='relative w-full'>
      <Field
        slug={slug}
        isRequired={isRequired}
        isDisabled={isDisabled}
        value={value}
        handleChange={handleChange}
        handleFocus={() => {
          if (value.trim().length === 0 && focusedOptionId != null) setFocusedOptionId(null)
          setShowAutoComplete(true)
        }}
        handleBlur={() => setShowAutoComplete(false)}
        autoFocus={autoFocus}
        reference={reference}
        formErrors={formErrors}
      >
        {children}
      </Field>
      {showAutoComplete &&
        autoCompleteOptions.length > 0 &&
        (autoCompleteOptions.length === 1 ? autoCompleteOptions[0].value !== value : true) && (
          <ul className='absolute z-10 top-[calc(100%+0.5rem)] right-0 w-max p-2 rounded-xl bg-shark-900 border border-solid border-tundora-800 max-h-[300px] overflow-y-auto'>
            {autoCompleteOptions.map((item) => {
              return (
                <li key={item.id}>
                  <button
                    type='button'
                    className={`block w-full text-left text-dove-gray-200 py-1 px-2 rounded-lg transition-colors duration-300 text-sm ${
                      focusedOptionId === item.id && 'bg-tundora-800 hover:bg-tundora-800'
                    }`}
                    tabIndex={-1}
                    onMouseEnter={() => {
                      setFocusedOptionId(item.id)
                    }}
                    onMouseLeave={() => {
                      setFocusedOptionId(null)
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSubmitOption()
                    }}
                  >
                    {item.value}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
    </div>
  )
}

export type AutoCompleteOption = {
  id: string
  value?: string
}

type AutoCompleteProps = {
  children: React.ReactNode
  slug?: string
  isRequired?: boolean
  isDisabled?: boolean
  value?: string
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoFocus?: boolean
  reference?: React.RefObject<HTMLInputElement>
  formErrors?: {
    [key: string]: string
  }
  autoCompleteValues: AutoCompleteOption[]
  handleAutoCompleteValueSelected: (selectedOption: AutoCompleteOption) => void
}
