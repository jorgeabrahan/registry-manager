const LICENSES_ERRORS = {
  create: 'Error al crear la licencia.',
  getOne: 'Error al obtener la licencia.',
  getMany: 'Error al obtener las licencias.',
  remove: 'Error al eliminar la licencia.',
  update: 'Error al actualizar la licencia.'
}

const LICENSES_SUCCESS = {
  create: (key = '') => `Licencia creada con exito ${key}.`,
  getOne: 'Licencia obtenida con exito.',
  getMany: 'Licencias obtenidas con exito.',
  remove: 'Licencia eliminada con exito.',
  update: 'Licencia actualizada con exito.'
}

/* on GET single license requests */
const LICENSES_STATUS = {
  isAlreadyInUse: (key = '') => `La licencia ${key} ya está en uso.`,
  isExpired: (key = '') => `La licencia ${key} ya está expirada.`,
  isUnlimited: (key = '') => `La licencia ${key} es ilimitada.`,
  isActive: (key = '') => `La licencia ${key} ya está activada.`,
  isInactive: (key = '') => `La licencia ${key} no está activada.`
}

const LICENSES_LOADING = {
  create: 'Espera mientras creamos la licencia.',
  getOne: 'Espera mientras obtenemos la licencia.',
  getMany: 'Espera mientras obtenemos las licencias.',
  remove: 'Espera mientras eliminamos la licencia.',
  update: 'Espera mientras actualizamos la licencia.'
}

const LICENSES_MESSAGES = {
  empty: 'No hay licencias que mostrar.'
}

export { LICENSES_ERRORS, LICENSES_SUCCESS, LICENSES_STATUS, LICENSES_LOADING, LICENSES_MESSAGES }
