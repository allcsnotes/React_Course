import { useState, useEffect } from 'react'
import './App.css'

let renders = 0
const user = { first: 'Asha', last: 'Rao' }

function Greeting({ first, last }) {
  const [full, setFull] = useState('')

  useEffect(() => {
    setFull(first + ' ' + last)
  }, [first, last])

  console.log('render', ++renders, JSON.stringify(full))

  return <p className="big">Hello, {full}!</p>
}

export default function App() {
  return (
    <div className="card">
      <h2>Welcome back</h2>
      <Greeting first={user.first} last={user.last} />
    </div>
  )
}
