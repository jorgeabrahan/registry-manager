import React from 'react'
import { formatHNL } from '../../lib/utils'
import { SecondaryClickable } from '../SecondaryClickable'
import { TableButtonType, TableItemType } from './types'

export const TableRow: React.FC<TableRowProps> = ({ items = [], buttons = [] }) => {
  return (
    <div className='grid grid-cols-7 gap-2 py-3 px-2 sm:px-5 relative group'>
      {items.map((item) => {
        const isNumber = !isNaN(Number(item.value))
        return (
          <p
            key={item.id}
            className={`text-dove-gray-100 sm:text-lg ${isNumber && 'font-mono'} ${item.className}`}
          >
            {item.isCurrency && isNumber ? formatHNL(Number(item.value)) : item.value}
          </p>
        )
      })}
      <div className='-md:group-hover:flex hidden md:flex absolute top-[50%] -translate-y-[50%] right-5 items-center gap-2'>
        {buttons.map((button) => (
          <SecondaryClickable
            key={button.id}
            handleClick={button.handleClick}
            className='text-sm px-3 py-2'
            removePadding
          >
            {button.icon}
          </SecondaryClickable>
        ))}
      </div>
    </div>
  )
}

type TableRowProps = {
  items: TableItemType[]
  buttons: TableButtonType[]
}
