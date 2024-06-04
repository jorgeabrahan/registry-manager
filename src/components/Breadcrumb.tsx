import { NavArrowRightIcon } from '../assets/icons'

const clearItemsFromIndex = <BreadcrumbItemIdType,>(
  items: BreadcrumbItem<BreadcrumbItemIdType>[],
  index: number
) => {
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

export const Breadcrumb = <BreadcrumbItemIdType extends string>({
  className = '',
  items = [],
  handleClick = () => {},
  isInteractionDisabled = false
}: BreadcrumbProps<BreadcrumbItemIdType>) => {
  // find index of first empty item
  const emptyIndex = items.findIndex((item) => !item.value)
  const isAnyItemEmpty = emptyIndex !== -1
  const clearedItems: BreadcrumbItem<BreadcrumbItemIdType>[] = isAnyItemEmpty
    ? clearItemsFromIndex<BreadcrumbItemIdType>(items, emptyIndex)
    : items
  const isBeforeLast = (index = 0) => {
    return isAnyItemEmpty ? index < emptyIndex - 1 : index < clearedItems.length - 1
  }
  const isLast = (index = 0) => {
    return isAnyItemEmpty ? index === emptyIndex - 1 : index === clearedItems.length - 1
  }
  return (
    <nav>
      <ul className={`overflow-x-scroll hide-scrollbar flex ${className}`}>
        {clearedItems?.map((item, index) => {
          return (
            <li
              className={`flex items-center text-dove-gray-200 ${
                isInteractionDisabled && 'opacity-50'
              }`}
              key={item?.id}
            >
              {isLast(index) ? (
                <span className='text-sm w-max font-bold'>{item?.value}</span>
              ) : (
                <button
                  onClick={() => {
                    if (isInteractionDisabled) return
                    const newItems = clearItemsFromIndex(clearedItems, items.indexOf(item) + 1)
                    handleClick(item, newItems)
                  }}
                  className={`text-sm hover:underline w-max ${
                    isInteractionDisabled && 'pointer-events-none'
                  }`}
                  disabled={isInteractionDisabled}
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

interface BreadcrumbItem<BreadcrumbItemIdType> {
  id: BreadcrumbItemIdType
  value: string
}

interface BreadcrumbProps<BreadcrumbItemIdType> {
  className?: string
  items?: BreadcrumbItem<BreadcrumbItemIdType>[]
  handleClick?: (
    item: BreadcrumbItem<BreadcrumbItemIdType>,
    newItems: BreadcrumbItem<BreadcrumbItemIdType>[]
  ) => void
  isInteractionDisabled?: boolean
}
