export default function App() {
  let count = 0

  function handleClick() {
    count = count + 1
    console.log('count is', count)
  }

  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Add one
      </button>
    </div>
  )
}
