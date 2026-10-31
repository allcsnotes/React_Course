import { COURSES } from './courses.ts'
import type { CartItem, Course } from './types.ts'

type Props = {
  items: CartItem[]
  coupon: string | null
  onAdd: (course: Course) => void
  onRemove: (id: string) => void
  onCoupon: (code: string) => void
  onClear: () => void
}

export function View(p: Props) {
  const count = p.items.reduce((s, i) => s + i.qty, 0)
  const subtotal = p.items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = p.coupon ? Math.round(subtotal * 0.9) : subtotal
  return (
    <main>
      <h1>allcsvideos cart</h1>
      <div className="cols">
        <section>
          <h2>Courses</h2>
          {COURSES.map(c => (
            <div className="row" key={c.id}>
              <span>
                {c.title}
                <small>Rs {c.price}</small>
              </span>
              <button onClick={() => p.onAdd(c)}>Add</button>
            </div>
          ))}
        </section>
        <section>
          <h2>Your cart ({count})</h2>
          {p.items.length === 0 && <p className="muted">Nothing here yet</p>}
          {p.items.map(i => (
            <div className="row" key={i.id}>
              <span>
                {i.title}
                <small>x {i.qty}</small>
              </span>
              <button onClick={() => p.onRemove(i.id)}>Remove</button>
            </div>
          ))}
          <div className="row">
            {p.coupon
              ? <span className="chip">{p.coupon} applied</span>
              : <button onClick={() => p.onCoupon('SAVE10')}>Apply SAVE10</button>}
          </div>
          <p className="total">Total: Rs {total}</p>
          <button className="clear" onClick={p.onClear}>Clear cart</button>
        </section>
      </div>
    </main>
  )
}
