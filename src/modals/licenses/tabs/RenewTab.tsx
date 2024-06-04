import { useState } from 'react'
import { LicenseTypes, MessageTypes } from '@/lib/enums'
import { useConfirmModal, useForm } from '@/hooks'
import { licensesStore } from '../licensesStore'
import { FormMessageType } from '@/lib/types'
import { dbGetLicense, dbUpdateLicense } from '@/firebase/db/licenses'
import { checkLicenseDuration } from '@/lib/utils'
import { Field, Message, PrimaryClickable, SelectField } from '@/components'
import { LicenseTypesKeysType } from '@/lib/types/licenses'

enum RenewLicenseFields {
  licenseType = 'licenseType',
  daysDuration = 'daysDuration',
  licenseKey = 'licenseKey'
}
const INITIAL_FORM = {
  licenseType: LicenseTypes.limited,
  daysDuration: '30',
  licenseKey: ''
}
export const RenewTab = () => {
  const { showConfirmModal } = useConfirmModal()
  const {
    licenseType,
    daysDuration,
    licenseKey,
    onInputChange,
    onResetForm,
    onInputError,
    formErrors
  } = useForm(INITIAL_FORM)
  const storeLicenses = licensesStore()
  const [formMessage, setFormMessage] = useState<FormMessageType>({
    type: MessageTypes.error,
    text: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const renewLicense = () => {
    const now = new Date()
    const licenseEndDate = new Date(now.getTime())
    licenseEndDate.setDate(now.getDate() + Number(daysDuration))
    const isUnlimited = licenseType === LicenseTypes.unlimited
    const licenseRenewed = {
      date: {
        start: now.toISOString(),
        end: isUnlimited ? '' : licenseEndDate.toISOString()
      },
      daysDuration: isUnlimited ? 0 : Number(daysDuration),
      isUnlimited
    }
    dbUpdateLicense(licenseKey, licenseRenewed)
      .then((res) => {
        if (!res.ok) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.error ?? ''
          })
          return
        }
        setFormMessage({
          type: MessageTypes.success,
          text: res?.success ?? ''
        })
        storeLicenses.updateLicense(licenseKey, licenseRenewed)
        onResetForm()
      })
      .finally(() => setIsSubmitting(false))
  }
  const obtainLicense = () => {
    setIsSubmitting(true)
    dbGetLicense(licenseKey)
      .then((res) => {
        if (!res.ok) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.error ?? ''
          })
          setIsSubmitting(false)
          return
        }
        if (res?.licenseData?.uid.trim().length === 0) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.messages?.isInactive(licenseKey) ?? ''
          })
          setIsSubmitting(false)
          return
        }
        if (res?.licenseData?.isUnlimited) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.messages?.isUnlimited(licenseKey) ?? ''
          })
          setIsSubmitting(false)
          return
        }
        const now = new Date()
        const licenseEndDate = new Date(res?.licenseData?.date?.end ?? '')
        if (now < licenseEndDate) {
          setFormMessage({
            type: MessageTypes.error,
            text: res?.messages?.isActive(licenseKey) ?? ''
          })
          setIsSubmitting(false)
          return
        }
        renewLicense()
      })
      .catch(() => setIsSubmitting(false))
  }
  const validateForm = () => {
    let errors = []
    if (licenseType === LicenseTypes.limited) {
      errors.push(
        onInputError(
          RenewLicenseFields.daysDuration,
          checkLicenseDuration(parseInt(daysDuration, 10))
        )
      )
    }
    if (errors.includes(true)) return
    showConfirmModal({
      message: 'Renovar licencia',
      onConfirm: () => obtainLicense()
    })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    validateForm()
  }
  return (
    <section className='h-full'>
      <form className='flex flex-col gap-4 h-full' onSubmit={handleSubmit}>
        <Field
          type='text'
          slug='licenseKey'
          value={licenseKey}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          ID de la licencia
        </Field>
        <SelectField
          slug='licenseType'
          value={licenseType}
          handleChange={onInputChange}
          options={Object.keys(LicenseTypes).map((key) => ({
            value: LicenseTypes[key as LicenseTypesKeysType],
            label: LicenseTypes[key as LicenseTypesKeysType]
          }))}
          formErrors={formErrors}
        >
          Tipo de licencia
        </SelectField>
        {licenseType === LicenseTypes.limited && (
          <Field
            type='text'
            slug='daysDuration'
            value={daysDuration}
            handleChange={onInputChange}
            formErrors={formErrors}
          >
            Duración (días)
          </Field>
        )}
        <Message type={formMessage.type}>{formMessage.text}</Message>
        <PrimaryClickable
          className={`mt-auto ${isSubmitting && 'opacity-50 pointer-events-none'}`}
          type='submit'
        >
          Renovar licencia
        </PrimaryClickable>
      </form>
    </section>
  )
}
