'use client'
import { useState } from 'react'

export default function Counter() {
  const [n, setN] = useState(0)
  const add = () => setN(n + 1)
  return <button onClick={add}>CLIENT-LABEL {n}</button>
}
