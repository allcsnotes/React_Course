import { createRoot } from 'react-dom/client'
import { onCLS, onINP, onLCP } from 'web-vitals'
import './index.css'
import App from './App.tsx'

for (const watch of [onLCP, onINP, onCLS]) {
  watch(
    (m) => {
      const v = m.value.toFixed(m.name === 'CLS' ? 3 : 0)
      console.log(`${m.name} ${v} ${m.rating}`)
    },
    { reportAllChanges: true },
  )
}

createRoot(document.getElementById('root')!).render(<App />)
