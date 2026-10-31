import formatPrice from '../utils/formatPrice'

function CourseCard({ course }) {
  return (
    <div className="card">
      <img src={course.image} alt="" />
      <h3>{course.title}</h3>
      <p>by {course.teacher}</p>
      <p>{course.lessons} lessons</p>
      <p>{formatPrice(course.prise)}</p>
    </div>
  )
}

export default CourseCard
