import courses from './data/courses.js'
import './App.css'

export default function App() {
  return (
    <ul>
      {courses.map(c => (
        <li>{c.title}</li>
      ))}
    </ul>
  )
}
