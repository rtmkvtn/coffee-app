import { useRef } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'

export const useVirtualScroll = <T,>(
  items: T[],
  estimateSize: number | ((index: number) => number) = 110
) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize:
      typeof estimateSize === 'function' ? estimateSize : () => estimateSize,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const renderVirtualItem = (
    virtualItem: (typeof virtualItems)[number],
    renderContent: (item: T, index: number) => React.ReactNode
  ): React.ReactNode => {
    const item = items[virtualItem.index]
    if (!item) return null

    return (
      <div
        key={virtualItem.key}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${virtualItem.start}px)`,
          height: `${virtualItem.size}px`,
        }}
        data-index={virtualItem.index}
      >
        {renderContent(item, virtualItem.index)}
      </div>
    )
  }

  return {
    scrollRef,
    virtualItems,
    totalSize,
    renderVirtualItem,
  }
}
