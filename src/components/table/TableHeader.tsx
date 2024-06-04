import React from 'react'
import { TableItemType } from './types'

export const TableHeader: React.FC<TableHeaderProps> = ({ items = [] }) => {
  return (
    <header className='grid gap-2 py-2 sm:py-3 px-2 sm:px-5 bg-[#2a2a2a] border border-solid border-tundora-800 rounded-lg grid-cols-7'>
      {items.map((item) => {
        return (
          <h2
            key={item.id}
            className={`sm:text-lg font-semibold text-dove-gray-200 ${item.className}`}
          >
            {item.value}
          </h2>
        )
      })}
    </header>
  )
}

type TableHeaderProps = {
  items: TableItemType[]
}
