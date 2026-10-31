'use client'

import { useState } from 'react'

export const metadata = { title: 'Enroll' }

export default function Page() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>Enrolled: {n}</button>
}
