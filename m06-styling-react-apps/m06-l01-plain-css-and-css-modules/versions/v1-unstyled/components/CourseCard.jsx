export default function CourseCard({ course }) {
  return (
    <div className="card">
      <img
        className="thumb"
        src={course.image}
        alt=""
        width="56"
        height="56"
      />
      <div className="info">
        <h3 className="title">{course.title}</h3>
        <p className="meta">
          {course.teacher} · {course.lessons} lessons
        </p>
      </div>
      <button className="btn">Enroll</button>
    </div>
  )
}
