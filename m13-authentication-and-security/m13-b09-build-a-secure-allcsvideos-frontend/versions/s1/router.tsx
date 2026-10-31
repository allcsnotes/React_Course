import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout.tsx'
import Dashboard from './Dashboard.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [{ index: true, element: <Dashboard /> }],
  },
])
