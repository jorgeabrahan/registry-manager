import { ERR, INVALID_CHARS } from './constants'

/* validations that returns {boolean} */
const includesAnyOf = (valueToReview = '', arrayOfValues: string[] = []) => {
  for (const value of arrayOfValues) if (valueToReview.includes(value)) return true
  return false
}
const doFieldsMatch = (...args: string[]) => {
  const first = args[0]
  for (const arg of args) if (arg !== first) return false
  return true
}

const isNumberInRange = (
  number: number | string,
  range: [number?, number?] = [0, 100],
  includeLimits = true
) => {
  const [min, max] = range
  if (min == null || max == null) return false
  if (isNaN(Number(number))) return false
  return includeLimits
    ? Number(number) >= min && Number(number) <= max
    : Number(number) > min && Number(number) < max
}

const isExactNumber = (number: number | string) => {
  if (isNaN(Number(number))) return false
  return Number(number) % 1 === 0
}

/* validations that returns {string} - validation message */
const checkEmpty = (value = '') => {
  if (value.trim().length === 0) return ERR.required
  return ''
}
const checkName = (name = '') => {
  const nameWords = name.trim().split(' ')
  if (name?.trim()?.length == 0) return ERR.required
  const isValid = nameWords.length >= 2
  if (!isValid) return ERR.missingElement('apellido')
  return ''
}

const checkNameUpdate = (name = '', newName = '') => {
  if (doFieldsMatch(name, newName)) return ERR.name.invalidNewName
  return checkName(newName)
}

const checkEmail = (email = '') => {
  const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email === '') return ERR.required
  if (includesAnyOf(email, INVALID_CHARS.email))
    return ERR.invalidChars(INVALID_CHARS.email.join(''))
  if (!email.includes('@')) return ERR.missingElement('@')
  if (!email.includes('.')) return ERR.missingElement('dominio')
  if (!EMAIL_FORMAT_REGEX.test(email)) return ERR.invalidFormat
  return ''
}
const checkPass = (password = '') => {
  const MIN_LENGTH = 8
  if (password === '') return ERR.required
  if (password.length < MIN_LENGTH) return ERR.invalidLength.tooShort(MIN_LENGTH)
  if (!/[A-Z]/.test(password)) return ERR.mustHave('mayusculas')
  if (!/[a-z]/.test(password)) return ERR.mustHave('minusculas')
  if (!/\d/.test(password)) return ERR.mustHave('números')
  if (includesAnyOf(password, INVALID_CHARS.password))
    return ERR.invalidChars(INVALID_CHARS.password.join(''))
  return ''
}

const checkPassConfirm = (password = '', passwordConfirmation = '') => {
  const isValid = doFieldsMatch(password, passwordConfirmation)
  if (!isValid) return ERR.password.invalidConfirm
  return ''
}

const checkNum = (number: string | number) => {
  if (isNaN(Number(number))) return ERR.number.nan
  return ''
}

const checkNumExact = (number: number | string = 0) => {
  if (!isExactNumber(number)) return ERR.number.inexact
  return ''
}

const checkNumInRange = (
  number: number | string = 0,
  range: [number?, number?] = [],
  includeLimits = false
) => {
  if (!isNumberInRange(number, range, includeLimits)) return ERR.number.outOfRange(range)
  return ''
}

const checkNumMin = (number: number | string = 0, min = 0) => {
  if (isNaN(Number(number))) return ERR.number.nan
  if (Number(number) < min) return ERR.number.tooShort(min)
  return ''
}
const checkNumMax = (number: number | string, max: number) => {
  if (isNaN(Number(number))) return ERR.number.nan
  if (Number(number) > max) return ERR.number.tooLong(max)
  return ''
}

const checkLicenseDuration = (number = 0) => {
  let errors = []
  errors.push(checkNum(number))
  errors.push(checkNumInRange(number, [30, 365], true))
  errors.push(checkNumExact(number))
  let firstErr = errors.find((err) => err.trim().length !== 0)
  return firstErr ?? ''
}
const checkPrice = (number: number | string = 0) => {
  let errors = []
  errors.push(checkNum(number))
  errors.push(checkNumMin(number, 1))
  errors.push(checkNumExact(number))
  let firstErr = errors.find((err) => err.trim().length !== 0)
  return firstErr ?? ''
}
const checkInexactPrice = (number: string | number = 0) => {
  let errors = []
  errors.push(checkNum(number))
  errors.push(checkNumMin(number, 1))
  let firstErr = errors.find((err) => err.trim().length !== 0)
  return firstErr ?? ''
}
const checkAmount = (number: number | string = 0, range: [number?, number?] = []) => {
  let errors = []
  errors.push(checkNum(number))
  errors.push(checkNumInRange(number, range, true))
  errors.push(checkNumExact(number))
  let firstErr = errors.find((err) => err.trim().length !== 0)
  return firstErr ?? ''
}
const checkDate = (inputDate: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) return ERR.invalidFormat
  const [year, month, day] = inputDate.split('-').map(Number)
  if (isNaN(year) || isNaN(month) || isNaN(day)) return ERR.date.invalidTypes
  if (year < 2000) return ERR.date.invalidYear
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day)
    return ERR.date.invalid
  return ''
}

export {
  checkEmpty,
  checkName,
  checkNameUpdate,
  checkEmail,
  checkPass,
  checkPassConfirm,
  checkNum,
  checkNumExact,
  checkNumInRange,
  checkNumMin,
  checkNumMax,
  checkLicenseDuration,
  checkPrice,
  checkInexactPrice,
  checkAmount,
  checkDate
}
