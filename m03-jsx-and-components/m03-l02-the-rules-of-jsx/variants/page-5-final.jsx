import './App.css'

function App() {
  return (
    <>
      <header>
        <b className="logo">allcsvideos</b>
        <span className="badge">My courses 3</span>
      </header>
      <div className="course">
        <img src="/meera.svg" alt="Meera" />
        <h2>React for Beginners</h2>
        <p>by Meera<br />12 lessons</p>
        <label htmlFor="seats">Seats</label>
        <input id="seats" tabIndex="0" />
        <p style={{ color: 'blue' }}>1204 students</p>
        {/* enroll button */}
        <button>Enroll</button>
      </div>
    </>
  )
}

export default App
