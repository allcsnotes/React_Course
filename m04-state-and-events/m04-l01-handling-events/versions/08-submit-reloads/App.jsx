function handleSubmit() {
  console.log('submitted')
}

function App() {
  return (
    <div className="page">
      <form onSubmit={handleSubmit}>
        <input name="name" />
        <button>Send</button>
      </form>
    </div>
  )
}

export default App
