import { create } from 'zustand'

/**
 * @typedef {Object} License
 * @property {string} key - The key of the license.
 * @property {Object} date - The date object of the license.
 * @property {string} date.start - The start date of the license.
 * @property {string} date.end - The end date of the license.
 * @property {string} uid - The ID of the user vinculated to the license.
 * @property {number} daysDuration - The amount of days the license will be active.
 * @property {boolean} isUnlimited - Whether the license is unlimited or not.
 * @property {boolean} isActivated - Whether the license is activated or not.
 */

/**
 * @type {License}
 */
const LOGGED_USER_INITIAL_LICENSE = {};

const licenseStore = create((set) => ({
  loggedUserLicense: LOGGED_USER_INITIAL_LICENSE,
  setLicense: (licenseData) =>
    set((state) => ({ ...state, loggedUserLicense: licenseData })),
  setUpdatedLicense: (updatedFields) =>
    set((state) => ({
      ...state,
      loggedUserLicense: { ...state.loggedUserLicense, ...updatedFields }
    }))
}))

export { licenseStore }
