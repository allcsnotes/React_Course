import { courses, type Course } from '../data.ts'
import { Renders } from '../Renders.tsx'
import { useCartStore } from '../lib/cartStore16.ts'

// Every component picks ONE slice with a selector. There is no provider anywhere.
function Badge() {
  const count = useCartStore((state) => state.items.length)
  return (
    <div className="row">
      Badge: {count}
      <Renders />
    </div>
  )
}

function Total() {
  const items = useCartStore((state) => state.items)
  const coupon = useCartStore((state) => state.coupon)
  const subtotal = items.reduce((sum, c) => sum + c.price, 0)
  const total = coupon === null ? subtotal : subtotal - Math.round(subtotal * 0.1)
  return (
    <div className="row">
      Total: Rs {total}
      <Renders />
    </div>
  )
}

function AddButton({ course }: { course: Course }) {
  const add = useCartStore((state) => state.add) // a function: created once, never changes
  return (
    <span className="row">
      <button onClick={() => add(course)}>Add {course.title}</button>
      <Renders />
    </span>
  )
}

function CouponButton() {
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  return (
    <span className="row">
      <button onClick={() => applyCoupon('SAVE10')}>Apply SAVE10</button>
      <Renders />
    </span>
  )
}

function CouponTag() {
  const coupon = useCartStore((state) => state.coupon)
  return (
    <div className="row">
      Coupon tag: {coupon ?? 'none'}
      <Renders />
    </div>
  )
}

export default function Ex16() {
  return (
    <div className="card">
      <Badge />
      <AddButton course={courses[0]} />
      <AddButton course={courses[1]} />
      <CouponButton />
      <CouponTag />
      <Total />
    </div>
  )
}
