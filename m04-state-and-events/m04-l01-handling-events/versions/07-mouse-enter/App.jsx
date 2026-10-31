import courses from './data/courses.js'

function handleEnter() {
  console.log('mouse entered the card')
}

function App() {
  return (
    <div className="page">
      <div
        className="card"
        onMouseEnter={handleEnter}
      >
        <h2>{courses[0].title}</h2>
        <p>{courses[0].lessons} lessons</p>
      </div>
    </div>
  )
}

export default App
