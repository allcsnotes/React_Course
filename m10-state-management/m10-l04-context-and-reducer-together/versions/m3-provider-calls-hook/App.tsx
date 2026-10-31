import { CartList } from './CartList.tsx'
import { CartProvider } from './CartContext.tsx'
import { ClearButton } from './ClearButton.tsx'
import { COURSES } from './courses.ts'
import { CouponButton } from './CouponButton.tsx'
import { CourseRow } from './CourseRow.tsx'
import { Header } from './Header.tsx'
import { Total } from './Total.tsx'

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        <ul>
          {COURSES.map(c => (
            <CourseRow key={c.id} course={c} />
          ))}
        </ul>
        <aside>
          <CartList />
          <CouponButton />
          <Total />
          <ClearButton />
        </aside>
      </main>
    </CartProvider>
  )
}
