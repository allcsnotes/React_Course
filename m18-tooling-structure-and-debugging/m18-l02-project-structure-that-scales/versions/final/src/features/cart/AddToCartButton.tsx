import { useCartStore } from './cartStore'
import type { CartItem } from './types'

export default function AddToCartButton({
  item,
}: {
  item: CartItem
}) {
  const add = useCartStore((state) => state.add)
  const { slug, title, price } = item
  const inCart = useCartStore((state) =>
    state.items.some((i) => i.slug === slug),
  )

  return (
    <button
      disabled={inCart}
      onClick={() => add({ slug, title, price })}
    >
      {inCart ? 'In cart' : 'Add to cart'}
    </button>
  )
}
