import { Route, Routes } from 'react-router'
import RootLayout from './components/RootLayout'
import { CartPage } from './features/cart'
import Catalog from './pages/Catalog'
import LoginPage from './pages/LoginPage'
import MyCourses from './pages/MyCourses'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Catalog />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="my-courses" element={<MyCourses />} />
      </Route>
    </Routes>
  )
}
