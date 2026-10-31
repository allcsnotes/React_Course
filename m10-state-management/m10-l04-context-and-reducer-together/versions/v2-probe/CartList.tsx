import { useCart, useCartDispatch } from './CartContext.tsx'
import { RenderCount } from './RenderCount.tsx'

const seen = new Set<unknown>()

export function CartList() {
  const { items } = useCart()
  const dispatch = useCartDispatch()
  seen.add(dispatch)
  console.log('dispatch functions seen:', seen.size)
  const remove = (id: string) => dispatch({ type: 'remove', id })
  return (
    <div>
      <h2>Your cart <RenderCount /></h2>
      {items.map(i => (
        <p key={i.id}>
          {i.title} x {i.qty}
          <button onClick={() => remove(i.id)}>x</button>
        </p>
      ))}
    </div>
  )
}
