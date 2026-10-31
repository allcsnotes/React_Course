import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

localStorage.setItem('token', 'practice-token-123')

createRoot(document.getElementById('root')!).render(<App />)
