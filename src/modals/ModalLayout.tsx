import { useEffect } from 'react'
import { XMarkIcon } from '../assets/icons'

export const ModalLayout: React.FC<ModalLayoutProps> = ({
  children,
  id = 'modal-wrapper',
  handleHideModal = () => {},
  shouldAllowClose = true,
  isExternalCloseEnabled = true,
  className = '',
  hasCustomWidth = false,
  isNested = false
}) => {
  useEffect(() => {
    if (!isNested) document.body.style.overflowY = 'hidden'
    return () => {
      if (!isNested) document.body.style.overflowY = 'auto'
    }
  }, [isNested])
  const handleModalExternalClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (!isExternalCloseEnabled || !shouldAllowClose) return
    const target = e.target as HTMLElement;
    const dataId = target?.getAttribute('data-id') ?? ''
    if (dataId !== id) return
    handleHideModal()
  }
  return (
    <section
      className='fixed z-20 w-full h-screen inset-0 flex justify-center items-center bg-shark-950/90 px-2 sm:px-4'
      data-id={id}
      onClick={handleModalExternalClick}
    >
      <button
        className='absolute top-3 right-2 sm:right-4 text-white'
        onClick={() => {
          if (!shouldAllowClose) return
          handleHideModal()
        }}
      >
        <XMarkIcon />
      </button>
      <div
        className={`bg-shark-900 mx-auto p-3 sm:p-5 rounded-2xl w-full ${
          !hasCustomWidth && 'max-w-[600px]'
        } ${className}`}
      >
        {children}
      </div>
    </section>
  )
}

type ModalLayoutProps = {
  children: React.ReactNode
  id?: string,
  handleHideModal?: () => void,
  shouldAllowClose?: boolean,
  isExternalCloseEnabled?: boolean,
  className?: string,
  hasCustomWidth?: boolean,
  isNested?: boolean
}
