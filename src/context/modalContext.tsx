import { createContext, ReactNode, useContext, useState } from 'react'

type ModalType = 'confirm' | 'alert' | 'custom'

interface ModalOptions {
  type: ModalType
  title?: string
  content: ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void
  hideModal: () => void
  modal: ModalOptions | null
  isOpen: boolean
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const showModal = (options: ModalOptions) => {
    setModal(options)
    setIsOpen(true)
  }

  const hideModal = () => {
    setIsOpen(false)
    setModal(null)
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modal, isOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
