import { Field, PrimaryClickable } from '@/components'
import { useConfirmModal, useForm } from '@/hooks'
import { ClientType } from '@/lib/types/registries'
import { checkNameUpdate, formatName } from '@/lib/utils'
import React from 'react'

enum FIELDS {
  name = 'name'
}
export const EditTab: React.FC<EditTabProps> = ({
  client,
  handleUpdateClientName = () => {}
}) => {
  const { showConfirmModal } = useConfirmModal()
  const { name, onInputChange, onInputError, formErrors } = useForm({
    name: client.name
  })
  const validateForm = () => {
    let errors = []
    errors.push(onInputError(FIELDS.name, checkNameUpdate(client.name, name)))
    if (errors.includes(true)) return
    const formattedName = formatName(name)
    showConfirmModal({
      message: `Actualizar nombre de ${client.name} a ${formattedName}`,
      onConfirm: () => handleUpdateClientName(formattedName)
    })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validateForm()
  }
  return (
    <section className='h-full'>
      <form className='flex flex-col gap-4 h-full' onSubmit={handleSubmit}>
        <Field
          type='text'
          slug='name'
          value={name}
          handleChange={onInputChange}
          formErrors={formErrors}
        >
          Nombre
        </Field>
        <PrimaryClickable className='mt-auto' type='submit'>
          Actualizar
        </PrimaryClickable>
      </form>
    </section>
  )
}

type EditTabProps = {
  client: ClientType
  handleUpdateClientName: (newName: string) => void
}
