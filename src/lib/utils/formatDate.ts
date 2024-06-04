const extractFromDate = (ISODate = '') => {
  const date = new Date(ISODate)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return { day, month, year, hours, minutes, seconds }
}

const formatDateFriendly = (ISODate: string) => {
  const date = new Date(ISODate)
  const options = {
    weekday: 'long' as const,
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const,
    timeZone: 'UTC'
  }
  let formattedDate = date.toLocaleDateString('es-ES', options)
  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
  return formattedDate
}

const formatDate = (ISODate = '') => {
  const { day, month, year } = extractFromDate(ISODate)
  return `${day}/${month}/${year}`
}

const formatTime = (ISODate = '', includeSeconds = false) => {
  const { hours, minutes, seconds } = extractFromDate(ISODate)
  let timeFormat = `${hours}:${minutes}`
  if (includeSeconds) timeFormat += `:${seconds}`
  return timeFormat
}

const formatInputDate = (ISODate = '') => {
  const { year, month, day } = extractFromDate(ISODate)
  return `${year}-${month}-${day}`
}

const formatDateTime = (ISODate = '') => `${formatDate(ISODate)} ${formatTime(ISODate)}`

export {
  extractFromDate,
  formatDateFriendly,
  formatDate,
  formatTime,
  formatInputDate,
  formatDateTime
}
