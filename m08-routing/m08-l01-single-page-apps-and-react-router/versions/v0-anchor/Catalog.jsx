import courses from './data/courses.js'

export default function Catalog() {
  return (
    <main className="page">
      <h1>Catalog</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
      <a href="/">Back home</a>
    </main>
  )
}
