import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CoursesProvider } from './CoursesProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <CoursesProvider>
    <App />
  </CoursesProvider>,
)
