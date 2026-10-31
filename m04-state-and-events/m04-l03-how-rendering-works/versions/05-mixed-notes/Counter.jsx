import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  function addSix() {
    setCount(count + 5)
    setCount(c => c + 1)
  }

  return (
    <div className="box">
      <h2>Counter</h2>
      <p className="num">Count: {count}</p>
      <button onClick={addSix}>Add 6</button>
    </div>
  )
}

export default Counter
