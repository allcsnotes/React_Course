import { useState } from 'react'

let childDraws = 0

function Child() {
  childDraws++
  console.log('Child render')
  return <p className="note">Child drawn {childDraws} times</p>
}

export default function D1() {
  const [n, setN] = useState(0)
  console.log('Parent render', n)
  return (
    <main>
      <h1>Parent n = {n}</h1>
      <button onClick={() => setN(n + 1)}>add one</button>
      <button onClick={() => setN(0)}>set to 0</button>
      <Child />
    </main>
  )
}
