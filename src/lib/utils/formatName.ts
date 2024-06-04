export const capitalize = (string = '') => {
  return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`
}
export const convertToSingleSpaced = (string = '') => {
  return string.trim().replace(/\s+/gi, ' ')
}
export const formatName = (name = '') => {
  const names = convertToSingleSpaced(name).split(' ')
  const capitalizedNames = names.map(name => capitalize(name))
  return capitalizedNames.join(' ')
}
