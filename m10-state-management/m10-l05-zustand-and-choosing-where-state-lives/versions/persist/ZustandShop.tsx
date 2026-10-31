import { COURSES, totalOf } from './courses'
import { useCartStore } from './cartStore'
import { useRenders } from './useRenders'

function CartBadge() {
  const count = useCartStore((state) => state.items.length)
  const renders = useRenders()
  return (
    <span className="badge">
      Cart: {count} <small>renders {renders}</small>
    </span>
  )
}

function AddButton({ slug }: { slug: string }) {
  const add = useCartStore((state) => state.add)
  const renders = useRenders()
  return (
    <button onClick={() => add(slug)}>
      Add <small>renders {renders}</small>
    </button>
  )
}

function CartTotal() {
  const total = useCartStore((state) =>
    totalOf(state.items, state.coupon),
  )
  const renders = useRenders()
  return (
    <p className="total">
      Total: Rs {total} <small>renders {renders}</small>
    </p>
  )
}

function CouponButton() {
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  const renders = useRenders()
  return (
    <button onClick={() => applyCoupon('SAVE10')}>
      Apply SAVE10 <small>renders {renders}</small>
    </button>
  )
}

function CouponTag() {
  const coupon = useCartStore((state) => state.coupon)
  const renders = useRenders()
  return (
    <span className="tag">
      Coupon: {coupon ?? 'none'} <small>renders {renders}</small>
    </span>
  )
}

export default function ZustandShop() {
  return (
    <main>
      <header>
        <h1>allcsvideos · zustand</h1>
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
  )
}
