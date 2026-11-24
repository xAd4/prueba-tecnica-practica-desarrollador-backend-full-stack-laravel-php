import Swal from 'sweetalert2'
import { theme } from '../theme/theme'

export const showErrorAlert = (message: string, title = 'Error') =>
  Swal.fire({ title, text: message, icon: 'error', confirmButtonColor: theme.colors.primary })

export const showSuccessToast = (message: string) =>
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  })

export const confirmDanger = async (title: string, text: string): Promise<boolean> => {
  const { isConfirmed } = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: theme.colors.danger,
    cancelButtonColor: theme.colors.textMuted,
    reverseButtons: true,
    focusCancel: true,
  })
  return isConfirmed
}
