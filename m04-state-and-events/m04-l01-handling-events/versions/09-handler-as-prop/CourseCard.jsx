function CourseCard({ course, onEnroll }) {
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <button
        onClick={() => onEnroll(course.title)}
      >
        Enroll
      </button>
    </div>
  )
}

export default CourseCard
