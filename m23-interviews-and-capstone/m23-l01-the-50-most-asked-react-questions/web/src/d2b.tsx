import { useEffect, useState } from 'react'

export default function D2b() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const log = () => console.log('count is', count)
    const id = setInterval(log, 1000)
    return () => clearInterval(id)
  }, [count])

  return (
    <main>
      <h1>Clicked {count} times</h1>
      <button onClick={() => setCount(count + 1)}>add one</button>
    </main>
  )
}
