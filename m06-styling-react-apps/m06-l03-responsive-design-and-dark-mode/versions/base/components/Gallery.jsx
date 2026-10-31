import CourseCard from './CourseCard'

function Gallery({ courses }) {
  return (
    <section>
      <h2>All courses</h2>
      <div className="grid">
        {courses.map(c => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
