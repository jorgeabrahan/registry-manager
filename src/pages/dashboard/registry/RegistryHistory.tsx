import { NavArrowDownIcon, NavArrowUpIcon } from '@/assets/icons'
import { currentRegistryStore } from './currentRegistryStore'
import { useState } from 'react'

export const RegistryHistory = () => {
  const { currentRegistry } = currentRegistryStore()
  const [showHistory, setShowHistory] = useState(false)
  const isHistoryEmpty = currentRegistry.history.length === 0
  return (
    <>
      <article
        className={`bg-[#2a2a2a] border border-solid border-tundora-800 rounded-xl text-white fixed transition-[bottom] duration-500 ${
          showHistory ? 'bottom-3' : 'bottom-[-315px]'
        }`}
      >
        <h2 className='text-2xl font-sans font-semibold'>
          <button
            className='w-full text-left p-3 flex items-center justify-between'
            onClick={() => setShowHistory((prev) => !prev)}
          >
            <span>Historial</span>
            {showHistory ? <NavArrowDownIcon /> : <NavArrowUpIcon />}
          </button>
        </h2>
        <ul
          className={`flex flex-col gap-5 mx-3 mb-3 w-[280px] sm:w-[300px] md:w-[400px] h-[300px] overflow-y-auto ${
            isHistoryEmpty ? 'justify-center' : 'pl-4 border-l-2 border-solid border-shark-600'
          }`}
        >
          {isHistoryEmpty && (
            <p className='text-center text-sm text-white/70'>No hay elementos en el historial</p>
          )}
          {!isHistoryEmpty &&
            currentRegistry.history.map((item) => (
              <li key={item.id} className='font-mono relative leading-5 text-dove-gray-200'>
                <div className='w-3 h-3 bg-shark-600 rounded-full border-2 border-solid border-shark-600 absolute left-[-1.45rem] top-[50%] translate-y-[-50%]'></div>
                {item.action}
              </li>
            ))}
        </ul>
      </article>
    </>
  )
}
