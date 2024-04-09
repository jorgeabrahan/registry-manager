import PropTypes from 'prop-types'

export const Tabs = ({ className = '', tabs = {}, activeTab = '', handleClick = () => {} }) => {
  return (
    <header className={`${className} w-max px-[10px] py-2 rounded-full flex bg-shark-900 border border-solid border-white/5`}>
        {Object.keys(tabs).map((key) => (
          <button
            className={`text-sm md:text-base px-4 py-1 rounded-full ${
              tabs[key] === activeTab && 'bg-shark-800'
            }`}
            key={key}
            onClick={() => handleClick(key)}
          >
            {tabs[key]}
          </button>
        ))}
      </header>
  );
}

Tabs.propTypes = {
  className: PropTypes.string,
  tabs: PropTypes.object,
  activeTab: PropTypes.string,
  handleClick: PropTypes.func
}
