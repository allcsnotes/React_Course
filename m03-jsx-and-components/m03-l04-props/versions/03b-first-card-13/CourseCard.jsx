function CourseCard(props) {
  return (
    <div className="card">
      <h2>{props.title}</h2>
      <p>{props.lessons} lessons</p>
    </div>
  )
}

export default CourseCard
