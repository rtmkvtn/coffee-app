import { Link } from 'react-router-dom'

import classNames from 'classnames'

import styles from './FixedTabsNav.module.scss'

type ITabProps = {
  id: string
  label: string
}

type IProps<T extends ITabProps[]> = {
  tabs: T
  activeTab?: T[number]['id']
  onChange?(value: T[number]['id']): void
  asLinks?: boolean
  className?: string
}

const FixedTabsNav = <T extends ITabProps[]>({
  tabs,
  activeTab,
  onChange,
  asLinks,
  className,
}: IProps<T>) => {
  const handleClick = (value: string): void => {
    if (value !== activeTab && onChange) {
      onChange(value)
    }
  }

  return (
    <div className={classNames(styles.wrapper, className && className)}>
      {tabs.map(({ id, label }) =>
        asLinks ? (
          <Link
            to={id}
            key={`tabs-tab-${id}}`}
            className={classNames(
              styles.tab,
              activeTab === id && styles.tabActive
            )}
            style={{ width: `calc(100% / ${tabs.length})` }}
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
            style={{ width: `calc(100% / ${tabs.length})` }}
          >
            {label}
          </div>
        )
      )}
    </div>
  )
}

export default FixedTabsNav
