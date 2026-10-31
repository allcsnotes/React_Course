import { COURSES, totalOf } from './courses'
import { CartProvider, useCart, useCartDispatch } from './cartContext'
import { useRenders } from './useRenders'

function CartBadge() {
  const { items } = useCart()
  const renders = useRenders()
  return (
    <span className="badge">
      Cart: {items.length} <small>renders {renders}</small>
    </span>
  )
}

function AddButton({ slug }: { slug: string }) {
  const dispatch = useCartDispatch()
  const renders = useRenders()
  return (
    <button onClick={() => dispatch({ type: 'add', slug })}>
      Add <small>renders {renders}</small>
    </button>
  )
}

function CartTotal() {
  const { items, coupon } = useCart()
  const renders = useRenders()
  return (
    <p className="total">
      Total: Rs {totalOf(items, coupon)} <small>renders {renders}</small>
    </p>
  )
}

function CouponButton() {
  const dispatch = useCartDispatch()
  const renders = useRenders()
  return (
    <button onClick={() => dispatch({ type: 'coupon', code: 'SAVE10' })}>
      Apply SAVE10 <small>renders {renders}</small>
    </button>
  )
}

function CouponTag() {
  const { coupon } = useCart()
  const renders = useRenders()
  return (
    <span className="tag">
      Coupon: {coupon ?? 'none'} <small>renders {renders}</small>
    </span>
  )
}

export default function ContextShop() {
  return (
    <CartProvider>
      <main>
        <header>
          <h1>allcsvideos · context</h1>
          <CartBadge />
        </header>
        <ul className="rows">
          {COURSES.map((c) => (
            <li key={c.slug}>
              <span>{c.title}</span>
              <span className="price">Rs {c.price}</span>
              <AddButton slug={c.slug} />
            </li>
          ))}
        </ul>
        <CartTotal />
        <div className="coupon">
          <CouponButton />
          <CouponTag />
        </div>
      </main>
    </CartProvider>
  )
}
