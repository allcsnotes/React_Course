import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  console.log('Counter render', count)

  function addThree() {
    setCount(c => c + 1)
    setCount(c => c + 1)
    setCount(c => c + 1)
  }

  return (
    <div className="box">
      <h2>Counter</h2>
      <p className="num">Count: {count}</p>
      <button onClick={addThree}>Add 3</button>
    </div>
  )
}

export default Counter
