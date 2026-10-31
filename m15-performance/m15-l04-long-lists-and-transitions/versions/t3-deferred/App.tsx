import { useDeferredValue, useState } from 'react'
import Gallery from './Gallery'
import SearchBar from './SearchBar'

export default function App() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  return (
    <div className="app">
      <SearchBar value={query} onChange={setQuery} />
      <div className={query !== deferredQuery ? 'dim' : ''}>
        <Gallery query={deferredQuery} />
      </div>
    </div>
  )
}
