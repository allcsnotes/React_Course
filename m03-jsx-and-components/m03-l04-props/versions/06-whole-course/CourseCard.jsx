function CourseCard({ course }) {
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      <p>{course.lessons} lessons</p>
    </div>
  )
}

export default CourseCard
