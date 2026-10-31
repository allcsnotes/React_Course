function CourseCard({ course, enrolled, onEnroll }) {
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      <button disabled={enrolled} onClick={onEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default CourseCard
