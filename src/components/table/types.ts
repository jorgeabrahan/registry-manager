import React from "react"

export type TableItemType = {
  id: string
  value: string
  className?: string
  isCurrency?: boolean
}

export type TableButtonType = {
  id: string
  icon: React.ReactNode,
  handleClick: () => void
}
