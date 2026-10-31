import './App.css'

function App() {
  return (
    <div className="course">
      <label htmlFor="seats">Seats</label>
      <input id="seats" tabIndex="0" />
      <button data-id="1" aria-label="Enroll">
        Enroll
      </button>
    </div>
  )
}

export default App
