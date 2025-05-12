import { FC } from 'react'

import Button from '@components/button/Button'
import { useModal } from '@context/modalContext'

import styles from './PaymentMethodModal.module.scss'

interface PaymentMethodModalProps {
  onCashPayment: () => void
  onCardPayment: () => void
}

const PaymentMethodModal: FC<PaymentMethodModalProps> = ({
  onCashPayment,
  onCardPayment,
}) => {
  const { hideModal } = useModal()

  const handleCashPayment = () => {
    onCashPayment()
    hideModal()
  }

  const handleCardPayment = () => {
    onCardPayment()
    hideModal()
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Выберите способ оплаты</h2>
      <div className={styles.buttons}>
        <Button
          text="Оплата на кассе"
          mode="secondary"
          onClick={handleCashPayment}
          className={styles.button}
        />
        <Button
          text="Картой"
          mode="primary"
          onClick={handleCardPayment}
          className={styles.button}
        />
      </div>
    </div>
  )
}

export default PaymentMethodModal
