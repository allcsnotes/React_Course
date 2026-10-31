import { courses } from '../data.ts'
import { Renders } from '../Renders.tsx'
import { useCartStore } from '../lib/cartStore16.ts'

// BROKEN on purpose: no selector means "send me everything".
function Badge() {
  const { items } = useCartStore()
  return (
    <div className="row">
      Badge: {items.length}
      <Renders />
    </div>
  )
}

function Buttons() {
  const add = useCartStore((state) => state.add)
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  return (
    <div>
      <button onClick={() => add(courses[0])}>Add React for Beginners</button>
      <button onClick={() => applyCoupon('SAVE10')}>Apply SAVE10</button>
    </div>
  )
}

export default function B16NoSelector() {
  return (
    <div className="card">
      <Badge />
      <Buttons />
    </div>
  )
}
