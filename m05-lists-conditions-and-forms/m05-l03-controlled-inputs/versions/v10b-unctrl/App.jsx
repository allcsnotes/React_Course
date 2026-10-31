function App() {
  console.log('drawing')

  return (
    <div className="page">
      <label htmlFor="name">Uncontrolled</label>
      <input id="name" defaultValue="Lukas" />
    </div>
  )
}

export default App
