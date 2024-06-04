import React from 'react'
import { navDropdownsStore } from './navDropdownsStore'

export const NavButton: React.FC<NavButtonProps> = ({
  icon,
  info = '',
  className = '',
  handleClick = () => {},
  isDisabled = false
}) => {
  const { setActiveDropdown } = navDropdownsStore()
  return (
    <button
      className={`flex items-center justify-center p-4 md:p-5 rounded-full bg-white/5 border border-solid border-tundora-800 hover:shadow-xl hover:shadow-white/5 transition-shadow duration-300 ${className} ${
        isDisabled && 'opacity-50 pointer-events-none'
      }`}
      title={info}
      onClick={(e) => {
        if (isDisabled) return
        setActiveDropdown('') // close any opened dropdown
        handleClick(e)
      }}
    >
      {icon}
    </button>
  )
}

type NavButtonProps = {
  icon: React.ReactElement
  info?: string
  className?: string
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  isDisabled?: boolean
}
