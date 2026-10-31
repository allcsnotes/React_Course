import { createRoot } from 'react-dom/client'
import './index.css'
import { CourseCard } from './CourseCard.tsx'

createRoot(document.getElementById('root')!).render(
  <CourseCard title="React for Beginners" teacher="Meera" lessons={4} price={499} />,
)
