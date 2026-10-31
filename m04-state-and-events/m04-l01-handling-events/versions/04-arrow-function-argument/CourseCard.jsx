function CourseCard({ course }) {
  function enroll(title) {
    console.log('Enrolling in ' + title)
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>{course.lessons} lessons</p>
      <button
        onClick={() => enroll(course.title)}
      >
        Enroll
      </button>
    </div>
  )
}

export default CourseCard
