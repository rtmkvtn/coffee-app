import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import FixedTabsNav from '@components/fixedTabsNav/FixedTabsNav'
import TabsNav from '@components/tabsNav/TabsNav'
import { ORDER_PATH } from '@constants/routes'
import { useMenu } from '@context/menuContext'
import { useOrders } from '@context/ordersContext'
import { useInfiniteScroll } from '@hooks/useInfiniteScroll'
import { IProduct } from '@models/index'
import classNames from 'classnames'

import MenuItem from './menuItem/MenuItem'
import styles from './MenuPage.module.scss'

type IProps = {
  className?: string
}

const MenuPage = ({ className }: IProps) => {
  const { categories, products } = useMenu()
  const { orders } = useOrders()
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState<number>(
    categories[0]?.id
  )
  const [subcategories, setSubcategories] = useState<
    {
      id: string
      label: string
    }[]
  >([])
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
        }))
      )
    }
  }, [activeCategory, categories])

  // Optimize products filtering
  const productsList: IProduct[] = useMemo(() => {
    if (!activeCategory) return products
    const categoryProducts = products.filter(
      (product) => product.category.id === activeCategory
    )

    if (!activeSubcategory) return categoryProducts

    return categoryProducts.filter(
      (product) => product.subcategory.id === activeSubcategory
    )
  }, [activeCategory, activeSubcategory, products])

  // Use infinite scroll hook
  const { visibleItems, hasMore, loadingRef } = useInfiniteScroll(
    productsList,
    4
  )

  // Memoize product items
  const productItems = useMemo(
    () =>
      visibleItems.map((product) => (
        <MenuItem key={`menu-product-${product.id}`} product={product} />
      )),
    [visibleItems]
  )

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
      <div className={styles.products}>
        {productItems}
        {hasMore && <div ref={loadingRef} style={{ height: '20px' }} />}
      </div>
    </div>
  )
}

export default MenuPage
