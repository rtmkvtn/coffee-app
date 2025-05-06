import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import GlobalLoader from '@components/loaders/globalLoader/GlobalLoader'
import { HOME_PATH, MENU_PATH } from '@constants/routes'
import { useStore } from '@context/mainContext'
import HomePage from '@views/homePage/HomePage'
import MenuPage from '@views/menuPage/MenuPage'

import './App.scss'

function App() {
  const { isInitialized } = useStore()

  return (
    <div className="main-container">
      {isInitialized ? (
        <Routes>
          <Route path={HOME_PATH} element={<HomePage />} />
          <Route
            path={MENU_PATH}
            element={<MenuPage />}
            loader={async () => {}}
          />
        </Routes>
      ) : (
        <GlobalLoader />
      )}
    </div>
  )
}

export default App
