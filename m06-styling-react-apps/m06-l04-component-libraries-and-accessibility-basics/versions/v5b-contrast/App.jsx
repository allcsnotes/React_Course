import courses from './data/courses.js'

function App() {
  const c = courses[1]
  return (
    <div className="page">
      <div className="course">
        <img src={c.image} alt="" />
        <div>
          <h3>{c.title}</h3>
          <p
            className="meta"
            style={{ color: '#595959' }}
          >
            {c.lessons} lessons · by {c.teacher}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
