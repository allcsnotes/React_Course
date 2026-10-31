import Layout from './Layout.jsx'
import Card from './Card.jsx'
import { courses } from './courses.js'

export default function App() {
  return (
    <Layout>
      {courses.map(c => (
        <Card key={c.id} title={c.title}>
          <p>by {c.teacher}</p>
          <p>{c.lessons} lessons</p>
        </Card>
      ))}
    </Layout>
  )
}
