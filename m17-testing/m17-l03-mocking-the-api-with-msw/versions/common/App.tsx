import { Route, Routes } from 'react-router'
import { CartProvider } from './CartContext.tsx'
import { CartBar } from './CartBar.tsx'
import { CourseDetail } from './CourseDetail.tsx'
import { CourseList } from './CourseList.tsx'

export default function App() {
  return (
    <CartProvider>
      <CartBar />
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
      </Routes>
    </CartProvider>
  )
}
