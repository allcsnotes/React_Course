import { Link, Route, Routes } from 'react-router'
import { CartProvider, useCart } from './CartContext'
import Cart from './Cart'
import Catalog from './Catalog'

function Header() {
  const { items } = useCart()
  return (
    <header>
      <Link to="/">allcsvideos</Link>
      <Link to="/cart">Cart ({items.length})</Link>
    </header>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </CartProvider>
  )
}
