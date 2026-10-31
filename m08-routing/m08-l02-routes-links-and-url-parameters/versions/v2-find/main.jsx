import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import './App.css'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Course from './pages/Course.jsx'
import MyCourses from './pages/MyCourses.jsx'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/catalog', element: <Catalog /> },
  { path: '/courses/:slug', element: <Course /> },
  { path: '/my-courses', element: <MyCourses /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
