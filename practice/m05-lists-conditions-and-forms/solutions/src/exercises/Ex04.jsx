import { courses } from '../courses'

function CourseCard({ title, teacher, lessons, price }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>
        {teacher} · {lessons} lessons · Rs {price}
      </p>
    </div>
  )
}

export default function Ex04() {
  return (
    <div>
      {courses.map((c) => (
        <CourseCard key={c.id} title={c.title} teacher={c.teacher} lessons={c.lessons} price={c.price} />
      ))}
    </div>
  )
}
