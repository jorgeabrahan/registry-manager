import { AuthTabs } from '@/lib/enums'
import { useState } from 'react'
import { Login } from './Login'
import { Signup } from './Signup'
import { Licenses } from './Licenses'
import { AuthFooter } from './AuthFooter'

export const Auth = () => {
  const [activeTab, setActiveTab] = useState<AuthTabs>(AuthTabs.login)
  return (
    <>
      {activeTab === AuthTabs.login && <Login setActiveTab={setActiveTab} />}
      {activeTab === AuthTabs.signup && <Signup setActiveTab={setActiveTab} />}
      {activeTab === AuthTabs.licenses && <Licenses />}
      <AuthFooter activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  )
}
