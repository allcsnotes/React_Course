import './App.css'

function Shelf({ list }) {
  if (list.length === 0) {
    return <p className="note">No courses yet</p>
  }
  return <p className="note">{list.length} courses</p>
}

function App() {
  const myCount = 0
  const enrolled = false
  const python = { title: 'Python from Zero', price: 0, teacher: { name: 'Meera' } }
  const draft = { title: 'Git for Beginners' }

  return (
    <main className="page">
      <h1>My courses</h1>
      <div className="bar">
        {myCount > 0 && (
          <span className="badge">{myCount} courses</span>
        )}
      </div>
      <Shelf list={[]} />
      <div className="cards">
        <section className="card">
          <h2>{python.title}</h2>
          <p>Price: Rs {python.price || 'soon'}</p>
          <p>Teacher: {python.teacher.name}</p>
          <button>{enrolled ? 'Enrolled' : 'Enroll'}</button>
        </section>
        <section className="card">
          <h2>{draft.title}</h2>
          <p>Price: Rs {draft.price || 'soon'}</p>
          <p>Teacher: {draft.teacher?.name ?? 'to be announced'}</p>
        </section>
      </div>
    </main>
  )
}

export default App
