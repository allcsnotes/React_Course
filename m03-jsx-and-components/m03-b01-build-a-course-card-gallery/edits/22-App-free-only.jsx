import courses from './data/courses'
import Layout from './components/Layout'
import Gallery from './components/Gallery'

function App() {
  const free = courses.filter(c => c.free)

  return (
    <Layout>
      <Gallery courses={free} />
    </Layout>
  )
}

export default App
