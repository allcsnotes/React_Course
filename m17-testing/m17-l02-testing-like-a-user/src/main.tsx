import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CoursePage } from './CoursePage.tsx'
import { CoursePageDiv } from './CoursePageDiv.tsx'

const Page = location.search === '?div' ? CoursePageDiv : CoursePage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
