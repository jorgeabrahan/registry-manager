import { useState } from 'react'
import { useConfirmModal, useForm } from '@/hooks'
import { licensesStore } from '../licensesStore'
import { LicenseTypes, MessageTypes } from '@/lib/enums'
import { dbCreateLicense } from '@/firebase/db/licenses'
import { FormMessageType } from '@/lib/types'
import { checkLicenseDuration } from '@/lib/utils'
import { Field, Message, PrimaryClickable, SelectField } from '@/components'
import { LicenseTypesKeysType } from '@/lib/types/licenses'

enum CreateLicenseFields {
  licenseType = 'licenseType',
  daysDuration = 'daysDuration'
}

const INITIAL_FORM = {
  licenseType: LicenseTypes.limited,
  daysDuration: '30'
}

export const CreateTab = () => {
  const { showConfirmModal } = useConfirmModal()
  const { licenseType, daysDuration, onInputChange, onResetForm, onInputError, formErrors } =
    useForm(INITIAL_FORM)
  const storeLicenses = licensesStore()
  const [formMessage, setFormMessage] = useState<FormMessageType>({
    type: MessageTypes.error,
    text: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const generateLicense = () => {
    const isUnlimited = licenseType === LicenseTypes.unlimited
    const license = {
      date: {
        start: '',
        end: ''
      },
      daysDuration: isUnlimited ? 0 : Number(daysDuration),
      isUnlimited,
      uid: ''
    }
    setIsSubmitting(true)
    dbCreateLicense(license)
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
        storeLicenses.addLicense({ ...license, key: res?.id ?? '' })
        onResetForm()
      })
      .finally(() => setIsSubmitting(false))
  }
  const validateForm = () => {
    let errors = []
    if (licenseType === LicenseTypes.limited) {
      errors.push(
        onInputError(
          CreateLicenseFields.daysDuration,
          checkLicenseDuration(parseInt(daysDuration, 10))
        )
      )
    }
    if (errors.includes(true)) return
    showConfirmModal({
      message: 'Crear licencia',
      onConfirm: () => generateLicense()
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
          Crear licencia
        </PrimaryClickable>
      </form>
    </section>
  )
}
