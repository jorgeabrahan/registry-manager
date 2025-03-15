import { toast } from 'sonner'

export const useConfirmModal = () => {
  const showConfirmModal = ({ message = '', onConfirm = () => {} }) => {
    toast(message, {
      action: {
        label: 'Aceptar',
        onClick: onConfirm
      }
    })
  }

  return {
    showConfirmModal
  }
}
