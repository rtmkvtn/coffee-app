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
import { useNavigate } from 'react-router-dom'

import Button from '@components/button/Button'
import { CART_CONSTANTS } from '@constants/cart'
import { ORDER_PATH } from '@constants/routes'
import { useCart } from '@context/cartContext'
import { useMenu } from '@context/menuContext'
import { useOrders } from '@context/ordersContext'
import { formatPrice } from '@lib/helpers'
import { toDisplayCartItems } from '@lib/helpers/cartUtils'
import classNames from 'classnames'

import Icon from '@assets/images/Icon'

import styles from './CartFooter.module.scss'
import CartItem from './cartItem/CartItem'
import EmptyCart from './emptyCart/EmptyCart'

/**
 * Memoized CartItem to prevent unnecessary re-renders
 */
const MemoizedCartItem = memo(CartItem)

const CartFooter = () => {
  const { t } = useTranslation()
  const {
    items,
    removeFromCart,
    updateCartItemQuantity,
    isItemOperationInProgress,
  } = useCart()
  const { categories, products } = useMenu()
  const { createOrder } = useOrders()
  const navigate = useNavigate()

  const hasItems = items.length > 0
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [comment, setComment] = useState('')
  const commentRef = useRef<HTMLTextAreaElement>(null)
  const [hasScroll, setHasScroll] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [isScrolledToTop, setIsScrolledToTop] = useState(true)
  const itemsListRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Convert cart items to display items
  const displayItems = useMemo(
    () => toDisplayCartItems(items, products),
    [items, products]
  )

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
  }, [isExpanded, items])

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Stable callback refs to prevent stale closures
  const handleRemoveItem = useCallback(
    (itemId: number) => {
      removeFromCart(itemId)
    },
    [removeFromCart]
  )

  const handleQuantityChange = useCallback(
    (itemId: number, newQuantity: number) => {
      updateCartItemQuantity(itemId, newQuantity)
    },
    [updateCartItemQuantity]
  )

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (value.length <= 500) {
        setComment(value)
      }
      if (commentRef.current) {
        commentRef.current.style.height = 'auto'
        commentRef.current.style.height = `${commentRef.current.scrollHeight}px`
      }
    },
    []
  )

  const handleOrder = useCallback(() => {
    startTransition(async () => {
      const trimmedComment = comment.trim()
      const orderId = await createOrder(
        trimmedComment ? trimmedComment : undefined
      )
      if (orderId) {
        setIsExpanded(false)
        setComment('')
        navigate(ORDER_PATH.replace(':orderId', orderId))
      }
    })
  }, [createOrder, navigate, comment])

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
      displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [displayItems]
  )

  const totalQuantity = useMemo(
    () => displayItems.reduce((sum, item) => sum + item.quantity, 0),
    [displayItems]
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
                {t('cart.title')}
              </h1>
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.icons}
                onClick={handleToggleExpand}
                aria-label={t('cart.closeCart')}
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
                aria-label={t('cart.title')}
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
            {displayItems.map((item) => {
              const subcategoryName =
                subcategoryMap.get(item.subcategoryId) ||
                t('cart.defaultCategory')

              return (
                <MemoizedCartItem
                  key={item.id}
                  itemId={item.id}
                  additionalIngredients={item.ingredients}
                  portionName={item.portionName}
                  temperature={item.temperature}
                  categoryName={subcategoryName}
                  name={item.name}
                  quantity={item.quantity}
                  price={item.price}
                  image={item.image}
                  isLoading={isItemOperationInProgress(item.id)}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              )
            })}
            <div className={styles.commentSection}>
              <h3 className={styles.commentLabel}>{t('cart.comment.label')}</h3>
              <textarea
                ref={commentRef}
                className={styles.commentTextarea}
                placeholder={t('cart.comment.placeholder')}
                value={comment}
                onChange={handleCommentChange}
                rows={3}
              />
              <span className={styles.commentCounter}>
                {comment.length}/500
              </span>
            </div>
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
              <h3 className={styles.totalText}>{t('cart.total')}</h3>
              <h3 className={styles.totalText}>{formatPrice(totalPrice)}</h3>
            </div>
            <p className={styles.totalItems}>
              {totalQuantity} {t('cart.goodsPlural', { count: totalQuantity })}
            </p>
            <Button
              text={t('cart.nextButton')}
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
