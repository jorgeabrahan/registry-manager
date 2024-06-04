export const Tabs = <T extends Record<string, string> = {}>({
  className = '',
  tabs,
  activeTab = '',
  handleClick = () => {},
  isDisabled = false,
  disabledTabs = []
}: TabsProps<T>) => {
  if (!tabs) {
    return null
  }
  return (
    <section
      className={`${className} max-w-full w-max px-[10px] py-2 rounded-full bg-shark-900 border border-solid border-white/5 overflow-x-auto hide-scrollbar ${
        isDisabled && 'opacity-50'
      }`}
    >
      <div className='flex items-center w-max'>
        {Object.keys(tabs).map((key) => (
          <button
            className={`text-sm md:text-base px-4 py-1 rounded-full ${
              tabs[key] === activeTab && 'bg-shark-800'
            } ${isDisabled || (disabledTabs?.includes(key) && 'pointer-events-none')} ${
              disabledTabs?.includes(key) && 'opacity-50'
            }`}
            key={key}
            onClick={() => handleClick(key)}
          >
            {tabs[key]}
          </button>
        ))}
      </div>
    </section>
  )
}

interface TabsProps<T extends Record<string, string>> {
  className?: string
  tabs?: T
  activeTab?: string
  handleClick?: (key: keyof T) => void
  isDisabled?: boolean
  disabledTabs?: string[]
}
