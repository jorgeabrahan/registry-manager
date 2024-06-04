import { Field, Message, PrimaryClickable } from '@/components'
import { MessageTypes } from '@/lib/enums'
import { dbRemoveLicense } from '@/firebase/db/licenses'
import { useConfirmModal, useForm } from '@/hooks'
import { FormMessageType } from '@/lib/types'
import { useState } from 'react'
import { licensesStore } from '../licensesStore'

const INITIAL_FORM = {
  licenseKey: ''
}
export const RemoveTab = () => {
  const { showConfirmModal } = useConfirmModal()
  const { licenseKey, onInputChange, onResetForm } = useForm(INITIAL_FORM)
  const storeLicenses = licensesStore()
  const [formMessage, setFormMessage] = useState<FormMessageType>({
    type: MessageTypes.error,
    text: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const destroyLicense = () => {
    setIsSubmitting(true)
    dbRemoveLicense(licenseKey)
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
        onResetForm()
        storeLicenses.removeLicense(licenseKey)
      })
      .finally(() => setIsSubmitting(false))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return
    showConfirmModal({
      message: 'Eliminar licencia',
      onConfirm: () => destroyLicense()
    })
  }
  return (
    <section className='h-full'>
      <form className='flex flex-col gap-4 h-full' onSubmit={handleSubmit}>
        <Field type='text' slug='licenseKey' value={licenseKey} handleChange={onInputChange}>
          ID de la licencia
        </Field>
        <Message type={formMessage.type}>{formMessage.text}</Message>
        <PrimaryClickable
          className={`mt-auto ${isSubmitting && 'opacity-50 pointer-events-none'}`}
          type='submit'
        >
          Eliminar licencia
        </PrimaryClickable>
      </form>
    </section>
  )
}
