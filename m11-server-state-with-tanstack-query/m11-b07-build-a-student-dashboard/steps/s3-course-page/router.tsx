import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout.tsx'
import Dashboard from './Dashboard.tsx'
import CoursePage from './CoursePage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'course/:slug', element: <CoursePage /> },
    ],
  },
])
