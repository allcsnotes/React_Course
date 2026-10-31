import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  console.log('Counter render', count)

  function handleClick() {
    setCount(count + 1)
    console.log('count is', count)
  }

  return (
    <div className="box">
      <h2>Counter</h2>
      <p className="num">Count: {count}</p>
      <button onClick={handleClick}>Add 1</button>
    </div>
  )
}

export default Counter
