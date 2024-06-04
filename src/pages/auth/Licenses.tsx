import { HondurasFlag } from '@/assets/flags'
import { CheckIcon } from '@/assets/icons'
import { PrimaryClickable, SecondaryTextClickable } from '@/components'
import { TypographyVariants } from '@/lib/enums'
import { LICENSES_PURCHASE_OPTIONS } from './constants'
import { getPurchaseLicenseLink, getRenewalLicenseLink } from './utils'

export const Licenses = () => {
  return (
    <section className='md:h-screen md:flex justify-center items-center mx-2 sm:mx-4'>
      <div className='max-w-[600px] w-full mx-auto my-20 md:my-0 grid md:grid-cols-2 gap-4'>
        {LICENSES_PURCHASE_OPTIONS.map((license) => (
          <article
            key={license.id}
            className={`bg-shark-900 rounded-lg p-4 w-full border border-solid relative ${
              license.isPreferred
                ? 'border-blue-chill-500 shadow-sm shadow-blue-chill-500 -order-1 md:order-[initial]'
                : 'border-white/5'
            }`}
          >
            <header className='flex items-center justify-between mb-4'>
              <h2>{license.name}</h2>
              <p className='text-dove-gray-100 px-3 py-1 rounded-full border border-solid border-white/20 w-max text-xs'>
                {license.paymentPeriod}
              </p>
            </header>
            <section className='mb-5'>
              <figure className='flex items-center gap-1'>
                <HondurasFlag />
                <figcaption className='text-2xl font-semibold'>
                  {license.price} HNL
                </figcaption>
              </figure>
              <p className='text-dove-gray-400 text-xs'>
                {license.priceSubtitle}
              </p>
            </section>
            <ul className='mb-6'>
              {license.benefits.map((benefit) => (
                <li
                  className='flex items-center gap-1'
                  key={benefit.toLowerCase().replaceAll(' ', '-')}
                >
                  <CheckIcon />{' '}
                  <span className='text-sm text-dove-gray-200'>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
            <PrimaryClickable
              className='w-full block text-sm mb-2'
              handleClick={() => open(getPurchaseLicenseLink(license))}
            >
              Adquirir plan <strong>{license.name.toLowerCase()}</strong>
            </PrimaryClickable>
            <SecondaryTextClickable
              className='mx-auto'
              variant={TypographyVariants.supersmall}
              handleClick={() => open(getRenewalLicenseLink(license))}
            >
              Quiero renovar mi plan{' '}
              <strong>{license.name.toLowerCase()}</strong>
            </SecondaryTextClickable>
            {license.isPreferred && (
              <p className='text-xs absolute top-0 -translate-y-[50%] bg-blue-chill-500 px-2 py-[2px] rounded-full text-shark-950 border border-solid border-blue-chill-400 font-semibold left-[50%] -translate-x-[50%]'>
                Recomendado
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
