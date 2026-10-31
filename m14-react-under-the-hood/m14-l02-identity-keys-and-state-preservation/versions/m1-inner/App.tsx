import { useEffect, useState } from 'react'

export default function App() {
  const [draft, setDraft] = useState('')

  function Box() {
    useEffect(() => {
      console.log('Box mounted')
      return () => console.log('Box unmounted')
    }, [])
    return (
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
      />
    )
  }

  return (
    <main>
      <h1>Write a message</h1>
      <Box />
    </main>
  )
}
