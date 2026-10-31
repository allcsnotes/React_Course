const courses = ['React', 'Python', 'SQL']

function Newest({ list }: { list: string[] }) {
  const newest = [...list].reverse()
  return (
    <ul>
      {newest.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  )
}

export default function App() {
  return (
    <main>
      <h1>Newest first</h1>
      <Newest list={courses} />
    </main>
  )
}
