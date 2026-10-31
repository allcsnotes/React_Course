import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// No StrictMode here on purpose: the render counters in exercises 3, 9, 15 and 16
// count once per draw. Exercise 13 puts StrictMode back around itself.
createRoot(document.getElementById('root')!).render(<App />)
