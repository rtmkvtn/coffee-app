import { createElement } from 'react'

import { toast, ToastOptions } from 'react-toastify'

import checkCircleIcon from '@assets/images/ui/check-circle.svg'
import warningCircleIcon from '@assets/images/ui/warning-circle.svg'

const defaultOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
  closeButton: false,
  style: {
    color: '#fff',
  },
}

const toastIcons: Record<'success' | 'error' | 'info' | 'warning', string> = {
  success: checkCircleIcon,
  error: warningCircleIcon,
  warning: warningCircleIcon,
  info: checkCircleIcon,
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
    icon: () =>
      createElement('img', {
        src: toastIcons[type],
        alt: type,
        width: 24,
        height: 24,
      }),
    style: {
      ...defaultOptions.style,
      background: typeColors[type],
    },
    ...options,
  })
}

export const toastConfig: ToastOptions = {
  ...defaultOptions,
  pauseOnFocusLoss: true,
}
