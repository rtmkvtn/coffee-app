import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import { HOME_PATH } from '@constants/routes'
import HomePage from '@views/homePage/HomePage'

import './App.scss'

function App() {
  return (
    <div className="main-container">
      <Routes>
        <Route path={HOME_PATH} element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
