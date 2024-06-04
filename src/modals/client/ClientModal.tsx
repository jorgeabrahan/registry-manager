import { Tabs } from '@/components'
import { ArticleType, ClientType } from '@/lib/types/registries'
import React, { useState } from 'react'
import { ModalLayout } from '../ModalLayout'
import { ArticlesTab, EditTab } from './tabs'
import { ClientModalTabs } from '@/lib/enums'

export const ClientModal: React.FC<ClientModalProps> = ({
  handleHideModal = () => {},
  initialTab = ClientModalTabs.articles,
  client,
  handleRemoveArticles = () => {},
  handleUpdateClientName = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<ClientModalTabs>(initialTab)
  return (
    <ModalLayout className='relative h-[400px]' handleHideModal={handleHideModal}>
      <Tabs<typeof ClientModalTabs>
        className='absolute top-0 left-0 -translate-y-[calc(100%+1rem)]'
        tabs={ClientModalTabs}
        activeTab={activeTab}
        handleClick={(key) => setActiveTab(ClientModalTabs[key])}
      />
      {ClientModalTabs.edit === activeTab && (
        <EditTab client={client} handleUpdateClientName={handleUpdateClientName} />
      )}
      {ClientModalTabs.articles === activeTab && (
        <ArticlesTab client={client} handleRemoveArticles={handleRemoveArticles} />
      )}
    </ModalLayout>
  )
}

type ClientModalProps = {
  handleHideModal?: () => void
  initialTab?: ClientModalTabs
  client: ClientType
  handleRemoveArticles?: (purgedArticles: ArticleType[], priceOfArticlesToRemove: number) => void
  handleUpdateClientName?: (newName: string) => void
}
