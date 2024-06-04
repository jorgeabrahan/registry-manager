import { useState } from 'react'

export const useBreadcrumb = <BreadcrumbItemIdType>(
  items: { id: BreadcrumbItemIdType; value: string }[] = []
) => {
  const [breadcrumb, setBreadcrumb] = useState<{ id: BreadcrumbItemIdType; value: string }[]>(items)
  const setItem = (id = '', value = '') => {
    setBreadcrumb((prevState) => [
      ...prevState.map((obj) => {
        if (obj.id !== id) return obj
        return {
          ...obj,
          value: value
        }
      })
    ])
  }

  const getItem = (id = '') => {
    for (const item of breadcrumb) {
      if (item.id === id) return item?.value
    }
    return ''
  }

  const isCompleteTil = (id = '') => {
    for (const item of breadcrumb) {
      if (item.id === id) return item.value.trim().length === 0
      if (item.value.trim().length === 0) return false
    }
  }

  const isPathComplete = () => {
    for (const item of breadcrumb) {
      if (item.value.trim().length === 0) return false
    }
    return true
  }
  return {
    breadcrumb,
    setBreadcrumb,
    setItem,
    getItem,
    isCompleteTil,
    isPathComplete
  }
}
