import { useState } from 'react'
import Gallery from './Gallery'
import SearchBar from './SearchBar'

export default function App() {
  const [query, setQuery] = useState('')

  return (
    <div className="app">
      <SearchBar value={query} onChange={setQuery} />
      <Gallery query={query} />
    </div>
  )
}
