function CourseCard({ title, lessons, onEnroll }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{lessons} lessons</p>
      <button className="enroll" onClick={onEnroll}>Enroll</button>
    </div>
  )
}

export default CourseCard
