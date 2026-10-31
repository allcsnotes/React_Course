const COURSES = [
  { title: 'React for Beginners', lessons: 24 },
  { title: 'Python from Zero', lessons: 30 },
  { title: 'System Design', lessons: 28 },
  { title: 'Spring Boot', lessons: 22 },
]

export default function CoursesPage() {
  return (
    <div className="page">
      <h2>Courses</h2>
      <ul>
        {COURSES.map(c => (
          <li key={c.title}>
            <span>{c.title}</span>
            <span>{c.lessons} lessons</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
