import { LICENSES_PURCHASE_OPTIONS } from "../constants"

const WA_LINK_BASE_URI = 'https://api.whatsapp.com/send?phone=50433960187&text='

const getPurchaseLicenseLink = (license: typeof LICENSES_PURCHASE_OPTIONS[0]) => {
  const { name, price } = license
  const message = `Quiero adquirir el plan ${name.toLowerCase()} de la herramienta web de administración de registros con un costo de ${price} HNL.`
  return `${WA_LINK_BASE_URI}${encodeURIComponent(message)}`
}

const getRenewalLicenseLink = (license: typeof LICENSES_PURCHASE_OPTIONS[0]) => {
  const { name, price } = license
  const message = `Quiero renovar el plan ${name.toLowerCase()} de la herramienta web de administración de registros con un costo de ${price} HNL.`
  return `${WA_LINK_BASE_URI}${encodeURIComponent(message)}`
}

export { getPurchaseLicenseLink, getRenewalLicenseLink }
