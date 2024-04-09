import PropTypes from 'prop-types'
import { NavArrowRightIcon } from '../assets/icons'

const clearItemsFromIndex = (items, index) => {
  return (
    items?.map((item, currentIndex) => {
      if (currentIndex < index) return item
      return {
        ...item,
        value: ''
      }
    }) ?? []
  )
}

export const Breadcrumb = ({
  className = '',
  items = [],
  handleClick = () => {}
}) => {
  // find index of first empty item
  const emptyIndex = items.findIndex((item) => !item.value)
  const isAnyItemEmpty = emptyIndex !== -1
  const clearedItems = isAnyItemEmpty
    ? clearItemsFromIndex(items, emptyIndex)
    : items
  const isBeforeLast = (index = 0) => {
    return isAnyItemEmpty
      ? index < emptyIndex - 1
      : index < clearedItems.length - 1
  }
  const isLast = (index = 0) => {
    return isAnyItemEmpty
      ? index === emptyIndex - 1
      : index === clearedItems.length - 1
  }
  return (
    <nav>
      <ul className={`overflow-x-scroll hide-scrollbar flex ${className}`}>
        {clearedItems?.map((item, index) => {
          return (
            <li className='flex items-center text-dove-gray-200' key={item?.id}>
              {isLast(index) ? (
                <span className='text-sm w-max font-bold'>
                  {item?.value}
                </span>
              ) : (
                <button
                  onClick={() => {
                    const newItems = clearItemsFromIndex(
                      clearedItems,
                      items.indexOf(item) + 1
                    )
                    handleClick(item, newItems)
                  }}
                  className='text-sm hover:underline w-max'
                >
                  {item?.value}
                </button>
              )}
              {isBeforeLast(index) && <NavArrowRightIcon />}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

Breadcrumb.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array,
  handleClick: PropTypes.func
}
