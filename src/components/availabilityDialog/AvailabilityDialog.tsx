import { FC } from 'react';



import { useTranslation } from 'react-i18next';



import Button from '@components/button/Button';
import { useModal } from '@context/modalContext';
import { UnavailableItem } from '@services/ordersService';



import styles from './AvailabilityDialog.module.scss';





interface AvailabilityDialogProps {
  unavailableItems: UnavailableItem[]
  onAddAvailable: () => void
}

const AvailabilityDialog: FC<AvailabilityDialogProps> = ({
  unavailableItems,
  onAddAvailable,
}) => {
  const { t } = useTranslation()
  const { hideModal } = useModal()

  const handleAddAvailable = () => {
    onAddAvailable()
    hideModal()
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t('orders.repeat.unavailableTitle')}</h2>
      <p className={styles.description}>
        {t('orders.repeat.unavailableDescription')}
      </p>
      <ul className={styles.list}>
        {unavailableItems.map((item, index) => (
          <li key={index} className={styles.listItem}>
            <span className={styles.itemName}>{item.name}</span>
          </li>
        ))}
      </ul>
      <div className={styles.buttons}>
        <Button
          text={t('orders.repeat.addAvailable')}
          mode="primary"
          onClick={handleAddAvailable}
          className={styles.button}
        />
        <Button
          text={t('modal.cancel')}
          mode="secondary"
          onClick={hideModal}
          className={styles.button}
        />
      </div>
    </div>
  )
}

export default AvailabilityDialog
