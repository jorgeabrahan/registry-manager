import { RegistryForm } from './RegistryForm'
import { RegistryHistory } from './RegistryHistory'
import { RegistryTable } from './RegistryTable'

export const RegistryView: React.FC<RegistryViewProps> = ({
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
      <RegistryTable handleUpdateBreadcrumbDate={handleUpdateBreadcrumbDate} />
      <RegistryHistory />
    </>
  )
}

type RegistryViewProps = {
  handleUpdateBreadcrumbDate: (year: string, month: string) => void
  handleClearRegistry: () => void
  handleDisableBreadcrumb: (isDisabled: boolean) => void
}
