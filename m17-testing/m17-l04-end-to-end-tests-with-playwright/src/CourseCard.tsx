import { fmt, type Course } from './api'

type Props = { course: Course; inCart: boolean; onAdd: (c: Course) => void }

export default function CourseCard({ course, inCart, onAdd }: Props) {
  return (
    <li className="card">
      <div>
        <strong>{course.title}</strong>
        <span>{course.teacher} · {fmt(course.price)}</span>
      </div>
      <button disabled={inCart} onClick={() => onAdd(course)}>
        {inCart ? 'In cart' : 'Add to cart'}
      </button>
    </li>
  )
}
