import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout.tsx'
import Dashboard from './Dashboard.tsx'
import LoginPage from './LoginPage.tsx'
import SignupPage from './SignupPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
])
