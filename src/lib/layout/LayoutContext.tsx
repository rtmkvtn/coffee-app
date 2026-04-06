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

const CONTENT_PADDING = 24

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LayoutState>({
    availableHeight: 0,
    contentPaddingTop: CONTENT_PADDING,
    contentPaddingBottom: CONTENT_PADDING,
    windowHeight: 0,
  })

  const updateLayout = () => {
    const appHeightVar = getComputedStyle(document.documentElement)
      .getPropertyValue('--app-height')
      .trim()

    const windowHeight =
      appHeightVar && appHeightVar !== ''
        ? parseFloat(appHeightVar)
        : window.innerHeight

    const availableHeight = windowHeight - CONTENT_PADDING - CONTENT_PADDING

    setState({
      availableHeight,
      contentPaddingTop: CONTENT_PADDING,
      contentPaddingBottom: CONTENT_PADDING,
      windowHeight,
    })
  }

  useEffect(() => {
    updateLayout()

    const handleResize = () => {
      updateLayout()
    }

    window.addEventListener('resize', handleResize)

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
