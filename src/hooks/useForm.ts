import React, { useState } from 'react'

export const useForm = <T extends Record<string, string> = {}>(initialForm: T) => {
  const [formErrors, setFormErrors] = useState({})
  const [formState, setFormState] = useState<T>(initialForm)

  const onInputChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = target
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const setInputValue = (name = '', value = '') => {
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const onResetForm = () => {
    setFormState(initialForm)
    setFormErrors({})
  }

  const onInputError = (inputName = '', error = '') => {
    setFormErrors((prev) => ({ ...prev, [inputName]: error }))
    return error !== ''
  }

  return {
    ...formState,
    formState,
    onInputChange,
    setInputValue,
    onInputError,
    formErrors,
    onResetForm
  }
}
