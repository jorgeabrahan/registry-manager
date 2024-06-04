const REGISTRY_ERRORS = {
  create: 'Error al crear el registro.',
  getOne: 'Error al obtener el registro.',
  getYears: 'Error al obtener los años de los registros.',
  getManyByMonth: (year = '', month = '') =>
    `Error al obtener los registros de ${month.toLowerCase()} del ${year}.`,
  remove: 'Error al eliminar el registro.',
  removeMany: 'Error al eliminar los registros.',
  update: 'Error al actualizar el registro.'
}

const REGISTRY_SUCCESS = {
  create: 'Registro creado con exito.',
  getOne: 'Registro obtenido con exito.',
  getYears: 'Años de los registros obtenidos con exito',
  getManyByMonth: (year = '', month = '') =>
    `Registros de ${month.toLowerCase()} del ${year} fueron obtenidos con exito.`,
  remove: 'Registro eliminado con exito.',
  removeMany: 'Registros eliminados con exito.',
  update: 'Registro actualizado con exito.'
}

const CLIENTS_SUCCESS = {
  create: 'Clientes guardados con exito.',
  getMany: 'Clientes obtenidos con exito.'
}

const CLIENTS_ERRORS = {
  create: 'Error al guardar clientes.',
  duplicate: (name = '') => `Error al guardar cliente ${name}, ya existe en la base de datos.`,
  getMany: 'Error al obtener clientes.'
}

export { REGISTRY_ERRORS, REGISTRY_SUCCESS, CLIENTS_SUCCESS, CLIENTS_ERRORS }
