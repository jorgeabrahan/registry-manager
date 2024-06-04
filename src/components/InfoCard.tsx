import React from 'react'

export const InfoCard: React.FC<InfoCardProps> = ({ children, title = '' }) => {
  return (
    <div>
      <h2 className='text-xs text-dove-gray-500'>{title}</h2>
      <p className='text-sm font-semibold'>{children}</p>
    </div>
  )
}

type InfoCardProps = {
  children: React.ReactNode
  title?: string
}
