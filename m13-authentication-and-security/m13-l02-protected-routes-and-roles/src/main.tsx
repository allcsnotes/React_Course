import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthProvider } from './auth'
import { RequireRole } from './guard'
import { AppLayout } from './layout'
import { ACCESS } from './roles'
import { Admin, Home, Login, MyCourses, Studio } from './pages'
import './index.css'

const router = createBrowserRouter([
  { element: <AppLayout />, children: [
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { element: <RequireRole roles={ACCESS.mine} />, children: [
      { path: '/my-courses', element: <MyCourses /> },
    ] },
    { element: <RequireRole roles={ACCESS.studio} />, children: [
      { path: '/studio', element: <Studio /> },
    ] },
    { element: <RequireRole roles={ACCESS.admin} />, children: [
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
