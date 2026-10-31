function CourseCard({ course }) {
  function enroll() {
    console.log('Enroll clicked')
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>{course.lessons} lessons</p>
      <button onclick={enroll}>Enroll</button>
    </div>
  )
}

export default CourseCard
