function CourseCard({ title, lessons }) {
  const withBonus = lessons + 1
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{withBonus} lessons</p>
    </div>
  )
}

export default CourseCard
