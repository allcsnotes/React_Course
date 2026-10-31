const course = { title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499 }

export default function Ex03() {
  return (
    <div className="card">
      <h3>{course.title.toUpperCase()}</h3>
      <p>
        {course.lessons} lessons, about {course.lessons * 20} minutes of video
      </p>
      <p>Price: Rs {course.price}</p>
      <p>With 20% off: Rs {Math.round(course.price * 0.8)}</p>
      <p>{course.price === 0 ? 'Free course' : 'Paid course'}</p>
    </div>
  )
}
