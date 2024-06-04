import React from 'react'

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  as: Tag = 'section',
  className = ''
}) => {
  return <Tag className={`max-w-[1200px] w-full mx-auto px-2 ${className}`}>{children}</Tag>
}

type LayoutWrapperProps = {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
}
