import { useEffect, useRef } from 'react'

import Button from '@components/button/Button'
import { useModal } from '@context/modalContext'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './Modal.module.scss'

const Modal = () => {
  const { modal, isOpen, hideModal } = useModal()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideModal()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        hideModal()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, hideModal])

  if (!isOpen || !modal) return null

  const handleConfirm = () => {
    modal.onConfirm?.()
    hideModal()
  }

  const handleCancel = () => {
    modal.onCancel?.()
    hideModal()
  }

  return (
    <div className={styles.overlay}>
      <div
        ref={modalRef}
        className={classNames(styles.modal, styles[`type_${modal.type}`])}
      >
        {modal.type !== 'confirm' && (
          <button className={styles.closeButton} onClick={hideModal}>
            <Icon type="close" size={12} />
          </button>
        )}

        {modal.title && <h2 className={styles.title}>{modal.title}</h2>}

        <div className={styles.content}>{modal.content}</div>

        {modal.type !== 'custom' && (
          <div className={styles.footer}>
            <Button
              text={modal.confirmText || 'OK'}
              mode="primary"
              onClick={handleConfirm}
              className={styles.button}
            />
            {modal.type === 'confirm' && (
              <Button
                text={modal.cancelText || 'Отмена'}
                mode="danger"
                onClick={handleCancel}
                className={styles.button}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
