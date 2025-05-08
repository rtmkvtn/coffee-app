import { toast, ToastOptions } from 'react-toastify'

const defaultOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
  closeButton: false,
  style: {
    background: 'rgba(35, 32, 28, 0.9)',
    color: '#006db6',
    fontFamily: 'TTFirs, sans-serif',
    fontWeight: 600,
  },
}

export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
  options?: ToastOptions
) => {
  const typeColors = {
    success: '#62ae1c',
    error: '#e63e20',
    warning: '#e94d13',
    info: '#006db6',
  }

  toast[type](message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      color: typeColors[type],
    },
    ...options,
  })
}

export const toastConfig: ToastOptions = {
  ...defaultOptions,
  pauseOnFocusLoss: true,
}
