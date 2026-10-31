function handleChange(e) {
  console.log(e.target.value)
}

function App() {
  return (
    <div className="page">
      <input
        className="search"
        placeholder="Search courses"
        onChange={handleChange}
      />
    </div>
  )
}

export default App
