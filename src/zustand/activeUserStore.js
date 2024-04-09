import { create } from 'zustand'

/**
 * @typedef {Object} User
 * @property {string} uid - The id of the user.
 * @property {string} email - The email of the user.
 * @property {string} displayName - The name of the user.
 * @property {boolean} isLoggedIn - Whether the user is logged in or not.
 */

/**
 * @type {User}
 */
const INITIAL_ACTIVE_USER = {}

const activeUserStore = create((set) => ({
  activeUser: INITIAL_ACTIVE_USER,
  setActiveUser: (activeUser) =>
    set((state) => ({ ...state, activeUser: activeUser })),
  setUpdatedActiveUser: (updatedFields) =>
    set((state) => ({
      ...state,
      activeUser: { ...state.activeUser, ...updatedFields }
    }))
}))

export { activeUserStore }
