import { Field, Message, PrimaryClickable } from '@/components'
import { updateUserPassword } from '@/firebase/auth'
import { useForm } from '@/hooks'
import { checkPass } from '@/lib/utils'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { ModalLayout } from '../ModalLayout'
import { MessageTypes } from '@/lib/enums'
import { FormMessageType } from '@/lib/types'
import { toast } from 'sonner'

enum FIELDS {
  password = 'password',
  updatedPassword = 'updatedPassword'
}
const INITIAL_FORM = {
  password: '',
  updatedPassword: ''
}

export const ChangePasswordModal = ({ handleHideModal = () => {} }) => {
  const {
    password,
    updatedPassword,
    onInputChange,
    onResetForm,
    onInputError,
    formErrors
  } = useForm(INITIAL_FORM)
  const [formMessage, setFormMessage] = useState<FormMessageType>({
    type: MessageTypes.error,
    text: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const changePassword = () => {
    setIsSubmitting(true)
    updateUserPassword(password, updatedPassword)
      .then((res) => {
        if (!res?.ok) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.error ?? ''
          })
          return
        }
        toast.success(res?.success ?? '')
        onResetForm()
        handleHideModal()
      })
      .finally(() => setIsSubmitting(false))
  }
  const validateForm = () => {
    let errors = []
    errors.push(onInputError(FIELDS.password, checkPass(password)))
    errors.push(
      onInputError(FIELDS.updatedPassword, checkPass(updatedPassword))
    )
    if (errors.includes(true)) return
    changePassword()
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    validateForm()
  }
  return (
    <ModalLayout
      handleHideModal={handleHideModal}
      shouldAllowClose={!isSubmitting}
    >
      <form className='grid gap-4' onSubmit={handleSubmit}>
        <Field
          type='password'
          slug='password'
          value={password}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Contraseña actual
        </Field>
        <Field
          type='password'
          slug='updatedPassword'
          value={updatedPassword}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Nueva contraseña
        </Field>
        <Message type={formMessage.type}>{formMessage.text}</Message>
        <PrimaryClickable
          className={`${isSubmitting && 'opacity-50 pointer-events-none'}`}
          type='submit'
        >
          Cambiar contraseña
        </PrimaryClickable>
      </form>
    </ModalLayout>
  )
}

ChangePasswordModal.propTypes = {
  handleHideModal: PropTypes.func
}
