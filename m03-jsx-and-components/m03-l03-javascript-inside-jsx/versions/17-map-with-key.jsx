import courses from './data/courses.js'
import './App.css'

export default function App() {
  return (
    <ul>
      {courses.map(c => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  )
}
