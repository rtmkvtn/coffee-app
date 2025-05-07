import { useLayoutEffect, useRef } from 'react'

import { Link } from 'react-router-dom'

import classNames from 'classnames'

import styles from './TabsNav.module.scss'

type ITabProps = {
  id: string
  label: string
}

type IProps<T extends ITabProps[]> = {
  tabs: T
  activeTabColor?: 'primary' | 'secondary'
  activeTab?: T[number]['id']
  onChange?(value: T[number]['id']): void
  asLinks?: boolean
  className?: string
}

const TabsNav = <T extends ITabProps[]>({
  tabs,
  activeTab,
  activeTabColor = 'primary',
  onChange,
  asLinks,
  className,
}: IProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleClick = (value: string): void => {
    if (value !== activeTab && onChange) {
      onChange(value)
    }
  }

  useLayoutEffect(() => {
    if (!wrapperRef?.current) {
      return
    }

    const currentActiveEl = wrapperRef.current.querySelector(
      `.${styles.tabActive}`
    )
    if (currentActiveEl) {
      currentActiveEl.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    }
  }, [activeTab, wrapperRef])

  return (
    <div
      className={classNames(
        styles.wrapper,
        styles[activeTabColor],
        className && className
      )}
      ref={wrapperRef}
    >
      {tabs.map(({ id, label }) =>
        asLinks ? (
          <Link
            to={id}
            key={`tabs-tab-${id}}`}
            className={classNames(
              styles.tab,
              activeTab === id && styles.tabActive
            )}
          >
            {label}
          </Link>
        ) : (
          <div
            key={`tabs-tab-${id}}`}
            className={classNames(
              styles.tab,
              activeTab === id && styles.tabActive
            )}
            onClick={() => handleClick(id)}
          >
            {label}
          </div>
        )
      )}
    </div>
  )
}

export default TabsNav
