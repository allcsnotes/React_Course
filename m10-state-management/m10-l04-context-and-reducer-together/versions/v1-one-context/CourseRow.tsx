import { useCart } from './CartContext.tsx'
import type { Course } from './types.ts'
import { RenderCount } from './RenderCount.tsx'

export function CourseRow({ course }: { course: Course }) {
  const { dispatch } = useCart()
  const add = () => dispatch({ type: 'add', course })
  return (
    <li>
      <span className="name">{course.title}</span>
      <span>Rs {course.price}</span>
      <RenderCount />
      <button onClick={add}>Add</button>
    </li>
  )
}
