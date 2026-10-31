import { useState, useEffect } from 'react'
import './App.css'

const tabs = [
  { id: 1, name: 'React' },
  { id: 2, name: 'Python' },
  { id: 3, name: 'Design' },
  { id: 4, name: 'DevOps' },
]

export default function App() {
  const [id, setId] = useState(2)

  return (
    <div className="card">
      <div className="filters">
        {tabs.map(t => (
          <button
            key={t.id}
            className={t.id === id ? 'on' : ''}
            onClick={() => setId(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <Detail id={id} />
    </div>
  )
}

function Detail({ id }) {
  const [course, setCourse] = useState(null)

  useEffect(() => {
    setCourse(null)
    const controller = new AbortController()
    async function load() {
      try {
        const url = '/api/courses/' + id
        const res = await fetch(url, {
          signal: controller.signal,
        })
        setCourse(await res.json())
      } catch (err) {
        console.log(err.name + ': ' + err.message)
      }
    }
    load()
    return () => controller.abort()
  }, [id])

  if (!course) return <p className="note">Loading...</p>
  return (
    <div>
      <h2>{course.title}</h2>
      <p className="small">{course.teacher} · {course.lessons} lessons</p>
    </div>
  )
}
