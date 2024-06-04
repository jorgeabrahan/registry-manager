import { InfoCircleIcon, LogInIcon } from '@/assets/icons'
import { SecondaryTextClickable } from '@/components'
import { AuthTabs, TypographyVariants } from '@/lib/enums'

export const AuthFooter: React.FC<AuthFooterProps> = ({
  activeTab = '',
  setActiveTab = () => {}
}) => {
  return (
    <footer className='fixed bottom-2 sm:bottom-4 max-w-[600px] w-full translate-x-[50%] right-[50%]'>
      <section className='px-2 sm:px-4'>
        {activeTab !== AuthTabs.licenses ? (
          <SecondaryTextClickable
            as='button'
            variant={TypographyVariants.small}
            className='ml-auto'
            textClassName='flex items-center gap-2 bg-shark-950 px-3 py-1 rounded-full border border-solid border-white/5 md:border-transparent md:p-0 md:bg-transparent'
            handleClick={() => setActiveTab(AuthTabs.licenses)}
          >
            Sobre las licencias <InfoCircleIcon />
          </SecondaryTextClickable>
        ) : (
          <SecondaryTextClickable
            as='button'
            variant={TypographyVariants.small}
            className='ml-auto'
            textClassName='flex items-center gap-2 bg-shark-950 px-3 py-1 rounded-full border border-solid border-white/5 md:border-transparent md:p-0 md:bg-transparent'
            handleClick={() => setActiveTab(AuthTabs.login)}
          >
            Iniciar sesión <LogInIcon />
          </SecondaryTextClickable>
        )}
      </section>
    </footer>
  )
}

type AuthFooterProps = {
  activeTab: AuthTabs
  setActiveTab: (tab: AuthTabs) => void
}
