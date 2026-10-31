import courses from './data/courses.js'

const copy = {
  ...courses[2], id: 1, title: 'Git Basics',
}
const list = [...courses, copy]

export default function App() {
  return (
    <ul className="plain">
      {list.map(c => (
        <li key={c.id}>{c.title} · id {c.id}</li>
      ))}
    </ul>
  )
}
