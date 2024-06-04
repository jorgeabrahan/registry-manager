const ERR = {
  required: 'El campo es requerido.',
  invalidChars: (chars = '') => `El campo no debe contener caracteres como: ${chars}.`,
  invalidFormat: 'El campo tiene un formato invalido.',
  missingElement: (element = '') => `El campo debe contener un ${element}.`,
  mustHave: (element = '') => `El campo debe contener ${element}.`,
  invalidLength: {
    tooShort: (min = 0) => `El campo debe contener por lo menos ${min} caracteres.`,
    tooLong: (max = 0) => `El campo no debe contener mas de ${max} caracteres.`,
    outOfRange: (range = []) => `El campo debe contener entre ${range[0]} y ${range[1]} caracteres.`
  },
  name: {
    invalidNewName: 'El nombre no ha cambiado.'
  },
  password: {
    invalidConfirm: 'El campo no coincide con la contraseña.'
  },
  number: {
    nan: 'El campo debe ser un número.',
    inexact: 'El campo debe ser un número exacto.',
    outOfRange: (range: [number?, number?] = []) =>
      `El campo debe ser un número entre ${range[0]} y ${range[1]}.`,
    tooShort: (min = 0) => `El campo debe ser un número mayor a ${min}.`,
    tooLong: (max = 0) => `El campo debe ser un número menor a ${max}.`
  },
  date: {
    invalid: 'El valor ingresado no es una fecha válida.',
    invalidTypes: 'El día, mes y año deben ser números válidos.',
    invalidYear: 'El año debe ser 2000 o mayor.',
  }
}

const INVALID_CHARS = {
  email: ['/', '(', ')', '<', '>', '@,', ';', ':', '\\', '"', '[', ']', 'ç', '%', '&'],
  password: ['!', '@', '#', '^', '*']
}

export { ERR, INVALID_CHARS }
