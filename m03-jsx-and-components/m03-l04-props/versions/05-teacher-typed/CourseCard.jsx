function CourseCard({ title, teacher, lessons }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>by {teacher}</p>
      <p>{lessons} lessons</p>
    </div>
  )
}

export default CourseCard
