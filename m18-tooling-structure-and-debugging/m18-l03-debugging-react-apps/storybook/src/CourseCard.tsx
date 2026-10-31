export type CourseCardProps = {
  title: string
  teacher: string
  lessons: number
  price: number
}

export function CourseCard({ title, teacher, lessons, price }: CourseCardProps) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>
        {teacher} · {lessons} lessons
      </p>
      <b>{price === 0 ? 'Free' : `₹${price}`}</b>
    </article>
  )
}
