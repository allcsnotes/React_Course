import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// No StrictMode on purpose: the counters and the network log in tasks 1, 2 and 8 count real runs.
createRoot(document.getElementById('root')!).render(<App />)
