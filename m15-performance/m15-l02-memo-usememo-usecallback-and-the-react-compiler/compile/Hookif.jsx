import { useState } from 'react'

export default function Panel({ open }) {
  if (open) {
    const [x] = useState(0)
    return <p>{x}</p>
  }
  return null
}
