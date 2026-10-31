import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import D1 from './d1'
import D1b from './d1b'
import D2 from './d2'
import D2b from './d2b'
import D6a from './d6a'
import D6b from './d6b'
import D3a from './d3a'
import D3b from './d3b'
import D4 from './d4'
import D5a from './d5a'
import D5b from './d5b'

const q = new URLSearchParams(location.search)
const demos: Record<string, () => React.ReactNode> = {
  d1: () => <D1 />, d1b: () => <D1b />, d2: () => <D2 />, d2b: () => <D2b />, d6a: () => <D6a />, d6b: () => <D6b />, d3a: () => <D3a />, d3b: () => <D3b />,
  d4: () => <D4 />, d5a: () => <D5a />, d5b: () => <D5b />,
}
const App = demos[q.get('d') ?? 'd1']
const tree = <>{App()}</>
createRoot(document.getElementById('root')!).render(q.get('strict') ? <StrictMode>{tree}</StrictMode> : tree)
