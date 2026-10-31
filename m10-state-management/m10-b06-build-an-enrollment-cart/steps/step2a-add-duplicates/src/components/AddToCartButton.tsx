import { useCartStore } from '../cart/cartStore'
import type { Course } from '../types'

export default function AddToCartButton({
  course,
}: {
  course: Course
}) {
  const add = useCartStore((state) => state.add)
  const { slug, title, price } = course

  return (
    <button
      onClick={() => add({ slug, title, price })}
    >
      Add to cart
    </button>
  )
}
