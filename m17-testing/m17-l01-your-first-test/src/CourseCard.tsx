import { formatPrice } from './format'

export type Course = {
  id: number
  title: string
  priceCents: number
  percentOff: number
  seatsLeft: number
}

export function CourseCard({ course }: { course: Course }) {
  const soldOut = course.seatsLeft === 0
  return (
    <article className="card">
      <h2>{course.title}</h2>
      <p className="price">{formatPrice(course.priceCents)}</p>
      <p className="seats">{course.seatsLeft} seats left</p>
      {course.percentOff > 0 && <span className="badge">{course.percentOff}% off</span>}
      <button disabled={soldOut}>{soldOut ? 'Sold out' : 'Enroll'}</button>
    </article>
  )
}
