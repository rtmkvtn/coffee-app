import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type LayoutState = {
  availableHeight: number
  contentPaddingTop: number
  contentPaddingBottom: number
  windowHeight: number
}

type LayoutContextType = LayoutState & {
  updateLayout: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LayoutState>({
    availableHeight: 0,
    contentPaddingTop: 0,
    contentPaddingBottom: 0,
    windowHeight: 0,
  })

  const updateLayout = () => {
    // Get --app-height CSS variable
    const appHeightVar = getComputedStyle(document.documentElement)
      .getPropertyValue('--app-height')
      .trim()

    const windowHeight =
      appHeightVar && appHeightVar !== ''
        ? parseFloat(appHeightVar)
        : window.innerHeight

    // Get --header-height CSS variable (if header exists)
    const headerHeightVar = getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height')
      .trim()

    const headerHeight =
      headerHeightVar && headerHeightVar !== ''
        ? parseFloat(headerHeightVar)
        : 0

    // Content padding from Layout.module.scss
    // .content has padding: 24px 16px (top/bottom: 24px)
    // When withHeader, padding-top is replaced with var(--header-height)
    const contentPaddingBottom = 24 // from SCSS
    const contentPaddingTop = headerHeight > 0 ? headerHeight : 24 // from SCSS

    // Calculate available height
    const availableHeight =
      windowHeight - contentPaddingTop - contentPaddingBottom

    setState({
      availableHeight,
      contentPaddingTop,
      contentPaddingBottom,
      windowHeight,
    })
  }

  useEffect(() => {
    // Initial calculation
    updateLayout()

    // Update on window resize
    const handleResize = () => {
      updateLayout()
    }

    window.addEventListener('resize', handleResize)

    // Listen for CSS variable changes (--app-height, --header-height)
    const observer = new MutationObserver(() => {
      updateLayout()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  return (
    <LayoutContext.Provider
      value={{
        ...state,
        updateLayout,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider')
  return ctx
}
