import { memo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import AvailabilityDialog from '@components/availabilityDialog/AvailabilityDialog'
import Button from '@components/button/Button'
import OrderStatus from '@components/orderStatus/OrderStatus'
import { MENU_PATH } from '@constants/routes'
import { useCart } from '@context/cartContext'
import { useModal } from '@context/modalContext'
import { formatPrice } from '@lib/helpers'
import { showToast } from '@lib/toasts/toast'
import { IOrder } from '@models/index'
import {
  confirmRepeatOrder,
  repeatOrder,
  UnavailableItem,
} from '@services/ordersService'
import classNames from 'classnames'

import styles from './OrderItem.module.scss'

type Props = {
  order: IOrder
}

const OrderItem = memo(({ order }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setItems } = useCart()
  const { showModal } = useModal()
  const [repeatLoading, setRepeatLoading] = useState(false)

  const handleConfirm = async () => {
    const confirmResponse = await confirmRepeatOrder(order.id)

    if (confirmResponse.success) {
      setItems(confirmResponse.cart)
      navigate(MENU_PATH)
      return
    }

    // Availability changed — re-show dialog with updated data
    if (confirmResponse.unavailable.length > 0) {
      showAvailabilityDialog(confirmResponse.unavailable)
    } else {
      showToast(t('orders.repeat.noneAvailable'), 'error')
    }
  }

  const showAvailabilityDialog = (unavailableItems: UnavailableItem[]) => {
    showModal({
      type: 'custom',
      content: (
        <AvailabilityDialog
          unavailableItems={unavailableItems}
          onAddAvailable={handleConfirm}
        />
      ),
    })
  }

  const handleRepeatOrder = async () => {
    setRepeatLoading(true)
    try {
      const response = await repeatOrder(order.id)
      if (!response.success) {
        showToast(t('orders.repeat.failed'), 'error')
        return
      }

      const { available, unavailable } = response.data

      if (available.length === 0) {
        showToast(t('orders.repeat.noneAvailable'), 'error')
        return
      }

      if (unavailable.length === 0) {
        await handleConfirm()
        return
      }

      showAvailabilityDialog(unavailable)
    } catch {
      showToast(t('orders.repeat.failed'), 'error')
    } finally {
      setRepeatLoading(false)
    }
  }

  if (!order.items || order.items.length === 0) {
    return null
  }

  return (
    <div className={classNames(styles.wrapper, styles.draftBorder)}>
      <div className={styles.header}>
        <span className={styles.orderNumber}>
          {t('orders.orderNumber', { id: order.orderNumber })}
        </span>
        <OrderStatus status={order.state} />
      </div>
      <div className={styles.content}>
        <div className={styles.items}>
          {order.items.map((item) => {
            const lineTotal =
              (Number(item.unitPrice) + Number(item.ingredientsPrice)) *
              item.quantity

            return (
              <div key={item.id} className={styles.item}>
                <span className={classNames(styles.itemText, styles.itemQuant)}>
                  {item.quantity}x
                </span>
                <span className={classNames(styles.itemText, styles.itemName)}>
                  {/*need this span for dots positioning*/}
                  <span>{item.productSnapshot.name}</span>
                </span>
                <span className={classNames(styles.itemText, styles.itemPrice)}>
                  {formatPrice(lineTotal)}
                </span>
              </div>
            )
          })}
        </div>
        <div className={styles.dashDivider} />
        <div className={styles.footer}>
          <span className={classNames(styles.footerText, styles.total)}>
            {t('cart.total')}
          </span>
          <span className={classNames(styles.footerText, styles.totalPrice)}>
            {formatPrice(order.amount)}
          </span>
        </div>
      </div>
      {order.state === 'COMPLETED' && (
        <div className={styles.footer}>
          <Button
            className={styles.footerBtn}
            text={t('orders.repeatOrder')}
            mode="secondary"
            onClick={handleRepeatOrder}
            loading={repeatLoading}
          />
        </div>
      )}
    </div>
  )
})

OrderItem.displayName = 'OrderItem'

export default OrderItem
