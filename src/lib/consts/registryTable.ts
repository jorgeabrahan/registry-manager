const REGISTRY_TABLE_COLUMNS = (clientsAmount = 0) => [
  { id: '1', value: `Nombre (${clientsAmount})`, className: 'col-span-3 xl:col-span-4' },
  { id: '2', value: 'Artículos', className: 'col-span-2 xl:col-span-1' },
  { id: '3', value: 'Total', className: 'col-span-2 xl:col-span-2' }
]
const REGISTRY_TABLE_ROWS = (name = '', articles = 0, total = 0) => [
  { id: '1', value: `${name}`, className: 'col-span-3 xl:col-span-4' },
  { id: '2', value: `${articles}`, className: 'col-span-2 xl:col-span-1' },
  { id: '3', value: `${total}`, className: 'col-span-2 xl:col-span-2', isCurrency: true }
]
const REGISTRY_TABLE_ROW_BUTTONS = ({
  onArticles = () => {},
  articlesIcon,
  onEdit = () => {},
  editIcon,
  onRemove = () => {},
  removeIcon
}: RegistryTableRowButtonsProps) => [
  {
    id: '1',
    icon: articlesIcon,
    handleClick: onArticles
  },
  {
    id: '2',
    icon: editIcon,
    handleClick: onEdit
  },
  {
    id: '3',
    icon: removeIcon,
    handleClick: onRemove
  }
]

type RegistryTableRowButtonsProps = {
  onArticles: () => void
  articlesIcon: React.ReactElement
  onEdit: () => void
  editIcon: React.ReactElement
  onRemove: () => void
  removeIcon: React.ReactElement
}

const REGISTRIES_TABLE_COLUMNS = () => [
  { id: '1', value: `Nombre`, className: 'col-span-3 xl:col-span-4' },
  { id: '2', value: 'Artículos', className: 'col-span-2 xl:col-span-1' },
  { id: '3', value: 'Total', className: 'col-span-2 xl:col-span-2' }
]

const REGISTRIES_TABLE_ROW_BUTTONS = ({
  onArticles = () => {},
  articlesIcon
}: RegistriesTableRowButtonsProps) => [
  {
    id: '1',
    icon: articlesIcon,
    handleClick: onArticles
  }
]

type RegistriesTableRowButtonsProps = {
  onArticles: () => void
  articlesIcon: React.ReactElement
}

export {
  REGISTRY_TABLE_COLUMNS,
  REGISTRY_TABLE_ROWS,
  REGISTRY_TABLE_ROW_BUTTONS,
  REGISTRIES_TABLE_COLUMNS,
  REGISTRIES_TABLE_ROW_BUTTONS
}
