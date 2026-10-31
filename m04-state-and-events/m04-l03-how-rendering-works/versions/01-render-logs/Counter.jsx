import { useState } from 'react'
import Heading from './Heading.jsx'

function Counter() {
  const [count, setCount] = useState(0)
  console.log('Counter render', count)

  function add() {
    setCount(count + 1)
  }

  return (
    <div className="box">
      <Heading />
      <p className="num">Count: {count}</p>
      <button onClick={add}>Add 1</button>
    </div>
  )
}

export default Counter
