import { Field, Message, PrimaryClickable, PrimaryTextClickable, Typography } from '@/components'
import { createUser } from '@/firebase/auth'
import { dbGetLicense, dbUpdateLicense } from '@/firebase/db/licenses'
import { useForm } from '@/hooks'
import { AuthTabs, MessageTypes, TypographyVariants } from '@/lib/enums'
import { FormMessageType } from '@/lib/types'
import { LicenseType } from '@/lib/types/licenses'
import { checkEmail, checkName, checkPass, checkPassConfirm } from '@/lib/utils'
import { activeUserStore, licenseStore } from '@/zustand'
import { useState } from 'react'
import { AuthFormLayout } from './AuthFormLayout'

enum SignupFields {
  displayName = 'displayName',
  email = 'email',
  password = 'password',
  passwordConfirmation = 'passwordConfirmation',
  licenseKey = 'licenseKey'
}

const INITIAL_FORM = {
  displayName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  licenseKey: ''
}

export const Signup: React.FC<SignupProps> = ({ setActiveTab = () => {} }) => {
  const {
    displayName,
    email,
    password,
    passwordConfirmation,
    licenseKey,
    onInputChange,
    onInputError,
    formErrors
  } = useForm(INITIAL_FORM)
  const storeLicense = licenseStore()
  const storeActiveUser = activeUserStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState<FormMessageType>({
    type: MessageTypes.error,
    text: ''
  })

  const activateLicense = (uid: string, licenseData: Partial<LicenseType>) => {
    const now = new Date()
    const licenseEndDate = new Date(now.getTime())
    licenseEndDate.setDate(now.getDate() + (licenseData?.daysDuration ?? 0))
    const updatedLicense = {
      date: {
        start: now.toISOString(),
        end: licenseData?.isUnlimited ? '' : licenseEndDate.toISOString()
      },
      uid
    }
    dbUpdateLicense(licenseKey, updatedLicense)
    storeLicense.setUpdatedLicense({ ...updatedLicense, isActivated: true } as Partial<LicenseType>)
    setFormMessage({
      type: MessageTypes.error,
      text: ''
    })
    setIsSubmitting(false)
  }
  const registerUser = (licenseData: Partial<LicenseType>) => {
    createUser(email, password, displayName)
      .then((res) => {
        if (!res.isCreated) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.error ?? ''
          })
          setIsSubmitting(false)
          return
        }
        activateLicense(res?.user?.uid ?? '', licenseData)
        storeActiveUser.setActiveUser({
          uid: res?.user?.uid ?? '',
          email,
          displayName,
          isLoggedIn: true
        })
      })
      .catch(() => setIsSubmitting(false))
  }
  const validateLicense = () => {
    setIsSubmitting(true)
    dbGetLicense(licenseKey).then((res): void => {
      if (!res.ok) {
        setFormMessage({
          type: MessageTypes.error,
          text: res?.error ?? ''
        })
        setIsSubmitting(false)
        return
      }
      if (res?.licenseData?.isAlreadyInUse) {
        setFormMessage({
          type: MessageTypes.error,
          text: res?.messages?.isAlreadyInUse(licenseKey) ?? ''
        })
        setIsSubmitting(false)
        return
      }
      const now = new Date()
      const licenseEndDate = new Date(res.licenseData?.date?.end ?? '')
      if (!res?.licenseData?.isUnlimited && now > licenseEndDate) {
        setFormMessage({
          type: MessageTypes.error,
          text: res?.messages?.isExpired(licenseKey) ?? ''
        })
        setIsSubmitting(false)
        return
      }
      if (res?.licenseData == null) return
      storeLicense.setLicense({
        ...res.licenseData,
        key: licenseKey,
        isActivated: false
      } as LicenseType)
      registerUser(res.licenseData)
    })
  }
  const validateForm = () => {
    let errors = []
    errors.push(onInputError(SignupFields.displayName, checkName(displayName)))
    errors.push(onInputError(SignupFields.email, checkEmail(email)))
    errors.push(onInputError(SignupFields.password, checkPass(password)))
    errors.push(
      onInputError(SignupFields.passwordConfirmation, checkPassConfirm(passwordConfirmation))
    )
    if (errors.includes(true)) return
    validateLicense()
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    validateForm()
  }
  return (
    <AuthFormLayout>
      <form className='grid gap-4 mb-3' onSubmit={handleSubmit}>
        <Field
          type='text'
          slug='displayName'
          value={displayName}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Nombre
        </Field>
        <Field
          type='email'
          slug='email'
          value={email}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Correo
        </Field>
        <Field
          type='password'
          slug='password'
          value={password}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Contraseña
        </Field>
        <Field
          type='password'
          slug='passwordConfirmation'
          value={passwordConfirmation}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Confirmar contraseña
        </Field>
        <Field
          type='text'
          slug='licenseKey'
          value={licenseKey}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Licencia
        </Field>
        <Message type={formMessage.type}>{formMessage.text}</Message>
        <PrimaryClickable
          className={`${isSubmitting && 'opacity-50 pointer-events-none'}`}
          type='submit'
        >
          Registrarme
        </PrimaryClickable>
      </form>
      <Typography
        as='p'
        variant={TypographyVariants.small}
        className='flex items-center justify-center gap-1 text-dove-gray-400'
      >
        ¿Ya tienes una cuenta?
        <PrimaryTextClickable
          handleClick={() => setActiveTab(AuthTabs.login)}
          variant={TypographyVariants.small}
        >
          Inicia sesión
        </PrimaryTextClickable>
      </Typography>
    </AuthFormLayout>
  )
}

type SignupProps = {
  setActiveTab: (tab: AuthTabs) => void
}
