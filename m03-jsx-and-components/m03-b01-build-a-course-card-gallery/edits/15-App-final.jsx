import courses from './data/courses'
import Layout from './components/Layout'
import Gallery from './components/Gallery'

function App() {
  return (
    <Layout>
      <Gallery courses={courses} />
    </Layout>
  )
}

export default App
