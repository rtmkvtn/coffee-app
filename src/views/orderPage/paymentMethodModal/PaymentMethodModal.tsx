import { FC } from 'react'

import { useTranslation } from 'react-i18next'

import Button from '@components/button/Button'
import { useModal } from '@context/modalContext'

import styles from './PaymentMethodModal.module.scss'

interface PaymentMethodModalProps {
  onCashPayment: () => void
  onCardPayment: () => void
}

const PaymentMethodModal: FC<PaymentMethodModalProps> = ({
  onCashPayment,
  // onCardPayment,
}) => {
  const { t } = useTranslation()
  const { hideModal } = useModal()

  const handleCashPayment = () => {
    onCashPayment()
    hideModal()
  }

  // const handleCardPayment = () => {
  //   onCardPayment()
  //   hideModal()
  // }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t('payment.selectMethod')}</h2>
      <div className={styles.buttons}>
        <Button
          text={t('payment.cashAtCounter')}
          mode="success"
          onClick={handleCashPayment}
          className={styles.button}
        />
        {/* <Button
          text={t('payment.card')}
          mode="primary"
          onClick={handleCardPayment}
          className={styles.button}
        /> */}
      </div>
    </div>
  )
}

export default PaymentMethodModal
