import { Field, Message, PrimaryClickable, PrimaryTextClickable, Typography } from '@/components'
import { signInUser } from '@/firebase/auth'
import { LICENSES_LOADING, dbGetLicenseByUID } from '@/firebase/db/licenses'
import { useForm } from '@/hooks'
import { AuthTabs, MessageTypes, TypographyVariants } from '@/lib/enums'
import { FormMessageType } from '@/lib/types'
import { checkEmail, checkPass } from '@/lib/utils'
import { activeUserStore, licenseStore } from '@/zustand'
import { useState } from 'react'
import { AuthFormLayout } from './AuthFormLayout'
import { LicenseType } from '@/lib/types/licenses'

enum LoginFields {
  email = 'email',
  password = 'password'
}
const INITIAL_FORM = {
  email: '',
  password: ''
}

export const Login: React.FC<LoginProps> = ({ setActiveTab = () => {} }) => {
  const { email, password, onInputChange, onInputError, formErrors } = useForm(INITIAL_FORM)
  const [formMessage, setFormMessage] = useState<FormMessageType>({
    type: MessageTypes.error,
    text: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const storeLicense = licenseStore()
  const storeActiveUser = activeUserStore()
  const obtainLicense = (uid = '') => {
    dbGetLicenseByUID(uid)
      .then((res) => {
        if (!res.ok) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.error ?? ''
          })
          return
        }
        const now = new Date()
        const licenseEndDate = new Date(res.licenseData?.date?.end ?? '')
        const licenseKey = res.licenseData?.key ?? ''
        if (!res?.licenseData?.isUnlimited && now > licenseEndDate) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.messages?.isExpired(licenseKey) ?? ''
          })
          return
        }
        storeLicense.setLicense({ ...res.licenseData, isActivated: true } as LicenseType)
        setFormMessage({
          type: MessageTypes.error,
          text: ''
        })
      })
      .finally(() => setIsSubmitting(false))
  }
  const loginUser = () => {
    setIsSubmitting(true)
    signInUser(email, password)
      .then((res) => {
        if (!res.isSignedIn) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.error ?? ''
          })
          setIsSubmitting(false)
          return
        }
        setFormMessage({
          type: MessageTypes.info,
          text: LICENSES_LOADING.getOne
        })
        obtainLicense(res?.user?.uid)
        storeActiveUser.setActiveUser({
          uid: res?.user?.uid ?? '',
          email: res?.user?.email ?? '',
          displayName: res?.user?.displayName ?? '',
          isLoggedIn: true
        })
      })
      .catch(() => setIsSubmitting(false))
  }
  const validateForm = () => {
    let errors = []
    errors.push(onInputError(LoginFields.email, checkEmail(email)))
    errors.push(onInputError(LoginFields.password, checkPass(password)))
    if (errors.includes(true)) return
    loginUser()
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
        <Message type={formMessage.type}>{formMessage.text}</Message>
        <PrimaryClickable
          className={`${isSubmitting && 'opacity-50 pointer-events-none'}`}
          type='submit'
        >
          Iniciar sesión
        </PrimaryClickable>
      </form>
      <Typography
        as='p'
        variant={TypographyVariants.small}
        className='flex items-center justify-center gap-1 text-dove-gray-400'
      >
        ¿No tienes una cuenta?
        <PrimaryTextClickable
          handleClick={() => setActiveTab(AuthTabs.signup)}
          variant={TypographyVariants.small}
        >
          Creala
        </PrimaryTextClickable>
      </Typography>
    </AuthFormLayout>
  )
}

type LoginProps = {
  setActiveTab: (tab: AuthTabs) => void
}
