import { useCartStore } from '../lib/cartStore16.ts'
import { Renders } from '../Renders.tsx'

// BROKEN on purpose: the selector builds a brand new object on every call.
function Badge() {
  const { count } = useCartStore((state) => ({ count: state.items.length }))
  return (
    <div className="row">
      Badge: {count}
      <Renders />
    </div>
  )
}

export default function B16NewObject() {
  return (
    <div className="card">
      <Badge />
    </div>
  )
}
