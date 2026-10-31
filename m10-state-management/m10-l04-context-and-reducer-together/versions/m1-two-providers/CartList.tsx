import { useCart, useCartDispatch } from './CartContext.tsx'
import { RenderCount } from './RenderCount.tsx'

export function CartList() {
  const { items } = useCart()
  const dispatch = useCartDispatch()
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
