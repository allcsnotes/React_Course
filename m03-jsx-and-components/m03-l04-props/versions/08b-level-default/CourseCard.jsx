function CourseCard({ title, lessons, level = 'Beginner' }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{lessons} lessons</p>
      <p>Level: {level}</p>
    </div>
  )
}

export default CourseCard
