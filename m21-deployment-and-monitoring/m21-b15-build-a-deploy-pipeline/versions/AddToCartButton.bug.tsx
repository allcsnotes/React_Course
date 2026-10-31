import { useCartStore } from '../cart/cartStore'
import type { Course } from '../types'

export default function AddToCartButton({
  course,
}: {
  course: Course
}) {
  const add = useCartStore((state) => state.add)
  const { slug, title, price } = course
  if (price === 0) return <span>Free</span>
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
