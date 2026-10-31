import { useState } from 'react'

export default function Ex11() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Nothing yet')

  function handleClick() {
    setCount(count + 1)
    setMessage('The count was ' + count + ' when you clicked')
  }

  return (
    <div className="card">
      <p>Count: {count}</p>
      <p>{message}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
