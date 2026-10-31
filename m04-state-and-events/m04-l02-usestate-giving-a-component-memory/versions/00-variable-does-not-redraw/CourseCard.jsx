function CourseCard({ course }) {
  let enrolled = false

  function handleEnroll() {
    enrolled = true
    console.log('enrolled is', enrolled)
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <button onClick={handleEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default CourseCard
