const AUTH_ERRORS: Record<string, string> = {
  'auth/email-already-in-use':
    'El correo proporcionado ya está siendo utilizado por un usuario existente.',
  'auth/invalid-password':
    'El valor proporcionado para la contraseña del usuario no es válido, debe tener por lo menos 6 caracteres.',
  'auth/operation-not-allowed':
    'La operación no está permitida, por favor habilita esta operación en la consola de Firebase.',
  'auth/weak-password':
    'La contraseña debe tener al menos 6 caracteres y una combinación de letras, números y símbolos.',
  'auth/invalid-email':
    'El correo electrónico proporcionado no es válido. Por favor, proporciona un correo electrónico válido.',
  'auth/user-not-found':
    'No se encontró ningún usuario con el correo electrónico proporcionado.',
  'auth/wrong-password':
    'La contraseña es incorrecta. Por favor, verifica tu contraseña e intenta de nuevo.',
  'auth/user-disabled':
    'La cuenta del usuario ha sido deshabilitada por un administrador.',
  'auth/too-many-requests':
    'Se bloquearon las solicitudes de este dispositivo debido a la actividad inusual. Intenta de nuevo más tarde.'
}

const AUTH_HTTP_ERRORS: Record<number, string> = {
  400: 'Las credenciales proporcionadas no son válidas. Por favor, verifica tu correo electrónico y contraseña.'
}

const CHANGE_PASS_ERRORS = {
  noUser: 'No se pudo obtener la información del usuario. Intenta mas tarde.',
  reauthenticateError: 'Error al reautenticar el usuario. Intenta mas tarde.',
  updateError: 'No se pudo actualizar la contraseña. Intena mas tarde.',
  success: 'La contraseña se actualizo exitosamente.'
}

export { AUTH_ERRORS, AUTH_HTTP_ERRORS, CHANGE_PASS_ERRORS }
