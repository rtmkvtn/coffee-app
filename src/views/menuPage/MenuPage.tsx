import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import FixedTabsNav from '@components/fixedTabsNav/FixedTabsNav'
import TabsNav from '@components/tabsNav/TabsNav'
import { ORDER_PATH } from '@constants/routes'
import { useMenu } from '@context/menuContext'
import { useOrders } from '@context/ordersContext'
import { useVirtualScroll } from '@hooks/useVirtualScroll'
import { getImgUrl } from '@lib/helpers'
import { useLayout } from '@lib/layout/LayoutContext'
import { LocalizedProduct } from '@models/index'
import classNames from 'classnames'

import MenuItem from './menuItem/MenuItem'
import styles from './MenuPage.module.scss'

type IProps = {
  className?: string
}

// List item types for rendering with headers
type SubcategoryHeader = {
  type: 'header'
  subcategoryId: number
  name: string
}

type ProductItem = {
  type: 'product'
  data: LocalizedProduct
}

type ListItem = SubcategoryHeader | ProductItem

// Tab item type for subcategory navigation
type TabItem = {
  id: string
  label: string
  image?: string
}

// Layout and sizing constants
const LAYOUT_CONSTANTS = {
  FIXED_TABS_HEIGHT: 51,
  SUBCATEGORY_TABS_HEIGHT: 65,
  ITEM_SIZES: {
    HEADER: 46, // 14px margin-top + 24px line-height + 8px margin-bottom
    PRODUCT: 110, // 106px item height + 4px gap
  },
} as const

const MenuPage = ({ className }: IProps) => {
  const { categories, products } = useMenu()
  const { orders } = useOrders()
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState<number>(
    categories[0]?.id
  )
  const [subcategories, setSubcategories] = useState<TabItem[]>([])
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(
    null
  )

  // Memoize category tabs
  const categoryTabs = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id.toString(),
        label: category.name,
      })),
    [categories]
  )

  useEffect(() => {
    const pendingOrder = orders.find(
      (order) => order.state === 'waitingForPayment'
    )
    if (pendingOrder) {
      navigate(ORDER_PATH.replace(':orderId', pendingOrder.documentId), {
        replace: true,
      })
    }
  }, [orders, navigate])

  useEffect(() => {
    const targetCategory = categories.find((x) => x.id === activeCategory)
    setActiveSubcategory(null)
    if (targetCategory?.subcategories) {
      setSubcategories(
        targetCategory.subcategories.map((x) => ({
          id: x.id.toString(),
          label: x.name,
          image: x.avatar ? getImgUrl(x.avatar) : '',
        }))
      )
    }
  }, [activeCategory, categories])

  // Optimize products filtering
  const productsList: LocalizedProduct[] = useMemo(() => {
    if (!activeCategory) return products
    const categoryProducts = products.filter(
      (product) => product.category.id === activeCategory
    )

    if (!activeSubcategory) return categoryProducts

    return categoryProducts.filter(
      (product) => product.subcategory.id === activeSubcategory
    )
  }, [activeCategory, activeSubcategory, products])

  // Group products with subcategory headers
  const groupedListItems: ListItem[] = useMemo(() => {
    if (productsList.length === 0) return []

    // Create subcategory name lookup map
    const currentCategory = categories.find((cat) => cat.id === activeCategory)
    const subcategoryMap = new Map<number, string>()
    if (currentCategory) {
      currentCategory.subcategories.forEach((sub) => {
        subcategoryMap.set(sub.id, sub.name)
      })
    }

    // Group products by subcategory ID
    const grouped = productsList.reduce(
      (acc, product) => {
        const subId = product.subcategory.id
        if (!acc[subId]) {
          acc[subId] = []
        }
        acc[subId].push(product)
        return acc
      },
      {} as Record<number, LocalizedProduct[]>
    )

    // Convert to flat list with headers
    const items: ListItem[] = []
    Object.entries(grouped).forEach(([subIdStr, products]) => {
      const subId = Number(subIdStr)
      const subName = subcategoryMap.get(subId)

      // Add header only if subcategory name exists
      if (subName) {
        items.push({
          type: 'header',
          subcategoryId: subId,
          name: subName,
        })
      } else {
        console.warn(
          `Missing subcategory name for ID: ${subId}, skipping header`
        )
      }

      // Add products
      products.forEach((product) => {
        items.push({
          type: 'product',
          data: product,
        })
      })
    })

    return items
  }, [productsList, categories, activeCategory])

  const { availableHeight } = useLayout()

  // Dynamic size estimator for headers vs products
  const estimateItemSize = (index: number) => {
    const item = groupedListItems[index]
    if (!item) return LAYOUT_CONSTANTS.ITEM_SIZES.PRODUCT
    return item.type === 'header'
      ? LAYOUT_CONSTANTS.ITEM_SIZES.HEADER
      : LAYOUT_CONSTANTS.ITEM_SIZES.PRODUCT
  }

  const { scrollRef, virtualItems, totalSize, renderVirtualItem } =
    useVirtualScroll(groupedListItems, estimateItemSize)

  return (
    <div className={classNames(styles.wrapper, className && className)}>
      <FixedTabsNav
        activeTab={activeCategory.toString()}
        tabs={categoryTabs}
        onChange={(tabId) => setActiveCategory(Number(tabId))}
      />
      {subcategories.length > 0 && (
        <TabsNav
          key={activeCategory}
          activeTab={
            activeSubcategory ? activeSubcategory.toString() : undefined
          }
          tabs={subcategories}
          onChange={(tabId) => setActiveSubcategory(Number(tabId))}
          activeTabColor="secondary"
        />
      )}
      <div
        className={styles.products}
        ref={scrollRef}
        role="region"
        aria-label="Product list"
        style={{
          height: `${availableHeight - LAYOUT_CONSTANTS.FIXED_TABS_HEIGHT - LAYOUT_CONSTANTS.SUBCATEGORY_TABS_HEIGHT}px`,
        }}
      >
        <div
          className={styles.scrolling}
          style={{
            position: 'relative',
            height: `${totalSize}px`,
          }}
        >
          {virtualItems.map((virtualItem) =>
            renderVirtualItem(virtualItem, (item) => {
              if (item.type === 'header') {
                return <h2 className={styles.subcategoryHeader}>{item.name}</h2>
              }
              return <MenuItem product={item.data} />
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuPage
