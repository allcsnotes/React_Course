import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout.tsx'
import RequireRole from './RequireRole.tsx'
import { ACCESS } from './roles.ts'
import Dashboard from './Dashboard.tsx'
import InstructorPage from './InstructorPage.tsx'
import AdminPage from './AdminPage.tsx'
import LoginPage from './LoginPage.tsx'
import SignupPage from './SignupPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        element: <RequireRole roles={ACCESS.mine} />,
        children: [{ index: true, element: <Dashboard /> }],
      },
      {
        element: <RequireRole roles={ACCESS.studio} />,
        children: [{ path: 'studio', element: <InstructorPage /> }],
      },
      {
        element: <RequireRole roles={ACCESS.admin} />,
        children: [{ path: 'admin', element: <AdminPage /> }],
      },
    ],
  },
])
