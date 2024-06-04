const TRANSACTION_ERRORS = {
  create: 'Error al crear la transacción.',
  getOne: 'Error al obtener la transacción.',
  getYears: 'Error al obtener los años de las transacciones.',
  getManyByMonth: (year = '', month = '') =>
    `Error al obtener las transacciones de ${month.toLowerCase()} del ${year}.`,
  remove: 'Error al eliminar la transacción.',
  removeMany: 'Error al eliminar las transacciones.',
  update: 'Error al actualizar la transacción.'
}

const TRANSACTION_SUCCESS = {
  create: 'Transacción creada con exito.',
  getOne: 'Transacción obtenida con exito.',
  getYears: 'Años de las transacciones obtenidos con exito',
  getManyByMonth: (year = '', month = '') =>
    `Transacciones de ${month.toLowerCase()} del ${year} fueron obtenidas con exito.`,
  remove: 'Transacción eliminada con exito.',
  removeMany: 'Transacciones eliminadas con exito.',
  update: 'Transacción actualizada con exito.'
}

export { TRANSACTION_ERRORS, TRANSACTION_SUCCESS }
