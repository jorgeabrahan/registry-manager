import { DebugErrorType } from "@/lib/types"
import { AUTH_ERRORS, AUTH_HTTP_ERRORS } from "./errors"

export const getUserFriendlyErrorMessage: getUserFriendlyErrorMessageType = (error) => {
  if (typeof error.code === 'string') return AUTH_ERRORS[error.code] ?? error?.message
  if (typeof error.code === 'number') return AUTH_HTTP_ERRORS[error.code] ?? error?.message
  return error?.message ?? ''
}

type getUserFriendlyErrorMessageType = (error: DebugErrorType) => string
