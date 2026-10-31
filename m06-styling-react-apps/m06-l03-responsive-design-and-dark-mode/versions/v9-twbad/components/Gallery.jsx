import CourseCard from './CourseCard'

function Gallery({ courses }) {
  return (
    <section>
      <h2 className="my-4 text-3xl font-bold">All courses</h2>
      <div className="grid grid-cols-4 sm:grid-cols-1 gap-4">
        {courses.map(c => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
