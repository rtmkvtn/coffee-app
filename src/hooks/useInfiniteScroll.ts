import { useEffect, useRef, useState } from 'react'

export const useInfiniteScroll = <T>(
  items: T[],
  initialCount: number = 4,
  threshold: number = 0.5
) => {
  const [visibleItems, setVisibleItems] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset visible items when items array changes
    setVisibleItems(items.slice(0, initialCount))
    setHasMore(items.length > initialCount)
  }, [items, initialCount])

  useEffect(() => {
    if (!hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setVisibleItems((prev) => {
            const newCount = prev.length + initialCount
            const newItems = items.slice(0, newCount)
            setHasMore(newCount < items.length)
            return newItems
          })
        }
      },
      {
        threshold,
        rootMargin: '100px',
      }
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, items, initialCount, threshold])

  return {
    visibleItems,
    hasMore,
    loadingRef,
  }
}
