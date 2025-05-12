import { FC } from 'react'

import { getOrderStatusText } from '@lib/helpers'
import { OrderStatus as OrderStatusType } from '@models/index'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './OrderStatus.module.scss'

type OrderStatusProps = {
  status: OrderStatusType
  className?: string
}

const OrderStatus: FC<OrderStatusProps> = ({ status, className }) => {
  const getStatusColor = (state: OrderStatusType) => {
    switch (state) {
      case 'waitingForPayment':
        return styles.waiting
      case 'paymentProcessing':
        return styles.processing
      case 'paid':
        return styles.paid
      case 'preparing':
        return styles.preparing
      case 'completed':
        return styles.completed
      case 'canceled':
        return styles.canceled
      default:
        return ''
    }
  }

  const getStatusIcon = (state: OrderStatusType) => {
    switch (state) {
      case 'waitingForPayment':
        return <Icon type="collectCoins" size={16} />
      case 'paymentProcessing':
      case 'paid':
        return <Icon type="slip" size={16} />
      case 'preparing':
        return <Icon type="clock" size={16} />
      case 'completed':
        return <Icon type="check" size={16} />
      case 'canceled':
        return <Icon type="close" size={16} />
      default:
        return null
    }
  }

  return (
    <div
      className={classNames(styles.status, getStatusColor(status), className)}
    >
      {getStatusIcon(status)}
      {getOrderStatusText(status)}
    </div>
  )
}

export default OrderStatus
