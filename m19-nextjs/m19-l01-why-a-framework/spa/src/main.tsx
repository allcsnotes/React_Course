import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Catalog from './Catalog.tsx'
import Course from './Course.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Catalog /> },
  { path: '/courses/:slug', element: <Course /> },
])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
