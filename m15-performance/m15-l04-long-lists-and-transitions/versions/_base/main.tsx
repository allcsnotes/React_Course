import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { watchKeys, watchStart } from './stopwatch.ts'

const t0 = performance.now()
flushSync(() => createRoot(document.getElementById('root')!).render(<App />))
watchStart(t0)
watchKeys()
