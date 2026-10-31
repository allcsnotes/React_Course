import { useEffect, useState } from 'react'

type BoxProps = { draft: string; onChange: (v: string) => void }

function Box({ draft, onChange }: BoxProps) {
  useEffect(() => {
    console.log('Box mounted')
    return () => console.log('Box unmounted')
  }, [])
  return (
    <input
      value={draft}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default function App() {
  const [draft, setDraft] = useState('')

  return (
    <main>
      <h1>Write a message</h1>
      <Box draft={draft} onChange={setDraft} />
    </main>
  )
}
