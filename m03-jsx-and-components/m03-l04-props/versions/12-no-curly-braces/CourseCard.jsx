function CourseCard(title, lessons) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{lessons} lessons</p>
    </div>
  )
}

export default CourseCard
