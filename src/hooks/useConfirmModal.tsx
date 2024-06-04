import toast from 'react-hot-toast'
import { CustomClickable } from '../components'

export const useConfirmModal = () => {
  const showConfirmModal = ({
    message = '',
    onConfirm = () => {},
    onCancel = () => {},
    onBoth = () => {}
  }) => {
    toast(
      (t) => (
        <div>
          <p className='text-center mb-2' dangerouslySetInnerHTML={{ __html: message }}></p>
          <div className='flex items-center gap-2 justify-center'>
            <CustomClickable
              className='bg-mantis-600 border-mantis-800/50 text-white px-3 py-1'
              removePadding
              handleClick={() => {
                onConfirm()
                onBoth()
                toast.dismiss(t.id)
              }}
            >
              Aceptar
            </CustomClickable>
            <CustomClickable
              className='bg-wewak-600 border-wewak-800/50 text-white px-3 py-1'
              removePadding
              handleClick={() => {
                onCancel()
                onBoth()
                toast.dismiss(t.id)
              }}
            >
              Cancelar
            </CustomClickable>
          </div>
        </div>
      ),
      {
        duration: 8000
      }
    )
  }

  return {
    showConfirmModal
  }
}
