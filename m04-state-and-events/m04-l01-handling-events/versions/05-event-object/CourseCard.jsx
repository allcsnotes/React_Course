function CourseCard({ course }) {
  function enroll(e) {
    console.log(e)
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>{course.lessons} lessons</p>
      <button onClick={enroll}>Enroll</button>
    </div>
  )
}

export default CourseCard
