import courses from './data/courses.js'

function App() {
  return (
    <div className="page">
      {courses.slice(0, 2).map(c => (
        <div className="course" key={c.id}>
          <img src={c.image} />
          <h3>{c.title}</h3>
        </div>
      ))}
    </div>
  )
}

export default App
