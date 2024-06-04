import { Auth } from './pages/auth'
import { activeUserStore, licenseStore } from './zustand'
import { Dashboard } from './pages/dashboard'
import { useEffect } from 'react'
import { restoreUserSession } from './firebase/auth'
import { dbGetLicenseByUID } from './firebase/db/licenses'
import { Toaster } from 'react-hot-toast'
import { LicenseType } from './lib/types/licenses'
import { ExpiredLicenseDashboard } from './pages/dashboard/ExpiredLicenseDashboard'

function ManageRegistryApp() {
  const { activeUser, setActiveUser } = activeUserStore()
  const { loggedUserLicense, setLicense } = licenseStore()
  /* restaurar la sesion del usuario en caso de que siga activa */
  useEffect(() => {
    const obtainUserLicense = (uid = '') => {
      dbGetLicenseByUID(uid).then((res): void => {
        // si la licencia no existe
        if (!res.ok) return
        const now = new Date()
        const licenseEndDate = new Date(res?.licenseData?.date?.end ?? '')
        if (!res?.licenseData?.isUnlimited && now > licenseEndDate) return
        if (res.licenseData == null) return
        setLicense({ ...res.licenseData, isActivated: true } as LicenseType)
      })
    }
    // si el usuario ya inicio sesion no es necesario restaurarla
    if (activeUser?.isLoggedIn) return
    restoreUserSession((userFromActiveSession) => {
      if (!userFromActiveSession.isLoggedIn) return
      setActiveUser(userFromActiveSession)
      obtainUserLicense(userFromActiveSession?.uid)
    })
  }, [activeUser, setActiveUser, setLicense])
  const getDashboardToDisplay = () => {
    if (loggedUserLicense?.isActivated ?? false) return <Dashboard />
    return <ExpiredLicenseDashboard />
  }
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 3000
        }}
      />
      {activeUser?.isLoggedIn ? getDashboardToDisplay() : <Auth />}
    </>
  )
}

export default ManageRegistryApp
