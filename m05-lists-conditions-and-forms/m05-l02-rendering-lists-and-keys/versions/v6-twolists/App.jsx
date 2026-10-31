import courses from './data/courses.js'

const enrolled = [courses[0], courses[1]]
const wishlist = [courses[1], courses[2]]

function List({ title, items }) {
  return (
    <>
      <h3>{title}</h3>
      <ul className="plain">
        {items.map(c => (
          <li key={c.id}>{c.title} · id {c.id}</li>
        ))}
      </ul>
    </>
  )
}

export default function App() {
  return (
    <>
      <List title="Enrolled" items={enrolled} />
      <List title="Wishlist" items={wishlist} />
    </>
  )
}
