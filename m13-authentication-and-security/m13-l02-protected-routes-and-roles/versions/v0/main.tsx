import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthProvider } from './auth'
import { RequireAuth } from './guard'
import { AppLayout } from './layout'
import { Admin, Home, Login, MyCourses, Studio } from './pages'
import './index.css'

const router = createBrowserRouter([
  { element: <AppLayout />, children: [
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { element: <RequireAuth />, children: [
      { path: '/my-courses', element: <MyCourses /> },
    ] },
    { element: <RequireAuth />, children: [
      { path: '/studio', element: <Studio /> },
    ] },
    { element: <RequireAuth />, children: [
      { path: '/admin', element: <Admin /> },
    ] },
  ] },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
