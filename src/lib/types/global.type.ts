import { MessageTypes } from "@/lib/enums"

export type AnchorTargetType = '_blank' | '_self' | '_parent' | '_top'
export type AnchorRelType = 'noreferrer' | 'noopener' | 'nofollow'

export type ButtonActionType = 'button' | 'submit' | 'reset'

export type InputType = 'text' | 'password' | 'email' | 'search' | 'date' | 'datetime-local' | 'url' | 'number' | 'tel'

export type DebugErrorType = {
  code: string | number,
  message: string
}

export type FormMessageType = {
  type: MessageTypes,
  text: string
}
