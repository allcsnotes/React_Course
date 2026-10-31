import CourseCard from './CourseCard'

function Gallery({ courses }) {
  const lessons = courses.reduce(
    (sum, c) => sum + c.lessons, 0
  )
  const count = courses.length

  return (
    <section>
      <h2>All courses</h2>
      <p>{count} courses, {lessons} lessons</p>
      <div className="grid">
        {courses.map(c => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
