import { CreditCardIcon, CreditCardsIcon, LogOutIcon, UserIcon } from '@/assets/icons'
import { signOutUser } from '@/firebase/auth'
import { ChangePasswordModal } from '@/modals/auth'
import { LicensesModal } from '@/modals/licenses'
import { formatDateTime } from '@/lib/utils'
import { activeUserStore, licenseStore, navStore } from '@/zustand'
import { useState } from 'react'
import { InfoCard } from '../InfoCard'
import { LayoutWrapper } from '../LayoutWrapper'
import { PrimaryTextClickable } from '../PrimaryTextClickable'
import { NavButton } from './NavButton'
import { NavDropdown } from './NavDropdown'
import { navDropdownsStore } from './navDropdownsStore'

export const Navbar = () => {
  const { activeUser, setActiveUser } = activeUserStore()
  const { setLicense, loggedUserLicense } = licenseStore()
  const { setActiveDropdown } = navDropdownsStore()
  const { isNavDisabled } = navStore()
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showLicensesModal, setShowLicensesModal] = useState(false)
  const handleLogout = () => {
    signOutUser().then(() => {
      setLicense(null)
      setActiveUser(null)
    })
  }
  const handleShowChangePasswordModal = () => {
    setShowChangePasswordModal(true)
    setActiveDropdown('')
  }
  return (
    <>
      <LayoutWrapper as='nav' className='flex md:justify-between gap-4 py-4'>
        <div className='flex items-center gap-4'>
          <NavDropdown
            text={activeUser?.displayName}
            info='Información del usuario'
            id='userInfo'
            icon={<UserIcon />}
            className='grid gap-2'
            isDisabled={isNavDisabled}
          >
            <InfoCard title='ID del usuario'>{activeUser?.uid}</InfoCard>
            <InfoCard title='Nombre de usuario'>{activeUser?.displayName}</InfoCard>
            <InfoCard title='Correo de usuario'>{activeUser?.email}</InfoCard>
            <PrimaryTextClickable
              className='text-left'
              textClassName='text-sm'
              handleClick={handleShowChangePasswordModal}
            >
              Cambiar contraseña
            </PrimaryTextClickable>
          </NavDropdown>
          <NavDropdown
            text={loggedUserLicense?.key}
            info='Licencia del usuario'
            id='licenseInfo'
            icon={<CreditCardIcon />}
            className='grid gap-2'
            isDisabled={isNavDisabled}
          >
            <InfoCard title='Llave'>{loggedUserLicense?.key}</InfoCard>
            <InfoCard title='ID de usuario'>{loggedUserLicense?.uid}</InfoCard>
            <InfoCard title='Tipo de licencia'>
              {loggedUserLicense?.isUnlimited ? 'Ilimitada' : 'Limitada'}
            </InfoCard>
            <InfoCard title='Estado de la licencia'>
              {new Date() > new Date(loggedUserLicense?.date?.end ?? '') ? 'Expirada' : 'Vigente'}
            </InfoCard>
            <InfoCard title='Fecha y hora de activación'>
              {formatDateTime(loggedUserLicense?.date?.start ?? '')}
            </InfoCard>
            <InfoCard title='Fecha y hora de vencimiento'>
              {loggedUserLicense?.isUnlimited
                ? 'Indefinida'
                : formatDateTime(loggedUserLicense?.date?.end ?? '')}
            </InfoCard>
            {!loggedUserLicense?.isUnlimited && (
              <InfoCard title='Días de duración'>{loggedUserLicense?.daysDuration}</InfoCard>
            )}
          </NavDropdown>
        </div>
        <div className='flex items-center gap-4'>
          {activeUser?.uid === '4hE73uwD20dvLgC22RsYhor6gP53' && (
            <NavButton
              info='Configuración de licencias'
              icon={<CreditCardsIcon />}
              handleClick={() => setShowLicensesModal(true)}
              isDisabled={isNavDisabled}
            />
          )}
          <NavButton
            info='Cerrar sesión'
            icon={<LogOutIcon />}
            handleClick={handleLogout}
            isDisabled={isNavDisabled}
          />
        </div>
      </LayoutWrapper>
      {showChangePasswordModal && (
        <ChangePasswordModal handleHideModal={() => setShowChangePasswordModal(false)} />
      )}
      {showLicensesModal && <LicensesModal handleHideModal={() => setShowLicensesModal(false)} />}
    </>
  )
}
