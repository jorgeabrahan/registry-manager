import React from 'react'
import { navDropdownsStore } from './navDropdownsStore'

export const NavDropdown: React.FC<NavDropdownProps> = ({
  children,
  icon,
  text = '',
  id = '',
  info = '',
  className = '',
  isDisabled = false
}) => {
  const { activeDropdown, setActiveDropdown } = navDropdownsStore()
  const handleToggleDropdown = () => {
    if (isDisabled) return
    if (activeDropdown === id) return setActiveDropdown('')
    if (id != null) setActiveDropdown(id)
  }
  return (
    <div className='relative'>
      <button
        className={`flex items-center gap-3 p-4 md:px-6 md:py-3 rounded-full bg-white/5 border border-solid border-tundora-800 hover:shadow-xl hover:shadow-white/5 transition-shadow duration-300 ${
          isDisabled && 'opacity-50 pointer-events-none'
        }`}
        title={info}
        onClick={handleToggleDropdown}
        disabled={isDisabled}
      >
        {icon}
        <div className='hidden md:grid place-items-start'>
          <p className='text-xs text-dove-gray-500'>{info}</p>
          <p className='font-semibold text-sm'>{text}</p>
        </div>
      </button>
      {activeDropdown === id && (
        <div
          className={`absolute top-[calc(100%+0.8rem)] bg-shark-900 p-3 md:px-6 md:py-4 border border-solid border-white/5 rounded-lg z-10 ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

type NavDropdownProps = {
  children: React.ReactNode
  icon: React.ReactElement
  text?: string
  id?: string
  info?: string
  className?: string
  isDisabled?: boolean
}
