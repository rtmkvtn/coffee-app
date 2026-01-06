import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'

import { useTranslation } from 'react-i18next'

import Button from '@components/button/Button'
import { CART_CONSTANTS } from '@constants/cart'
import { useCart } from '@context/cartContext'
import { useMenu } from '@context/menuContext'
import { useOrders } from '@context/ordersContext'
import { formatPrice } from '@lib/helpers'
import { getCartItemKey } from '@lib/helpers/cartUtils'
import { IProductTemperature } from '@models/product.model'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './CartFooter.module.scss'
import CartItem from './cartItem/CartItem'
import EmptyCart from './emptyCart/EmptyCart'

/**
 * Type guard to validate if a temperature string is a valid IProductTemperature
 */
const isValidTemperature = (temp?: string): temp is IProductTemperature => {
  return temp === 'cold' || temp === 'hot'
}

/**
 * Memoized CartItem to prevent unnecessary re-renders
 */
const MemoizedCartItem = memo(CartItem)

const CartFooter = () => {
  const { t } = useTranslation('cart')
  const {
    cart,
    removeFromCart,
    updateCartItemQuantity,
    isItemOperationInProgress,
  } = useCart()
  const { categories } = useMenu()
  const { createOrder } = useOrders()

  const hasItems = cart?.items && cart.items.length > 0
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [hasScroll, setHasScroll] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [isScrolledToTop, setIsScrolledToTop] = useState(true)
  const itemsListRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const checkScrollHeight = () => {
    if (itemsListRef.current) {
      const { scrollHeight, clientHeight } = itemsListRef.current
      setHasScroll(scrollHeight > clientHeight)
    }
  }

  // Focus management for modal expansion
  useEffect(() => {
    if (isExpanded) {
      // Check scroll height after a small delay to ensure content is rendered
      const timer = setTimeout(
        checkScrollHeight,
        CART_CONSTANTS.ANIMATION.SCROLL_CHECK_DELAY
      )

      // Save previous focus and focus modal
      const previousFocus = document.activeElement as HTMLElement
      if (modalRef.current) {
        modalRef.current.focus()
      }

      return () => {
        clearTimeout(timer)
        // Restore focus when modal closes
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus()
        }
      }
    }
  }, [isExpanded, cart?.items])

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Stable callback refs to prevent stale closures
  const handleRemoveItem = useCallback(
    (cartItemKey: string) => {
      removeFromCart(cartItemKey)
    },
    [removeFromCart]
  )

  const handleQuantityChange = useCallback(
    (cartItemKey: string, newQuantity: number) => {
      updateCartItemQuantity(cartItemKey, newQuantity)
    },
    [updateCartItemQuantity]
  )

  const handleOrder = useCallback(() => {
    startTransition(async () => {
      await createOrder()
      setIsExpanded(false)
    })
  }, [createOrder])

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    },
    [isExpanded]
  )

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1
    const isAtTop = scrollTop < 1
    setIsScrolledToBottom(isAtBottom)
    setIsScrolledToTop(isAtTop)
    setHasScroll(scrollHeight > clientHeight)
  }

  // Memoize expensive calculations
  const totalPrice = useMemo(
    () =>
      cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
      0,
    [cart?.items]
  )

  const totalQuantity = useMemo(
    () => cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
    [cart?.items]
  )

  // Memoize subcategory map for O(1) lookups instead of O(n*m)
  const subcategoryMap = useMemo(() => {
    const map = new Map<number, string>()
    categories.forEach((category) => {
      category.subcategories.forEach((sub) => {
        map.set(sub.id, sub.name)
      })
    })
    return map
  }, [categories])

  // Get goods plural form based on quantity
  const getGoodsText = useCallback(
    (count: number) => {
      // Russian pluralization rules
      const mod10 = count % 10
      const mod100 = count % 100

      if (mod10 === 1 && mod100 !== 11) {
        return t('goodsPlural.one', { count })
      } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
        return t('goodsPlural.few', { count })
      } else {
        return t('goodsPlural.many', { count })
      }
    },
    [t]
  )

  return (
    <div
      ref={modalRef}
      className={classNames(
        styles.wrapper,
        hasItems && styles.hasItems,
        isExpanded && styles.expanded
      )}
      role={isExpanded ? 'dialog' : undefined}
      aria-modal={isExpanded}
      aria-labelledby={isExpanded ? 'cart-title' : undefined}
      tabIndex={isExpanded ? -1 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.widthWrapper}>
        <div
          className={classNames(
            styles.header,
            hasScroll && !isScrolledToTop && styles.withShadow
          )}
        >
          {isExpanded ? (
            <>
              <h1 id="cart-title" className={styles.headerTitle}>
                {t('title')}
              </h1>
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.icons}
                onClick={handleToggleExpand}
                aria-label={t('closeCart')}
              >
                <Icon
                  type="arrowRight"
                  size={24}
                  className={classNames(styles.icon, styles.arrowDown)}
                />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.icons}
                onClick={handleToggleExpand}
                aria-label={t('title')}
              >
                <Icon
                  type="cart"
                  size={24}
                  className={classNames(styles.icon, styles.cart)}
                />
              </button>
              {hasItems && (
                <div className={styles.cartInfo} onClick={handleToggleExpand}>
                  <span className={styles.totalPrice}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {isExpanded && !hasItems && <EmptyCart />}

        {isExpanded && hasItems && (
          <div
            ref={itemsListRef}
            className={styles.itemsList}
            onScroll={handleScroll}
          >
            {cart.items.map((item) => {
              const cartItemKey = getCartItemKey(item)
              const subcategoryName =
                subcategoryMap.get(item.subcategory.id) || t('defaultCategory')
              const temperature = isValidTemperature(item.selectedTemperature)
                ? item.selectedTemperature
                : undefined

              return (
                <MemoizedCartItem
                  key={cartItemKey}
                  cartItemKey={cartItemKey}
                  additionalIngredients={item.selectedAdditionalIngredients}
                  weight={item.weight}
                  temperature={temperature}
                  categoryName={subcategoryName}
                  name={item.name}
                  quantity={item.quantity}
                  price={item.price}
                  image={item.avatar}
                  isLoading={isItemOperationInProgress(cartItemKey)}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              )
            })}
          </div>
        )}

        {hasItems && isExpanded && (
          <div
            className={classNames(
              styles.orderFooter,
              hasScroll && !isScrolledToBottom && styles.withShadow
            )}
          >
            <div className={styles.totalBlock}>
              <h3 className={styles.totalText}>{t('total')}</h3>
              <h3 className={styles.totalText}>{formatPrice(totalPrice)}</h3>
            </div>
            <p className={styles.totalItems}>
              {totalQuantity} {getGoodsText(totalQuantity)}
            </p>
            <Button
              text={t('nextButton')}
              mode="primary"
              onClick={handleOrder}
              className={styles.orderButton}
              loading={isPending}
              disabled={isPending}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartFooter
