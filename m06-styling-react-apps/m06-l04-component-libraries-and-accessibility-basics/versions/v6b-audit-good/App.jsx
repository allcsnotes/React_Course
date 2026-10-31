import courses from './data/courses.js'

function App() {
  const c = courses[1]
  return (
    <main className="page">
      <h1>My courses</h1>
      <div className="course">
        <img src={c.image} alt="" />
        <div>
          <h2>{c.title}</h2>
          <p className="meta" style={{ color: '#595959' }}>
            {c.lessons} lessons · by {c.teacher}
          </p>
        </div>
      </div>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" />
      <button className="iconbtn" aria-label="Save for later">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path d={HEART} fill="#1a5fd0" />
        </svg>
      </button>
    </main>
  )
}

const HEART = 'M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z'

export default App
