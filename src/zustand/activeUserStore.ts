import { UserType } from '@/lib/types'
import { create } from 'zustand'

const activeUserStore = create<ActiveUserStore>((set) => ({
  activeUser: null,
  setActiveUser: (activeUser) =>
    set((state) => ({ ...state, activeUser })),
  setUpdatedActiveUser: (updatedFields) =>
    set((state) => ({
      ...state,
      activeUser: { ...state.activeUser, ...updatedFields }
    }))
}))

type ActiveUserStore = {
  activeUser: UserType | null,
  setActiveUser: (activeUser: UserType | null) => void,
  setUpdatedActiveUser: (updatedFields: UserType) => void
}

export { activeUserStore }
