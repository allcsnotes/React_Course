function Header() {
  return (
    <header className="header">
      <h1>allcsvideos</h1>
      <p>Learn to code with videos</p>
    </header>
  )
}

function CourseCard() {
  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      <p>12 lessons</p>
      <p>Rs 499</p>
    </div>
  )
}

function App() {
  return (
    <main className="page">
      <Header />
      <CourseCard />
    </main>
  )
}

export default App
