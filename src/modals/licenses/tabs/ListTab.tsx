import { CopyIcon } from '@/assets/icons'
import { Message } from '@/components'
import { LICENSES_MESSAGES, dbGetLicenses } from '@/firebase/db/licenses'
import { MessageTypes } from '@/lib/enums'
import { FormMessageType } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { licenseStore } from '@/zustand'
import React, { useEffect, useState } from 'react'
import { licensesStore } from '../licensesStore'
import { toast } from 'sonner'

const BooleanTag = ({
  validation = false,
  truthyText = '',
  falsyText = ''
}) => {
  return (
    <span
      className={`w-max rounded-full px-3 py-1 text-xs font-semibold border border-solid ${
        validation
          ? 'border-mantis-600 bg-mantis-800/50'
          : 'border-wewak-600 bg-wewak-800/50'
      }`}
    >
      {validation ? truthyText : falsyText}
    </span>
  )
}
const LicenseTrait: React.FC<LicenseTraitProps> = ({
  children,
  trait = ''
}) => {
  return (
    <p className='text-sm text-white/70'>
      <span className='font-semibold'>{trait}:</span> {children}
    </p>
  )
}
type LicenseTraitProps = {
  children: React.ReactNode
  trait: string
}

export const ListTab = () => {
  const storeLicense = licenseStore()
  const storeLicenses = licensesStore()
  const [alreadyFetched, setAlreadyFetched] = useState(false)
  const [formMessage, setFormMessage] = useState<FormMessageType>({
    type: MessageTypes.error,
    text: ''
  })
  useEffect(() => {
    if (storeLicenses.licenses.length > 0 || alreadyFetched) {
      // if there's no other license besides mine
      if (storeLicenses.licenses.length === 1)
        setFormMessage({
          type: MessageTypes.info,
          text: LICENSES_MESSAGES.empty
        })
      return
    }
    dbGetLicenses().then((res) => {
      if (!res.ok) {
        setFormMessage({
          type: MessageTypes.error,
          text: res?.error ?? ''
        })
        return
      }
      setFormMessage({
        type: MessageTypes.error,
        text: ''
      })
      storeLicenses.setLicenses(res.licenses)
      setAlreadyFetched(true)
    })
  }, [storeLicenses, alreadyFetched])

  const handleCopyLicenseKey = (licenseKey = '') => {
    navigator.clipboard
      .writeText(licenseKey)
      .then(() => toast.success('Elemento copiado.'))
      .catch(() => toast.error('Error al copiar.'))
  }
  return (
    <section className='flex flex-col gap-3 overflow-y-scroll h-full hide-scrollbar'>
      {storeLicenses.licenses
        .filter(
          (license) => license.key !== storeLicense?.loggedUserLicense?.key
        )
        .map((license) => {
          const now = new Date()
          const licenseEndDate = new Date(license?.date?.end ?? '')
          const isVinculated = license?.uid?.length !== 0
          const isUnlimited = license?.isUnlimited ?? false
          const isCurrent = now < licenseEndDate
          return (
            <details
              className='cursor-pointer bg-dove-gray-950 pb-2 border-b-2 border-solid border-white/5 h-max'
              key={license?.key}
              open
            >
              <summary className='sm:flex sm:gap-2 sm:items-center sm:justify-between'>
                <div className='flex items-center gap-2 mb-2 sm:mb-0'>
                  <button onClick={() => handleCopyLicenseKey(license?.key)}>
                    <CopyIcon />
                  </button>
                  <p>
                    <strong>{license?.key}</strong>
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <BooleanTag
                    validation={isVinculated}
                    truthyText='Vinculada'
                    falsyText='Desvinculada'
                  />
                  {isVinculated && (
                    <BooleanTag
                      validation={isCurrent || isUnlimited}
                      truthyText='Vigente'
                      falsyText='Vencida'
                    />
                  )}
                </div>
              </summary>
              <section className='mt-4 sm:mt-2'>
                <p className='text-sm text-white/70'>
                  <span className='font-semibold'>Duración:</span>{' '}
                  {isUnlimited
                    ? 'Ilimitada'
                    : `${Number(license?.daysDuration ?? 0)} días`}
                </p>
                {isVinculated && (
                  <>
                    <LicenseTrait trait='Fecha de activación'>
                      {formatDateTime(license?.date?.start ?? '')}
                    </LicenseTrait>
                    <LicenseTrait trait='Fecha de vencimiento'>
                      {isUnlimited
                        ? 'Indefinida'
                        : formatDateTime(license?.date?.end ?? '')}
                    </LicenseTrait>
                    <LicenseTrait trait='Usuario vinculado'>
                      {license?.uid ?? ''}
                    </LicenseTrait>
                  </>
                )}
              </section>
            </details>
          )
        })}
      <Message type={formMessage.type}>{formMessage.text}</Message>
    </section>
  )
}
