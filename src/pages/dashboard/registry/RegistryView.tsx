import { RegistryForm } from './RegistryForm'
import { RegistryHistory } from './RegistryHistory'
import { RegistryTable } from './RegistryTable'

export const RegistryView: React.FC<RegistryViewProps> = ({
  year = '',
  month = '',
  handleUpdateBreadcrumbDate = () => {},
  handleClearRegistry = () => {},
  handleDisableBreadcrumb = () => {}
}) => {
  return (
    <>
      <RegistryForm
        handleClearRegistry={handleClearRegistry}
        handleDisableBreadcrumb={handleDisableBreadcrumb}
      />
      <RegistryTable
        year={year}
        month={month}
        handleUpdateBreadcrumbDate={handleUpdateBreadcrumbDate}
      />
      <RegistryHistory />
    </>
  )
}

type RegistryViewProps = {
  year?: string
  month?: string
  handleUpdateBreadcrumbDate: (year: string, month: string) => void
  handleClearRegistry: () => void
  handleDisableBreadcrumb: (isDisabled: boolean) => void
}
