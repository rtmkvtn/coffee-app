import { useEffect, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import TabsNav from '@components/tabsNav/TabsNav'
import { ORDER_PATH } from '@constants/routes'
import { useStore } from '@context/mainContext'
import { IProduct } from '@models/index'
import classNames from 'classnames'

import MenuItem from './menuItem/MenuItem'
import styles from './MenuPage.module.scss'

type IProps = {
  className?: string
}

const MenuPage = ({ className }: IProps) => {
  const { categories, products, orders } = useStore()
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
  }, [activeCategory])

  const productsList: IProduct[] = useMemo(() => {
    let result = products

    if (activeCategory) {
      result = result.filter(
        (product) => product.category.id === activeCategory
      )
    }
    if (activeSubcategory) {
      result = result.filter(
        (product) => product.subcategory.id === activeSubcategory
      )
    }
    return result
  }, [activeCategory, activeSubcategory])

  return (
    <div className={classNames(styles.wrapper, className && className)}>
      <TabsNav
        activeTab={activeCategory.toString()}
        tabs={categories.map((category) => ({
          id: category.id.toString(),
          label: category.name,
        }))}
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
        {productsList.map((product) => (
          <MenuItem key={`menu-product-${product.id}`} product={product} />
        ))}
      </div>
    </div>
  )
}

export default MenuPage
