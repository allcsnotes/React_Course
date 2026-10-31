import { Profiler } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function report(id: string, phase: string, ms: number) {
  console.log(`${id} ${phase}: ${ms.toFixed(1)} ms`)
}

createRoot(document.getElementById('root')!).render(
  <Profiler id="page" onRender={report}>
    <App />
  </Profiler>,
)
