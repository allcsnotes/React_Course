import { Route, Routes } from 'react-router'
import { LoginPage } from '@/features/auth'
import { CartPage } from '@/features/cart'
import { CatalogPage } from '@/features/catalog'
import { MyCoursesPage } from '@/features/my-courses'
import RootLayout from './RootLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="my-courses" element={<MyCoursesPage />} />
      </Route>
    </Routes>
  )
}
