import { courses, price } from './courses'
import { List } from './List'

export default function App() {
  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="tag">Course page</span>
      </header>
      <main>
        <h2>All courses</h2>
        <List
          items={courses}
          renderItem={(c) => (
            <li key={c.slug} className="cardli">
              <h3>{c.title}</h3>
              <p>{c.teacher}</p>
              <span className="price">{price(c)}</span>
            </li>
          )}
        />
      </main>
    </>
  )
}
