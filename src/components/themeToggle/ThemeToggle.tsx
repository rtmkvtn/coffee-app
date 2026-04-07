import { useTheme } from '@context/themeContext'

import styles from './ThemeToggle.module.scss'

const isDev = import.meta.env.MODE === 'development'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  if (!isDev) return null

  return (
    <button className={styles.toggle} onClick={toggleTheme}>
      {theme === 'light' ? '☀️' : '🌙'} {theme}
    </button>
  )
}

export default ThemeToggle
