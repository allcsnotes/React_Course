import { useEffect, useState } from 'react'

type Course = { slug: string; title: string; teacher: string; level: string; price: number; free: boolean }
type Config = { apiUrl: string }

export default function App() {
  const [courses, setCourses] = useState<Course[]>([])
  const [apiUrl, setApiUrl] = useState('')

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((config: Config) => {
        setApiUrl(config.apiUrl)
        return fetch(`${config.apiUrl}/courses`)
      })
      .then((res) => res.json())
      .then(setCourses)
  }, [])

  return (
    <>
      <header className="top">
        <span className="logo">allcsvideos</span>
        <span className="badge">release 1</span>
      </header>
      <main>
        <h1>Courses</h1>
        <p className="src">data from {apiUrl}</p>
        <ul className="grid">
          {courses.map((c) => (
            <li key={c.slug} className="card">
              <h2>{c.title}</h2>
              <p>
                {c.teacher} · {c.level}
              </p>
              <p className="price">{c.free ? 'Free' : `₹${c.price}`}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
