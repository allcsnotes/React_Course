import { useState, useTransition } from 'react'
import Gallery from './Gallery'
import SearchBar from './SearchBar'

export default function App() {
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  return (
    <div className="app">
      <SearchBar
        value={text}
        onChange={(v) => {
          setText(v)
          startTransition(() => setQuery(v))
        }}
      />
      <div className={isPending ? 'dim' : ''}>
        <Gallery query={query} />
      </div>
    </div>
  )
}
